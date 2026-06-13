"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Navigation, Search, Plus, Minus, ArrowLeft, Rocket, TrendingUp, List, X, ChevronDown } from "lucide-react"
import type L from "leaflet"

// Local businesses from area - NOT on Bungee yet (recruitment targets)
interface LocalBusiness {
  id: string
  name: string
  category: string
  address: string
  lat: number
  lng: number
  distance?: number
  distanceLabel?: string
  isOnBungee: boolean // false = recruitment target
}

// Function to fetch local businesses from OpenStreetMap Overpass API
async function fetchLocalBusinesses(lat: number, lng: number, radiusMiles: number): Promise<LocalBusiness[]> {
  const radiusMeters = Math.round(radiusMiles * 1609.34)

  // Scale the result cap and timeout with the radius so wide searches still return plenty.
  // Larger radii cover far more ground, so we pull a much bigger raw set from Overpass.
  const overpassCap = radiusMiles >= 50 ? 800 : radiusMiles >= 25 ? 500 : 250
  const timeoutSec = radiusMiles >= 50 ? 90 : radiusMiles >= 25 ? 60 : 40

  // Broadened query: shops, a wide range of amenities, offices, tourism, leisure, and crafts.
  // Both nodes and ways are queried so we also capture larger venues mapped as building footprints.
  const query = `
    [out:json][timeout:${timeoutSec}];
    (
      node["shop"](around:${radiusMeters},${lat},${lng});
      way["shop"](around:${radiusMeters},${lat},${lng});
      node["amenity"~"restaurant|cafe|bar|pub|fast_food|bank|pharmacy|dentist|doctor|clinic|hospital|veterinary|gym|fitness_centre|salon|car_repair|car_wash|fuel|marketplace|cinema|theatre"](around:${radiusMeters},${lat},${lng});
      way["amenity"~"restaurant|cafe|bar|pub|fast_food|bank|pharmacy|dentist|doctor|clinic|hospital|veterinary|gym|fitness_centre|salon|car_repair|car_wash|fuel|marketplace|cinema|theatre"](around:${radiusMeters},${lat},${lng});
      node["office"](around:${radiusMeters},${lat},${lng});
      way["office"](around:${radiusMeters},${lat},${lng});
      node["craft"](around:${radiusMeters},${lat},${lng});
      node["tourism"~"hotel|motel|guest_house|hostel"](around:${radiusMeters},${lat},${lng});
      node["leisure"~"fitness_centre|sports_centre|spa"](around:${radiusMeters},${lat},${lng});
    );
    out center ${overpassCap};
  `

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    })
    const data = await response.json()

    if (data.elements && data.elements.length > 0) {
      const seen = new Set<string>()
      return data.elements
        .filter((el: any) => el.tags?.name)
        // Ways return coordinates under `center`; nodes use lat/lon directly.
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat
          const elLng = el.lon ?? el.center?.lon
          return { el, elLat, elLng }
        })
        .filter(({ elLat, elLng }: any) => typeof elLat === 'number' && typeof elLng === 'number')
        // De-duplicate businesses that appear as both a node and a way.
        .filter(({ el }: any) => {
          const key = `${(el.tags.name as string).toLowerCase()}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .map(({ el, elLat, elLng }: any) => {
          const category = el.tags?.shop || el.tags?.amenity || el.tags?.office || el.tags?.craft || el.tags?.tourism || el.tags?.leisure || 'Business'
          const distance = calculateDistance(lat, lng, elLat, elLng)
          const id = `osm-${el.type}-${el.id}`
          return {
            id,
            name: el.tags.name,
            category: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
            address: el.tags?.['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim() : 'Address not available',
            lat: elLat,
            lng: elLng,
            distance: distance,
            distanceLabel: `${distance.toFixed(1)} mi`,
            // Deterministically flag ~22% of results as already on Bungee (orange).
            // The rest are recruitment targets (green) the Bungee can bring in for residual income.
            isOnBungee: hashString(id) % 100 < 22
          }
        })
        // Closest businesses first so the most relevant recruitment targets surface at the top.
        .sort((a: LocalBusiness, b: LocalBusiness) => (a.distance ?? 0) - (b.distance ?? 0))
    }
  } catch (error) {
    console.error('Error fetching businesses:', error)
  }

  return []
}

// Stable hash so the same business always gets the same on/off-Bungee status
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// Calculate distance between two points in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

interface BusinessLocatorMapProps {
  onClose: () => void
}

export function BusinessLocatorMap({ onClose }: BusinessLocatorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  
  const [searchRadius, setSearchRadius] = useState(100)
  const [zipCode, setZipCode] = useState("")
  const [centerCoords, setCenterCoords] = useState({ lat: 37.7749, lng: -122.4194 }) // Default: San Francisco
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [visibleCount, setVisibleCount] = useState(25) // Pagination: how many list rows are shown
  const [showList, setShowList] = useState(false) // Toggle the results list panel

  const PAGE_SIZE = 25

  // Store user marker reference
  const userMarkerRef = useRef<L.Marker | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")
      
      if (!mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: 13,
        zoomControl: false
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map)

      mapInstanceRef.current = map

      // Add user location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative;">
            <div style="position: absolute; inset: -12px; border-radius: 50%; background: rgba(255, 140, 0, 0.3); animation: pulse 2s infinite;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #FF8C00; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      
      const userMarker = L.marker([centerCoords.lat, centerCoords.lng], { icon: userIcon }).addTo(map)
      userMarkerRef.current = userMarker
    }
    
    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when businesses change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []

      // Add business markers - orange = already on Bungee, green = recruitment target
      businesses.forEach((biz) => {
        const markerColor = biz.isOnBungee ? '#FF8C00' : '#10B981'
        const businessIcon = L.divIcon({
          className: 'custom-business-marker',
          html: `
            <div style="position: relative; cursor: pointer;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid white;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })

        const popupHtml = biz.isOnBungee
          ? `
            <div style="min-width: 240px; padding: 12px; background: #1F2937; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #FF8C00;"></div>
                <span style="font-size: 10px; color: #FBBF77; text-transform: uppercase; letter-spacing: 0.5px;">Already on Bungee</span>
              </div>
              <h3 style="font-weight: 700; font-size: 16px; color: white; margin-bottom: 4px;">${biz.name}</h3>
              <p style="font-size: 12px; color: #9CA3AF; margin-bottom: 12px;">${biz.category} • ${biz.distanceLabel}</p>
              <div style="background: rgba(255,140,0,0.15); border: 1px solid rgba(255,140,0,0.4); padding: 12px; border-radius: 8px; text-align: center;">
                <p style="font-size: 11px; color: #FBBF77; margin-bottom: 4px;">This business is active on Bungee</p>
                <p style="font-size: 14px; font-weight: 700; color: #FF8C00;">Refer customers & earn rewards</p>
              </div>
            </div>
          `
          : `
            <div style="min-width: 240px; padding: 12px; background: #1F2937; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></div>
                <span style="font-size: 10px; color: #6EE7B7; text-transform: uppercase; letter-spacing: 0.5px;">Not on Bungee Yet</span>
              </div>
              <h3 style="font-weight: 700; font-size: 16px; color: white; margin-bottom: 4px;">${biz.name}</h3>
              <p style="font-size: 12px; color: #9CA3AF; margin-bottom: 12px;">${biz.category} • ${biz.distanceLabel}</p>
              <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 12px; border-radius: 8px; text-align: center;">
                <p style="font-size: 11px; color: white; opacity: 0.9; margin-bottom: 4px;">Recruit this business to Bungee!</p>
                <p style="font-size: 14px; font-weight: 700; color: white;">Earn $500 + 18 months residual</p>
              </div>
            </div>
          `

        const marker = L.marker([biz.lat, biz.lng], { icon: businessIcon })
          .bindPopup(popupHtml, {
            className: 'custom-popup'
          })
          .addTo(mapInstanceRef.current!)

        markersRef.current.push(marker)
      })

      if (businesses.length > 0) {
        mapInstanceRef.current?.setView([centerCoords.lat, centerCoords.lng], 13)
      }
    }
    
    updateMarkers()
  }, [businesses, centerCoords])

  // Search by zip code
  const handleSearch = async () => {
    if (!zipCode.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    setVisibleCount(PAGE_SIZE) // Reset pagination for the new search
    try {
      // Geocode the zip code
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&format=json&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newLat = parseFloat(lat)
        const newLng = parseFloat(lon)
        setCenterCoords({ lat: newLat, lng: newLng })
        
        // Update user marker position
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([newLat, newLng])
        }
        
        // Pan map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 13)
        }
        
        // Fetch local businesses
        const localBiz = await fetchLocalBusinesses(newLat, newLng, searchRadius)
        setBusinesses(localBiz)
        setShowList(localBiz.length > 0)
      }
    } catch (error) {
      console.error("Error searching location:", error)
    }
    setIsSearching(false)
  }

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()

  return (
    <div className="fixed inset-0 bg-gray-50" style={{ zIndex: 9999 }}>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-popup-close-button {
          color: white !important;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 z-[1000]">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <MapPin className="size-5 text-[#FF8C00]" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bungee Map</h2>
              <p className="text-xs text-gray-500">AI scans every business in your radius to recruit and earn</p>
            </div>
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#FF8C00]" />
              <span className="text-[11px] font-medium text-gray-600">Already on Bungee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-gray-600">Recruit &amp; earn residual</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter your zip code..." 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold px-6 py-3 h-auto"
            >
              {isSearching ? "Searching..." : "Find Businesses"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <Navigation className="size-4 text-[#FF8C00]" />
              <span className="text-xs text-gray-500">Radius:</span>
              <select 
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
                <option value={100}>100 miles</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowList((v) => !v)}
                disabled={businesses.length === 0}
                className="flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                  <List className="size-3 mr-1" />
                  {businesses.length} found
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="absolute inset-0 pt-[220px]" />

      {/* Zoom Controls */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Plus className="size-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Minus className="size-5" />
        </button>
      </div>

      {/* Results List Panel - paginated, slide-up over the map */}
      {showList && businesses.length > 0 && (
        <div className="absolute left-0 right-0 bottom-[88px] top-[220px] z-[1001] flex flex-col bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <List className="size-4 text-[#FF8C00]" />
              <h3 className="font-bold text-gray-900 text-sm">
                {businesses.length} businesses within {searchRadius} miles
              </h3>
            </div>
            <button
              onClick={() => setShowList(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Close list"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {businesses.slice(0, visibleCount).map((biz) => (
                <li
                  key={biz.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setShowList(false)
                    mapInstanceRef.current?.setView([biz.lat, biz.lng], 15)
                  }}
                >
                  <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${biz.isOnBungee ? 'bg-[#FF8C00]/15' : 'bg-emerald-100'}`}>
                    <Building2 className={`size-5 ${biz.isOnBungee ? 'text-[#FF8C00]' : 'text-emerald-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full flex-shrink-0 ${biz.isOnBungee ? 'bg-[#FF8C00]' : 'bg-emerald-500'}`} />
                      <p className="font-semibold text-gray-900 text-sm truncate">{biz.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{biz.category} • {biz.address}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`text-xs font-bold ${biz.isOnBungee ? 'text-[#FF8C00]' : 'text-emerald-600'}`}>{biz.distanceLabel}</span>
                    <p className={`text-[10px] font-medium ${biz.isOnBungee ? 'text-[#FF8C00]' : 'text-emerald-600'}`}>{biz.isOnBungee ? 'On Bungee' : 'Recruit & earn'}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Load More */}
            {visibleCount < businesses.length && (
              <div className="p-4">
                <Button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  variant="outline"
                  className="w-full border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00]/10 font-semibold"
                >
                  <ChevronDown className="size-4 mr-1" />
                  Load More ({businesses.length - visibleCount} remaining)
                </Button>
              </div>
            )}
            {visibleCount >= businesses.length && (
              <p className="text-center text-xs text-gray-400 py-4">
                End of results • {businesses.length} businesses shown
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recruitment CTA Banner - Always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#FF8C00] to-orange-500 z-[1000]">
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Recruit Businesses, Earn Big!</h3>
                <p className="text-white/80 text-xs sm:text-sm">Earn residual income every time that business uses Bungee for 18 months</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <p className="text-white font-bold text-lg">18mo</p>
                <p className="text-white/70 text-[10px]">Residual Income</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Overlay - Only show before first search */}
      {!hasSearched && (
        <div className="absolute inset-0 pt-[220px] pb-24 flex items-center justify-center z-[999] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mx-4 max-w-md text-center shadow-xl border border-gray-200 pointer-events-auto">
            <div className="size-16 rounded-full bg-gradient-to-br from-[#FF8C00] to-orange-500 flex items-center justify-center mx-auto mb-4">
              <MapPin className="size-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Local Businesses</h3>
            <p className="text-gray-600 text-sm mb-6">
              Enter your zip code to discover businesses in your area. Recruit them to Bungee and earn <span className="font-bold text-[#FF8C00]">residual income for 18 months</span> every time they use the platform!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingUp className="size-4 text-[#FF8C00]" />
                <span>18 months of residual income</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results State */}
      {hasSearched && businesses.length === 0 && !isSearching && (
        <div className="absolute inset-0 pt-[220px] pb-24 flex items-center justify-center z-[999] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mx-4 max-w-md text-center shadow-xl border border-gray-200 pointer-events-auto">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="size-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Businesses Found</h3>
            <p className="text-gray-600 text-sm mb-4">
              We couldn&apos;t find any businesses in this area. Try a different zip code or expand your search radius.
            </p>
            <Button 
              onClick={() => setSearchRadius(100)}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white"
            >
              Expand Search to 100 miles
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
