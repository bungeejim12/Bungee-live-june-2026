"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Leaf, 
  Car, 
  Wifi, 
  Star, 
  ChevronRight, 
  X, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2,
  Gift,
  Shield,
  Award,
  Users,
  Globe,
  Building2,
  UtensilsCrossed,
  Wrench,
  Landmark,
  Smartphone,
  ShoppingCart,
  CreditCard,
  Scale,
  Share2,
  Mail,
  MessageSquare,
  Copy,
  Check
} from "lucide-react"
import Image from "next/image"

interface SponsorAd {
  title: string
  description: string
  image?: string
  discount?: string
}

interface Sponsor {
  name: string
  tagline: string
  category: string
  offer: string
  rating: number
  icon: typeof Leaf
  logo?: string
  gradient: string
  bgGradient: string
  borderColor: string
  textColor: string
  badgeBg: string
  // Extended information
  website: string
  phone: string
  description: string
  services: string[]
  locations: string
  hours: string
  founded: string
  employees: string
  ads: SponsorAd[]
  testimonials: { name: string; text: string; rating: number }[]
  specialOffers: { title: string; description: string; code?: string; expiry?: string }[]
}

// Business Dashboard Sponsors
const businessSponsors: Sponsor[] = [
  {
    name: "Freyja Financial Group",
    tagline: "Empowering Your Financial Future",
    category: "Financial Services Sponsor",
    offer: "Free Financial Consultation",
    rating: 4.9,
    icon: Landmark,
    logo: "/logos/freyja-financial.png",
    gradient: "from-emerald-600 to-teal-700",
    bgGradient: "from-emerald-600/20 to-teal-700/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20",
    website: "https://freyjafinancialgroup.com",
    phone: "Contact via Website",
    description: "Freyja Financial Group provides comprehensive financial planning and wealth management services. Our team of experts helps businesses and individuals achieve their financial goals with personalized strategies and dedicated support.",
    services: ["Financial Planning", "Wealth Management", "Business Consulting", "Investment Strategies", "Retirement Planning", "Tax Optimization"],
    locations: "Serving Clients Nationwide",
    hours: "Mon-Fri: 9AM-5PM",
    founded: "2020",
    employees: "Growing Team",
    ads: [{ title: "Your Financial Success Partner", description: "Expert guidance for your business and personal finances.", discount: "FREE CONSULT" }],
    testimonials: [{ name: "Business Owner", text: "Freyja helped us streamline our finances and plan for growth.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Free initial financial consultation for BUNGEE members", code: "BUNGEEFREYJA", expiry: "Dec 31, 2026" }]
  },
  {
    name: "United Community Bank",
    tagline: "Banking Built for Business",
    category: "Business Banking Sponsor",
    offer: "No Fees for 12 Months",
    rating: 4.8,
    icon: Landmark,
    logo: "/logos/united-community-bank.png",
    gradient: "from-blue-600 to-blue-800",
    bgGradient: "from-blue-600/20 to-blue-800/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    website: "https://www.ucbi.com",
    phone: "1-800-822-8224",
    description: "United Community Bank offers comprehensive business banking solutions with personalized service. From business checking to commercial loans, we help your business grow with competitive rates and dedicated support.",
    services: ["Business Checking & Savings", "Commercial Loans", "SBA Lending", "Treasury Management", "Merchant Services", "Business Credit Cards"],
    locations: "200+ Locations across Southeast",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-12PM",
    founded: "1950",
    employees: "3,000+",
    ads: [{ title: "Business Banking Made Simple", description: "Open a business account today and get 12 months of no monthly fees.", discount: "NO FEES" }],
    testimonials: [{ name: "Business Owner", text: "Great local bank with excellent service.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "12 months no monthly maintenance fees", code: "BUNGEEBIZ", expiry: "Dec 31, 2026" }]
  },
  {
    name: "AT&T Business",
    tagline: "Connect Your Business to What's Next",
    category: "Business Telecom Sponsor",
    offer: "Free Setup + 20% Off Plans",
    rating: 4.5,
    icon: Smartphone,
    logo: "/logos/att-business.png",
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/20",
    website: "https://www.business.att.com",
    phone: "1-800-331-0500",
    description: "AT&T Business provides enterprise-grade connectivity solutions including 5G, fiber internet, cybersecurity, and unified communications to help businesses of all sizes stay connected and secure.",
    services: ["Business Internet & Fiber", "5G Wireless Plans", "Cybersecurity Solutions", "Cloud Services", "VoIP Phone Systems", "IoT Solutions"],
    locations: "Nationwide Coverage",
    hours: "24/7 Business Support",
    founded: "1983",
    employees: "150,000+",
    ads: [{ title: "5G for Business", description: "Ultra-fast connectivity to power your business forward.", discount: "20% OFF" }],
    testimonials: [{ name: "IT Manager", text: "Reliable service with great business support.", rating: 4 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "20% off first year + free installation", code: "BUNGEEATT", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Staples Advantage",
    tagline: "Business Supplies & Solutions",
    category: "Office Supplies Sponsor",
    offer: "25% Off First Order",
    rating: 4.6,
    icon: ShoppingCart,
    logo: "/logos/staples.png",
    gradient: "from-red-500 to-red-700",
    bgGradient: "from-red-500/20 to-red-700/20",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    badgeBg: "bg-red-500/20",
    website: "https://www.staples.com/advantage",
    phone: "1-800-333-3330",
    description: "Staples Advantage is your one-stop shop for office supplies, furniture, technology, and break room essentials. Get business pricing, free delivery, and dedicated account management.",
    services: ["Office Supplies", "Furniture & Seating", "Technology & Electronics", "Break Room Supplies", "Print & Marketing", "Facilities Solutions"],
    locations: "1,000+ Stores + Delivery Nationwide",
    hours: "Mon-Sat: 8AM-9PM, Sun: 10AM-6PM",
    founded: "1986",
    employees: "70,000+",
    ads: [{ title: "Stock Your Office for Less", description: "Business accounts get exclusive pricing on thousands of items.", discount: "25% OFF" }],
    testimonials: [{ name: "Office Manager", text: "Easy ordering and fast delivery every time.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "25% off your first order over $100", code: "BUNGEESTAPLES", expiry: "Dec 31, 2026" }]
  },
  {
    name: "ADP",
    tagline: "Payroll, HR & Benefits Made Easy",
    category: "HR & Payroll Sponsor",
    offer: "3 Months Free Payroll",
    rating: 4.7,
    icon: CreditCard,
    logo: "/logos/adp.png",
    gradient: "from-red-600 to-pink-600",
    bgGradient: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-400/30",
    textColor: "text-red-400",
    badgeBg: "bg-red-400/20",
    website: "https://www.adp.com",
    phone: "1-800-225-5237",
    description: "ADP is a leading provider of payroll, HR, tax, and benefits solutions for businesses of all sizes. Simplify your workforce management with our all-in-one platform.",
    services: ["Payroll Processing", "HR Management", "Time & Attendance", "Benefits Administration", "Tax Filing & Compliance", "Talent Management"],
    locations: "Serving 140+ Countries",
    hours: "24/7 Support Available",
    founded: "1949",
    employees: "60,000+",
    ads: [{ title: "Payroll in Minutes, Not Hours", description: "Automated payroll processing with guaranteed accuracy.", discount: "3 MONTHS FREE" }],
    testimonials: [{ name: "HR Director", text: "ADP transformed how we manage our workforce.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "3 months free payroll for new clients", code: "BUNGEEADP", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Venable LLP",
    tagline: "Trusted Legal Counsel for Business",
    category: "Legal Services Sponsor",
    offer: "Free Initial Consultation",
    rating: 4.9,
    icon: Scale,
    logo: "/logos/venable.png",
    gradient: "from-slate-700 to-slate-900",
    bgGradient: "from-slate-700/20 to-slate-900/20",
    borderColor: "border-slate-500/30",
    textColor: "text-slate-300",
    badgeBg: "bg-slate-500/20",
    website: "https://www.venable.com",
    phone: "1-888-VENABLE",
    description: "Venable LLP is an American Lawyer 100 law firm with offices across the country. We provide comprehensive legal services to businesses of all sizes, from startups to Fortune 500 companies, with particular strength in corporate transactions, regulatory matters, and intellectual property.",
    services: ["Corporate & Business Law", "Intellectual Property", "Labor & Employment", "Regulatory & Government Affairs", "Litigation", "Real Estate"],
    locations: "10+ Offices Nationwide",
    hours: "Mon-Fri: 8:30AM-6PM",
    founded: "1900",
    employees: "800+ Attorneys",
    ads: [{ title: "Legal Excellence Since 1900", description: "Trusted counsel for businesses navigating complex legal challenges.", discount: "FREE CONSULT" }],
    testimonials: [{ name: "CEO, Tech Startup", text: "Venable helped us navigate our Series A with expertise and care.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Free 30-minute consultation for BUNGEE members", code: "BUNGEELEGAL", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Unity Community Bank",
    tagline: "Your Hometown Banking Partner",
    category: "Community Banking Sponsor",
    offer: "Free Business Checking",
    rating: 4.9,
    icon: Landmark,
    logo: "/logos/unity-community-bank.png",
    gradient: "from-blue-600 to-blue-800",
    bgGradient: "from-blue-600/20 to-blue-800/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    website: "https://www.unitycommunitybank.com",
    phone: "(904) 285-1900",
    description: "Unity Community Bank in Ponte Vedra Beach provides personalized banking with a local touch. We offer business and personal banking services tailored to the needs of Northeast Florida families and businesses, with decisions made locally by people who know your community.",
    services: ["Business Checking & Savings", "Personal Banking", "Commercial Loans", "Mortgage Services", "Online & Mobile Banking", "Treasury Management"],
    locations: "Ponte Vedra Beach, FL",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-12PM",
    founded: "Community Focused",
    employees: "Local Team",
    ads: [{ title: "Banking With a Personal Touch", description: "Local decisions, local service, for your local business.", discount: "FREE CHECKING" }],
    testimonials: [{ name: "Local Business Owner", text: "Finally a bank that understands small business in our community.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Free business checking for first 12 months + waived wire fees", code: "BUNGEEUNITY", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Bay Metal, Inc.",
    tagline: "Quality Recycling Since 1969",
    category: "Metal Recycling Sponsor",
    offer: "Best Prices for Scrap Metal",
    rating: 4.8,
    icon: Wrench,
    logo: "/logos/bay-metal.png",
    gradient: "from-slate-600 to-zinc-700",
    bgGradient: "from-slate-600/20 to-zinc-700/20",
    borderColor: "border-slate-500/30",
    textColor: "text-slate-300",
    badgeBg: "bg-slate-500/20",
    website: "https://www.baymetal.com",
    phone: "Contact via Website",
    description: "Since 1969, Bay Metal, Inc. has been synonymous with Quality Customer Service. We are an industry leader in environmental awareness and metal recycling, buying copper, aluminum, brass, bronze, stainless steel, and electronic scrap.",
    services: ["Copper Recycling", "Aluminum Recycling", "Brass & Bronze", "Stainless Steel", "Electronic Scrap", "Motor Recycling"],
    locations: "Chicago, Indianapolis, Memphis, Savannah & Richfield",
    hours: "Mon-Fri: 7AM-5PM, Sat: 8AM-12PM",
    founded: "1969",
    employees: "Industry Leader",
    ads: [{ title: "We Buy Your Scrap Metal", description: "Copper, aluminum, brass, stainless steel & more. Best prices guaranteed.", discount: "TOP PRICES" }],
    testimonials: [{ name: "Industrial Customer", text: "Reliable service and fair pricing for over 20 years.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Business", description: "Premium pricing for BUNGEE business members on all scrap metal", code: "BUNGEEBIZMETAL", expiry: "Dec 31, 2026" }]
  },
]

// Referral Dashboard Sponsors
const referralSponsors: Sponsor[] = [
  {
    name: "SHRM Membership",
    tagline: "Advancing HR Professionals Worldwide",
    category: "Professional Development Sponsor",
    offer: "Exclusive Member Benefits",
    rating: 4.9,
    icon: Award,
    logo: "/logos/shrm.png",
    gradient: "from-[#002855] to-[#001a3d]",
    bgGradient: "from-[#002855]/20 to-[#001a3d]/20",
    borderColor: "border-[#c5a24d]/30",
    textColor: "text-[#c5a24d]",
    badgeBg: "bg-[#c5a24d]/20",
    website: "https://www.shrm.org/membership",
    phone: "1-800-283-7476",
    description: "SHRM (Society for Human Resource Management) is the world's largest HR professional society, representing over 325,000 members in more than 165 countries. Advance your career with elite HR tools, compliance resources, and professional networking opportunities.",
    services: ["HR Compliance Resources", "Professional Certification (SHRM-CP/SCP)", "Career Development Tools", "HR Research & Insights", "Legal & Regulatory Updates", "Networking Events & Conferences"],
    locations: "Global - 165+ Countries",
    hours: "24/7 Online Resources",
    founded: "1948",
    employees: "75+ Years of Excellence",
    ads: [{ title: "Advance Your Career with SHRM", description: "Unlock elite HR tools, compliance legal resources, and professional networking nodes built to accelerate your business growth.", discount: "JOIN NOW" }],
    testimonials: [{ name: "HR Director", text: "SHRM membership transformed my career with world-class resources and networking.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Special membership rates for BUNGEE network members", code: "BUNGEESHRM", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Jiffy Lube",
    tagline: "Leave Worry Behind",
    category: "Automotive Service Sponsor",
    offer: "$15 Off Oil Change",
    rating: 4.4,
    icon: Car,
    logo: "/logos/jiffy-lube.png",
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    badgeBg: "bg-red-500/20",
    website: "https://www.jiffylube.com",
    phone: "1-800-344-6933",
    description: "Jiffy Lube is a leading provider of automotive preventive maintenance services. With over 2,000 locations, we keep your vehicle running smoothly with no appointment needed.",
    services: ["Oil Changes", "Tire Services", "Brake Services", "Battery Replacement", "Transmission Services", "Air Conditioning"],
    locations: "2,000+ Locations Nationwide",
    hours: "Mon-Sat: 8AM-7PM, Sun: 10AM-5PM",
    founded: "1979",
    employees: "25,000+",
    ads: [{ title: "Quick, Quality Oil Changes", description: "No appointment needed. In and out in minutes.", discount: "$15 OFF" }],
    testimonials: [{ name: "Customer", text: "Fast service and fair prices every time.", rating: 4 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "$15 off any Signature Service Oil Change", code: "BUNGEELUBE", expiry: "Dec 31, 2026" }]
  },
  {
    name: "National Precision Bearing",
    tagline: "Reliable. Responsive. Relentless.",
    category: "Industrial Supplier Sponsor",
    offer: "Free Technical Consultation",
    rating: 4.9,
    icon: Wrench,
    logo: "/logos/national-precision.png",
    gradient: "from-blue-800 to-slate-700",
    bgGradient: "from-blue-800/20 to-slate-700/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    website: "https://www.nationalprecision.com",
    phone: "Contact via Website",
    description: "Since 1979, National Precision Bearing has been one of the largest stocking distributors of bearings and bushings for Aerospace, Industrial, Medical, Military/Defense, and Precision applications. AS9100/ISO9001 certified with ISO Class-6 clean room assembly.",
    services: ["Ball Bearings", "Aerospace Bearings", "Miniature Bearings", "Needle Roller Bearings", "Thin Section Bearings", "Custom Solutions"],
    locations: "Nationwide - Multiple Sales Offices",
    hours: "Mon-Fri: 8AM-5PM",
    founded: "1979",
    employees: "Industry Leader",
    ads: [{ title: "Trusted Partners. Technical Solutions.", description: "Unmatched product inventory and industry-specific experience for your toughest challenges.", discount: "FREE CONSULT" }],
    testimonials: [{ name: "Aerospace Engineer", text: "NPB's inventory and expertise is second to none. They always have what we need.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Free technical consultation and priority pricing for BUNGEE members", code: "BUNGEENPB", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Leaf Home",
    tagline: "Home Services Made Simple",
    category: "Home Services Sponsor",
    offer: "Free In-Home Estimate",
    rating: 4.7,
    icon: Leaf,
    logo: "/logos/leaf-home.png",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-500/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    textColor: "text-green-400",
    badgeBg: "bg-green-500/20",
    website: "https://www.leafhome.com",
    phone: "1-800-290-6106",
    description: "Leaf Home offers comprehensive home improvement solutions including gutter protection, water management, and safety products. Protect your home with America's #1 rated solutions.",
    services: ["LeafFilter Gutter Protection", "Leaf Home Water Solutions", "Leaf Home Safety Solutions", "LeafFilter Gutter Guards", "Foundation Repair", "Basement Waterproofing"],
    locations: "Nationwide Service",
    hours: "Mon-Sat: 8AM-8PM",
    founded: "2005",
    employees: "5,000+",
    ads: [{ title: "Never Clean Your Gutters Again", description: "Patented micro-mesh technology keeps debris out forever.", discount: "FREE ESTIMATE" }],
    testimonials: [{ name: "Homeowner", text: "Best investment for our home. Professional installation.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "20% off + free installation", code: "BUNGEELEAF", expiry: "Dec 31, 2026" }]
  },
  {
    name: "United Community Bank",
    tagline: "Banking Built for You",
    category: "Personal Banking Sponsor",
    offer: "No Fees for 12 Months",
    rating: 4.8,
    icon: Landmark,
    logo: "/logos/united-community-bank.png",
    gradient: "from-blue-600 to-blue-800",
    bgGradient: "from-blue-600/20 to-blue-800/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    badgeBg: "bg-blue-500/20",
    website: "https://www.ucbi.com",
    phone: "1-800-822-8224",
    description: "United Community Bank offers comprehensive personal banking solutions with personalized service. From checking accounts to home loans, we help you achieve your financial goals with competitive rates and dedicated support.",
    services: ["Personal Checking & Savings", "Home Loans & Mortgages", "Auto Loans", "Personal Credit Cards", "Online & Mobile Banking", "Investment Services"],
    locations: "200+ Locations across Southeast",
    hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-12PM",
    founded: "1950",
    employees: "3,000+",
    ads: [{ title: "Personal Banking Made Simple", description: "Open an account today and get 12 months of no monthly fees.", discount: "NO FEES" }],
    testimonials: [{ name: "Customer", text: "Great local bank with excellent service and friendly staff.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "12 months no monthly maintenance fees + $100 bonus", code: "BUNGEEPERSONAL", expiry: "Dec 31, 2026" }]
  },
  {
    name: "Tequila Redon del Diamante",
    tagline: "Premium Artisan Tequila",
    category: "Spirits & Beverage Sponsor",
    offer: "Premium Tequila Experience",
    rating: 4.9,
    icon: UtensilsCrossed,
    logo: "/logos/tequila-redon.png",
    gradient: "from-amber-500 to-amber-700",
    bgGradient: "from-amber-500/20 to-amber-700/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    badgeBg: "bg-amber-500/20",
    website: "https://www.tequilaredondeldiamante.com",
    phone: "Contact via Website",
    description: "Tequila Redon del Diamante is a premium artisan tequila crafted with tradition and excellence. Made from 100% blue Weber agave in the highlands of Jalisco, Mexico, our tequila delivers an exceptional smooth taste with notes of citrus, vanilla, and roasted agave.",
    services: ["Blanco Tequila", "Reposado Tequila", "Anejo Tequila", "Extra Anejo", "Private Tastings", "Event Catering"],
    locations: "Jalisco, Mexico - Available Nationwide",
    hours: "Order Online 24/7",
    founded: "Artisan Crafted",
    employees: "Family Owned",
    ads: [{ title: "Taste the Diamond Standard", description: "Premium 100% blue Weber agave tequila, crafted for excellence.", discount: "PREMIUM" }],
    testimonials: [{ name: "Spirits Enthusiast", text: "The smoothest tequila I've ever tasted. Truly exceptional quality.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "Complimentary tasting flight with any bottle purchase for BUNGEE members", code: "BUNGEEDIAMOND", expiry: "Dec 31, 2026" }]
  },
  {
    name: "DOME Headwear Co.",
    tagline: "Every Hat Has A Story",
    category: "Custom Apparel Sponsor",
    offer: "Custom Hat Builder Available",
    rating: 4.9,
    icon: Award,
    logo: "/logos/dome-headwear.png",
    gradient: "from-gray-900 to-gray-700",
    bgGradient: "from-gray-900/20 to-gray-700/20",
    borderColor: "border-gray-500/30",
    textColor: "text-gray-300",
    badgeBg: "bg-gray-500/20",
    website: "https://www.domeheadwear.co",
    phone: "Contact via Website",
    description: "DOME Headwear Co. is a dedicated team of creative craftsmen with one mission: to bring you the best custom headwear experience, product and service. We strive to DO BETTER with every decision we make, evolving to become a better company today than we were yesterday.",
    services: ["Custom Hats", "Snapbacks", "Dad Hats", "Beanies", "Trucker Caps", "Embroidery & Patches"],
    locations: "Nationwide Shipping",
    hours: "Order Online 24/7",
    founded: "Craftsmen Owned",
    employees: "Family Team",
    ads: [{ title: "Build Your Perfect Hat", description: "Use our Custom Hat Builder to create headwear that tells your story.", discount: "CUSTOM" }],
    testimonials: [{ name: "Business Owner", text: "DOME created exactly what we envisioned. Quality craftsmanship and great service.", rating: 5 }],
    specialOffers: [{ title: "BUNGEE Exclusive", description: "10% off custom orders + free design consultation for BUNGEE members", code: "BUNGEEDOME", expiry: "Dec 31, 2026" }]
  },
]

interface SponsorCarouselProps {
  variant?: "business" | "referral" | "native"
  isDarkMode?: boolean
}

export function SponsorCarousel({ variant = "referral", isDarkMode = false }: SponsorCarouselProps) {
  const sponsors = variant === "business" ? businessSponsors : referralSponsors
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (showDetail) return // Pause rotation when detail view is open
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sponsors.length)
        setIsTransitioning(false)
      }, 800)
    }, 5000)

    return () => clearInterval(interval)
  }, [showDetail, sponsors.length])

  // Guard against empty sponsors array
  if (sponsors.length === 0) {
    return null
  }

  const sponsor = sponsors[currentIndex % sponsors.length]
  const Icon = sponsor.icon

  const handleSponsorClick = () => {
    setSelectedSponsor(sponsor)
    setShowDetail(true)
  }

  const handleClose = () => {
    setShowDetail(false)
    setSelectedSponsor(null)
  }

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getShareText = (sponsor: Sponsor) => {
    return `Check out this exclusive offer from ${sponsor.name}!\n\n${sponsor.offer}\n\n${sponsor.description}\n\nVisit: ${sponsor.website}`
  }

  const getShareSubject = (sponsor: Sponsor) => {
    return `Exclusive BUNGEE Partner Offer: ${sponsor.name} - ${sponsor.offer}`
  }

  const handleShareEmail = (sponsor: Sponsor) => {
    const subject = encodeURIComponent(getShareSubject(sponsor))
    const body = encodeURIComponent(getShareText(sponsor))
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleShareText = (sponsor: Sponsor) => {
    const text = encodeURIComponent(getShareText(sponsor))
    // Try SMS on mobile, fallback to clipboard
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(`sms:?body=${text}`, '_blank')
    } else {
      // For desktop, copy to clipboard with a note
      navigator.clipboard.writeText(getShareText(sponsor))
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleCopyLink = (sponsor: Sponsor) => {
    const text = getShareText(sponsor)
    navigator.clipboard.writeText(text)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleNativeShare = async (sponsor: Sponsor) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getShareSubject(sponsor),
          text: getShareText(sponsor),
          url: sponsor.website,
        })
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink(sponsor)
      }
    } else {
      // Fallback for browsers without native share
      handleCopyLink(sponsor)
    }
  }

  // Native variant - Clean premium white card design
  if (variant === "native") {
    return (
      <>
        <div 
          onClick={handleSponsorClick}
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-700 cursor-pointer hover:shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'} ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {/* Partner Spotlight Label */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
            <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              Partner Spotlight
            </span>
          </div>

          <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
            {/* Logo */}
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {sponsor.logo ? (
                <Image 
                  src={sponsor.logo} 
                  alt={`${sponsor.name} logo`}
                  width={64}
                  height={64}
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                  unoptimized
                />
              ) : (
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${sponsor.textColor}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{sponsor.name}</h3>
              <p className={`text-[10px] sm:text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{sponsor.tagline}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="size-3 text-yellow-400 fill-yellow-400" />
                  <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sponsor.rating}</span>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded ${sponsor.badgeBg} ${sponsor.textColor}`}>
                  {sponsor.offer}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>

          {/* Progress bar - subtle */}
          <div className={`h-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div 
              className={`h-full bg-gradient-to-r ${sponsor.gradient} transition-all duration-300`}
              style={{
                animation: isTransitioning ? 'none' : 'nativeProgress 5s linear',
                width: isTransitioning ? '0%' : '100%'
              }}
            />
          </div>

          <style jsx>{`
            @keyframes nativeProgress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>

        {/* Sponsor Detail Modal */}
        {showDetail && selectedSponsor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleClose}>
            <div 
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Brand Accent */}
              <div className={`sticky top-0 z-10 p-4 sm:p-6 bg-gradient-to-r ${selectedSponsor.gradient} border-b border-gray-200`}>
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 size-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-md"
                >
                  <X className="size-5 text-gray-700" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-xl bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
                    {selectedSponsor.logo ? (
                      <Image 
                        src={selectedSponsor.logo} 
                        alt={`${selectedSponsor.name} logo`}
                        width={80}
                        height={80}
                        className="size-12 sm:size-16 object-contain"
                        unoptimized
                      />
                    ) : (
                      (() => {
                        const SponsorIcon = selectedSponsor.icon
                        return <SponsorIcon className={`size-10 sm:size-12 ${selectedSponsor.textColor}`} />
                      })()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/90 text-gray-700 border-0 font-semibold">PARTNER</Badge>
                      <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-800">{selectedSponsor.rating}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">{selectedSponsor.name}</h2>
                    <p className="text-sm sm:text-base text-white/90">{selectedSponsor.tagline}</p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    onClick={() => handleVisitWebsite(selectedSponsor.website)}
                    className="bg-white hover:bg-gray-50 text-gray-800 gap-2 font-semibold shadow-md"
                  >
                    <Globe className="size-4" />
                    Visit Website
                    <ExternalLink className="size-3" />
                  </Button>
                  <Button variant="outline" className="border-white/80 bg-white/20 text-white hover:bg-white/30 gap-2 font-medium">
                    <Phone className="size-4" />
                    {selectedSponsor.phone}
                  </Button>
                </div>
                
                {/* Share Actions */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-white/80 text-xs font-medium mb-2">Share this offer:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleShareEmail(selectedSponsor)}
                      size="sm"
                      variant="outline" 
                      className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                    >
                      <Mail className="size-3.5" />
                      Email
                    </Button>
                    <Button 
                      onClick={() => handleShareText(selectedSponsor)}
                      size="sm"
                      variant="outline" 
                      className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                    >
                      <MessageSquare className="size-3.5" />
                      Text
                    </Button>
                    <Button 
                      onClick={() => handleCopyLink(selectedSponsor)}
                      size="sm"
                      variant="outline" 
                      className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                    >
                      {copiedLink ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copiedLink ? "Copied!" : "Copy"}
                    </Button>
                    <Button 
                      onClick={() => handleNativeShare(selectedSponsor)}
                      size="sm"
                      variant="outline" 
                      className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                    >
                      <Share2 className="size-3.5" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content - Clean white background */}
              <div className="p-4 sm:p-6 space-y-6 bg-white">
                {/* About Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Award className={`size-5 ${selectedSponsor.textColor}`} />
                    About {selectedSponsor.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedSponsor.description}</p>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSponsor.services.map((service, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Special Offers */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Gift className={`size-5 ${selectedSponsor.textColor}`} />
                    Special Offers
                  </h3>
                  <div className="space-y-3">
                    {selectedSponsor.specialOffers.map((offer, index) => (
                      <div key={index} className={`p-4 rounded-xl bg-gradient-to-r ${selectedSponsor.bgGradient} border ${selectedSponsor.borderColor}`}>
                        <h4 className="font-bold text-gray-900">{offer.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{offer.description}</p>
                        {offer.code && (
                          <div className="mt-2 flex items-center gap-2">
                            <code className={`px-3 py-1 rounded bg-white/80 ${selectedSponsor.textColor} font-mono text-sm font-bold border`}>{offer.code}</code>
                            {offer.expiry && <span className="text-xs text-gray-600">Expires: {offer.expiry}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div 
        onClick={handleSponsorClick}
        className={`relative flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-gradient-to-r ${sponsor.bgGradient} border ${sponsor.borderColor} shadow-sm transition-all duration-500 ${isTransitioning ? "opacity-0 scale-98" : "opacity-100 scale-100"} cursor-pointer hover:shadow-md hover:border-opacity-60 group`}
      >
        {/* Logo */}
        <div className={`size-5 sm:size-8 rounded-md bg-gradient-to-br ${sponsor.gradient} flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden`}>
          {sponsor.logo ? (
            <Image 
              src={sponsor.logo} 
              alt={`${sponsor.name} logo`}
              width={32}
              height={32}
              className="size-4 sm:size-6 object-contain"
              unoptimized
            />
          ) : (
            <Icon className="size-3 sm:size-4 text-gray-900" />
          )}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Badge className={`${sponsor.badgeBg} ${sponsor.textColor} border-0 text-[5px] sm:text-[8px] px-1 py-0 h-2.5 sm:h-3.5`}>AD</Badge>
          </div>
          <p className="text-[10px] sm:text-sm font-bold text-gray-900 truncate">{sponsor.name}</p>
        </div>

        {/* Offer & Rating - Hidden on mobile */}
        <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            <Star className="size-2.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-semibold text-gray-900">{sponsor.rating}</span>
          </div>
          <div className={`px-1.5 py-0.5 rounded bg-gradient-to-r ${sponsor.gradient} shadow-sm`}>
            <p className="text-[8px] font-bold text-gray-900 whitespace-nowrap">{sponsor.offer}</p>
          </div>
        </div>

        {/* CTA Arrow - Hidden on mobile */}
        <div className={`hidden sm:flex size-6 rounded-full bg-gradient-to-br ${sponsor.gradient} items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
          <ChevronRight className="size-3 text-gray-900" />
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-2 sm:left-5 right-2 sm:right-5 h-0.5 bg-gray-100/50 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${sponsor.gradient} rounded-full`}
            style={{
              animation: isTransitioning ? 'none' : 'progress 5s linear',
              width: isTransitioning ? '0%' : '100%'
            }}
          />
        </div>

        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>

      {/* Sponsor Detail Modal */}
      {showDetail && selectedSponsor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleClose}>
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Brand Accent */}
            <div className={`sticky top-0 z-10 p-4 sm:p-6 bg-gradient-to-r ${selectedSponsor.gradient}`}>
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 size-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-md"
              >
                <X className="size-5 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="size-16 sm:size-20 rounded-xl bg-white/90 flex items-center justify-center shadow-lg overflow-hidden">
                  {selectedSponsor.logo ? (
                    <Image 
                      src={selectedSponsor.logo} 
                      alt={`${selectedSponsor.name} logo`}
                      width={80}
                      height={80}
                      className="size-12 sm:size-16 object-contain"
                      unoptimized
                    />
                  ) : (
                    (() => {
                      const SponsorIcon = selectedSponsor.icon
                      return <SponsorIcon className={`size-10 sm:size-12 ${selectedSponsor.textColor}`} />
                    })()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-white/90 text-gray-700 border-0 font-semibold">SPONSORED</Badge>
                    <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full">
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-800">{selectedSponsor.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">{selectedSponsor.name}</h2>
                  <p className="text-sm sm:text-base text-white/90">{selectedSponsor.tagline}</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  onClick={() => handleVisitWebsite(selectedSponsor.website)}
                  className="bg-white hover:bg-gray-50 text-gray-800 gap-2 font-semibold shadow-md"
                >
                  <Globe className="size-4" />
                  Visit Website
                  <ExternalLink className="size-3" />
                </Button>
                <Button variant="outline" className="border-white/80 bg-white/20 text-white hover:bg-white/30 gap-2 font-medium">
                  <Phone className="size-4" />
                  {selectedSponsor.phone}
                </Button>
              </div>
              
              {/* Share Actions */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-white/80 text-xs font-medium mb-2">Share this offer:</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => handleShareEmail(selectedSponsor)}
                    size="sm"
                    variant="outline" 
                    className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                  >
                    <Mail className="size-3.5" />
                    Email
                  </Button>
                  <Button 
                    onClick={() => handleShareText(selectedSponsor)}
                    size="sm"
                    variant="outline" 
                    className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                  >
                    <MessageSquare className="size-3.5" />
                    Text
                  </Button>
                  <Button 
                    onClick={() => handleCopyLink(selectedSponsor)}
                    size="sm"
                    variant="outline" 
                    className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                  >
                    {copiedLink ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copiedLink ? "Copied!" : "Copy"}
                  </Button>
                  <Button 
                    onClick={() => handleNativeShare(selectedSponsor)}
                    size="sm"
                    variant="outline" 
                    className="border-white/60 bg-white/10 text-white hover:bg-white/20 gap-1.5 text-xs"
                  >
                    <Share2 className="size-3.5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Content - Clean white background */}
            <div className="p-4 sm:p-6 space-y-6 bg-white">
              {/* About Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className={`size-5 ${selectedSponsor.textColor}`} />
                  About {selectedSponsor.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedSponsor.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Founded</p>
                    <p className="text-sm font-bold text-gray-900">{selectedSponsor.founded}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Employees</p>
                    <p className="text-sm font-bold text-gray-900">{selectedSponsor.employees}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <MapPin className={`size-3 ${selectedSponsor.textColor} mb-1`} />
                    <p className="text-[10px] text-gray-700">{selectedSponsor.locations}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Clock className={`size-3 ${selectedSponsor.textColor} mb-1`} />
                    <p className="text-[10px] text-gray-700">{selectedSponsor.hours}</p>
                  </div>
                </div>
              </div>

              {/* Special Offers Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Gift className={`size-5 ${selectedSponsor.textColor}`} />
                  Special Offers
                </h3>
                <div className="grid gap-3">
                  {selectedSponsor.specialOffers.map((offer, idx) => (
                    <Card key={idx} className={`bg-gradient-to-r ${selectedSponsor.bgGradient} border ${selectedSponsor.borderColor}`}>
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">{offer.title}</h4>
                            {offer.code && (
                              <Badge className={`bg-white/80 ${selectedSponsor.textColor} border-0 font-mono font-bold`}>{offer.code}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{offer.description}</p>
                          {offer.expiry && (
                            <p className="text-[10px] text-gray-600 mt-1">Expires: {offer.expiry}</p>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleVisitWebsite(selectedSponsor.website)}
                          className={`bg-gradient-to-r ${selectedSponsor.gradient} hover:opacity-90 text-white flex-shrink-0 shadow-md`}
                        >
                          Claim Offer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Advertisements Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className={`size-5 ${selectedSponsor.textColor}`} />
                  Featured Advertisements
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {selectedSponsor.ads.map((ad, idx) => (
                    <Card key={idx} className="bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer" onClick={() => handleVisitWebsite(selectedSponsor.website)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-900 text-sm">{ad.title}</h4>
                          {ad.discount && (
                            <Badge className={`${selectedSponsor.badgeBg} ${selectedSponsor.textColor} border-0 text-[10px] font-bold`}>
                              {ad.discount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{ad.description}</p>
                        <div className={`text-[10px] ${selectedSponsor.textColor} font-semibold flex items-center gap-1`}>
                          Learn More <ChevronRight className="size-3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className={`size-5 ${selectedSponsor.textColor}`} />
                  Services Offered
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedSponsor.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <CheckCircle2 className={`size-4 ${selectedSponsor.textColor} flex-shrink-0`} />
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className={`size-5 ${selectedSponsor.textColor}`} />
                  Customer Reviews
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {selectedSponsor.testimonials.map((testimonial, idx) => (
                    <Card key={idx} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`size-3 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">&quot;{testimonial.text}&quot;</p>
                        <p className="text-xs text-gray-500 font-medium">- {testimonial.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CTA Footer */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedSponsor.gradient}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{selectedSponsor.offer}</p>
                    <p className="text-sm text-white/90">Exclusive offer for BUNGEE members</p>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => handleVisitWebsite(selectedSponsor.website)}
                    className="bg-white hover:bg-gray-50 text-gray-800 gap-2 px-8 font-semibold shadow-md"
                  >
                    Get Started
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
