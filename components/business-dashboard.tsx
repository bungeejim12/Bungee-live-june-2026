"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import ServiceBountyWizard from "@/components/service-bounty-wizard"
import ProductBountyWizard from "@/components/product-bounty-wizard"
import ProductsServicesWizard from "@/components/products-services-wizard"
import BountyCreationPage from "@/components/bounty-creation-page"
import BusinessVerificationModal from "@/components/business-verification-modal"
import CandidateManagementWizard from "@/components/candidate-management-wizard"
import JobOrderWizard from "@/components/job-order-wizard"
import { AskBungeeChat } from "@/components/ask-bungee-chat"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  ShoppingBag,
  Wrench,
  AlertTriangle,
  Shield,
  Medal,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  DollarSign,
  Plus,
  FileText,
  BarChart3,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Tag,
  Image,
  Gift,
  Settings,
  Phone,
  Globe,
  Save,
  Eye,
  CreditCard,
  Bitcoin,
  Banknote,
  X,
  Check,
  Bell,
  Megaphone,
  Radio,
  Volume2,
  Mail,
  ClipboardCheck,
  Video,
  Package,
  Car,
  Home,
  TreeDeciduous,
  Award,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Target,
  Brain,
  Sun,
  Moon,
  Terminal,
  CircleDot,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Inbox,
  Send,
  ChevronLeft,
  Download,
  Calendar,
  Circle,
  CheckCircle2,
  ArrowUpRight,
  LayoutGrid,
  Wallet,
  Truck,
} from "lucide-react"

interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  business_name: string | null
  user_type: string | null
  is_demo: boolean
  business_verified?: boolean
}

interface BusinessDashboardProps {
  onViewChange?: (view: "business" | "referral" | "pitch" | "corporate") => void
  currentView?: "business" | "referral" | "pitch" | "corporate"
  businessName?: string
  isDemo?: boolean
  userProfile?: UserProfile | null
}

export default function BusinessDashboard({ onViewChange, currentView = "business", businessName = "Your Business", isDemo = true, userProfile = null }: BusinessDashboardProps = {}) {
  const [veteranFirst, setVeteranFirst] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEditingBusiness, setIsEditingBusiness] = useState(false)
  const [showPaymentActivity, setShowPaymentActivity] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<"business" | "legal">("business")
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)
  const [expandedCandidates, setExpandedCandidates] = useState<Record<string, boolean>>({})
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Toggle candidate expansion
  const toggleCandidate = (candidateId: string) => {
    setExpandedCandidates(prev => ({ ...prev, [candidateId]: !prev[candidateId] }))
  }

  // Toggle step expansion
  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  // Hiring pipeline data - empty for new users, sample data only in demo mode
  const hiringCandidates = isDemo ? [
    {
      id: "john-doe",
      name: "John Doe",
      role: "Senior Frontend Engineer",
      status: "interview",
      currentStep: 2,
      score: 94,
      lastActivity: "10m ago",
      referrer: "Marcus Thompson",
      steps: [
        { id: "john-step-0", name: "New Candidate", status: "completed", date: "May 15, 2026", notes: "Applied via Bungee referral" },
        { id: "john-step-1", name: "Step 1: Resume Screen", status: "completed", date: "May 16, 2026", notes: "Strong technical background, 8 years experience" },
        { id: "john-step-2", name: "Step 2: Phone Interview", status: "current", date: "May 18, 2026", notes: "Scheduled for today at 2pm" },
        { id: "john-step-3", name: "Step 3: Technical Assessment", status: "pending", date: null, notes: null },
        { id: "john-step-4", name: "Step 4: Final Interview", status: "pending", date: null, notes: null },
      ]
    },
    {
      id: "alice-smith",
      name: "Alice Smith",
      role: "Product Lead",
      status: "video-pending",
      currentStep: 1,
      score: null,
      lastActivity: "2h ago",
      referrer: "Sarah Chen",
      steps: [
        { id: "alice-step-0", name: "New Candidate", status: "completed", date: "May 17, 2026", notes: "Veteran Pool candidate" },
        { id: "alice-step-1", name: "Step 1: Resume Screen", status: "current", date: "May 18, 2026", notes: "Awaiting video introduction" },
        { id: "alice-step-2", name: "Step 2: Phone Interview", status: "pending", date: null, notes: null },
        { id: "alice-step-3", name: "Step 3: Technical Assessment", status: "pending", date: null, notes: null },
        { id: "alice-step-4", name: "Step 4: Final Interview", status: "pending", date: null, notes: null },
      ]
    },
    {
      id: "david-martinez",
      name: "David Martinez",
      role: "Sales Representative",
      status: "interview",
      currentStep: 3,
      score: 88,
      lastActivity: "1h ago",
      referrer: "Tommy Rodriguez",
      steps: [
        { id: "david-step-0", name: "New Candidate", status: "completed", date: "May 10, 2026", notes: "Referred by top Bungee user" },
        { id: "david-step-1", name: "Step 1: Resume Screen", status: "completed", date: "May 11, 2026", notes: "10 years B2B sales experience" },
        { id: "david-step-2", name: "Step 2: Phone Interview", status: "completed", date: "May 13, 2026", notes: "Excellent communication skills" },
        { id: "david-step-3", name: "Step 3: Skills Assessment", status: "current", date: "May 18, 2026", notes: "In progress" },
        { id: "david-step-4", name: "Step 4: Final Interview", status: "pending", date: null, notes: null },
      ]
    },
    {
      id: "jennifer-wong",
      name: "Jennifer Wong",
      role: "Marketing Manager",
      status: "new",
      currentStep: 0,
      score: null,
      lastActivity: "30m ago",
      referrer: "Lisa Park",
      steps: [
        { id: "jen-step-0", name: "New Candidate", status: "current", date: "May 18, 2026", notes: "Just applied - awaiting review" },
        { id: "jen-step-1", name: "Step 1: Resume Screen", status: "pending", date: null, notes: null },
        { id: "jen-step-2", name: "Step 2: Phone Interview", status: "pending", date: null, notes: null },
        { id: "jen-step-3", name: "Step 3: Portfolio Review", status: "pending", date: null, notes: null },
        { id: "jen-step-4", name: "Step 4: Final Interview", status: "pending", date: null, notes: null },
      ]
    }
  ] : []
  // Notifications - empty for new users, sample data only in demo mode
  const [notifications] = useState(isDemo ? [
    { id: 1, type: "referral", message: "New referral from Marcus T.", time: "Just now", unread: true },
    { id: 2, type: "order", message: "New order received", time: "5 min ago", unread: true },
    { id: 3, type: "bounty", message: "Bounty payment processed", time: "1 hour ago", unread: false },
  ] : [])
  const [activeTab, setActiveTab] = useState<"hire" | "marketplace" | "services" | "products" | "productsServices" | "referrals" | "orders" | "bounties" | "invoices" | null>(null)
  const [showBungeeBlast, setShowBungeeBlast] = useState(false)
  const [showVeteranPool, setShowVeteranPool] = useState(false)
  const [showBungeePool, setShowBungeePool] = useState(false)
  const [showProRecruit, setShowProRecruit] = useState(false)
  const [showSelfHire, setShowSelfHire] = useState(false)
  const [showCandidateWizard, setShowCandidateWizard] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [showJobOrderWizard, setShowJobOrderWizard] = useState(false)
  const [showBusinessInfo, setShowBusinessInfo] = useState(false)
  const [showOpenPositions, setShowOpenPositions] = useState(false)
  const [showMarketplaceListings, setShowMarketplaceListings] = useState(false)
  const [showServicesOffered, setShowServicesOffered] = useState(false)
  const [blastRadius, setBlastRadius] = useState<number>(10)
  const [isGeneratingJob, setIsGeneratingJob] = useState(false)
  const [marketplaceCategory, setMarketplaceCategory] = useState<"all" | "vehicles" | "equipment" | "materials" | "services">("all")
  const [marketplaceView, setMarketplaceView] = useState<"inventory" | "leads">("inventory")
  const [showSaleConfirmModal, setShowSaleConfirmModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isServiceFormExpanded, setIsServiceFormExpanded] = useState(false)
  
  // Command Center expanded item states
  const [expandedCommandItem, setExpandedCommandItem] = useState<string | null>(null)
  const [candidateDetailTab, setCandidateDetailTab] = useState<string>('vetting')
  const [candidateActionLogged, setCandidateActionLogged] = useState<string | null>(null)
  const [isNetworkPerfOpen, setIsNetworkPerfOpen] = useState(false)
  
  // Candidate Next Round Toggle States
  const [nextRoundVideoActive, setNextRoundVideoActive] = useState(false)
  const [nextRoundBgCheckActive, setNextRoundBgCheckActive] = useState(false)
  const [nextRoundDrugTestActive, setNextRoundDrugTestActive] = useState(false)
  const [nextRoundPsychEvalActive, setNextRoundPsychEvalActive] = useState(false)
  const [nextRoundScreeningActive, setNextRoundScreeningActive] = useState(false)
  const [nextRoundQuestions, setNextRoundQuestions] = useState(['', ''])
  
  // Empty state for new users - no sample data
  const [marketplaceLeads, setMarketplaceLeads] = useState<any[]>(isDemo ? [
    { id: 1, customerName: "James Wilson", email: "james.wilson@email.com", phone: "(512) 555-0142", product: "2019 Ford F-150 XLT", category: "vehicles", referredBy: "Mike Thompson", bounty: "$150", date: "2 hrs ago", status: "pending", stage: "contacted", notes: "Interested in financing options", lookingFor: "Reliable work truck for construction business" },
    { id: 2, customerName: "Sarah Martinez", email: "sarah.m@gmail.com", phone: "(512) 555-0198", product: "CAT Excavator 320", category: "equipment", referredBy: "Lisa Chen", bounty: "$500", date: "5 hrs ago", status: "pending", stage: "negotiating", notes: "Needs delivery by end of month", lookingFor: "Heavy equipment for landscaping project" },
    { id: 3, customerName: "Robert Kim", email: "rkim@techcorp.com", phone: "(512) 555-0267", product: "Steel I-Beams (50 units)", category: "materials", referredBy: "Alex Johnson", bounty: "$200", date: "1 day ago", status: "pending", stage: "new", notes: "", lookingFor: "Construction materials for warehouse expansion" },
    { id: 4, customerName: "Emily Davis", email: "emily.d@email.com", phone: "(512) 555-0321", product: "2021 Chevy Silverado", category: "vehicles", referredBy: "Tom Brown", bounty: "$175", date: "3 days ago", status: "sale", stage: "closed", notes: "Paid in full", lookingFor: "Family truck with towing capacity" },
    { id: 5, customerName: "Michael Chang", email: "mchang@business.com", phone: "(512) 555-0189", product: "Concrete Mixer Truck", category: "equipment", referredBy: "Rachel Green", bounty: "$350", date: "5 days ago", status: "no_sale", stage: "lost", notes: "Found better price elsewhere", lookingFor: "Equipment rental for 3-month project" },
  ] : [])
  
  // Service leads for the services tab - empty for new users, sample data only in demo mode
  const [serviceLeads, setServiceLeads] = useState<any[]>(isDemo ? [
    { id: 1, customerName: "David Thompson", email: "david.t@email.com", phone: "(512) 555-0234", service: "HVAC Installation", referredBy: "John Smith", bounty: "$100", date: "1 hr ago", status: "pending", stage: "scheduled", notes: "Appointment set for Friday", lookingFor: "New AC unit for 2500 sq ft home" },
    { id: 2, customerName: "Jennifer Lopez", email: "jlo@gmail.com", phone: "(512) 555-0156", service: "Plumbing Repair", referredBy: "Maria Garcia", bounty: "$75", date: "4 hrs ago", status: "pending", stage: "contacted", notes: "Urgent - water leak", lookingFor: "Emergency pipe repair in basement" },
    { id: 3, customerName: "Chris Anderson", email: "c.anderson@corp.com", phone: "(512) 555-0298", service: "Electrical Wiring", referredBy: "Steve Wilson", bounty: "$125", date: "2 days ago", status: "pending", stage: "quoted", notes: "Sent estimate, waiting for approval", lookingFor: "Complete rewiring for older home" },
    { id: 4, customerName: "Amanda White", email: "awhite@email.com", phone: "(512) 555-0412", service: "Roof Inspection", referredBy: "Kevin Brown", bounty: "$50", date: "4 days ago", status: "sale", stage: "completed", notes: "Job completed successfully", lookingFor: "Annual roof inspection before winter" },
  ] : [])
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(false)
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<any>(null)
  const [servicesView, setServicesView] = useState<"services" | "leads">("services")
  const [showServiceWizard, setShowServiceWizard] = useState(false)
  const [showProductWizard, setShowProductWizard] = useState(false)
  const [showBountyCreation, setShowBountyCreation] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [isBusinessVerified, setIsBusinessVerified] = useState(isDemo ? true : (userProfile?.business_verified ?? false))
  const [serviceCategory, setServiceCategory] = useState<string>("all")
  const [showNoSaleModal, setShowNoSaleModal] = useState(false)
  const [noSaleReason, setNoSaleReason] = useState("")
  
  // Job Order Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    employmentType: "",
    skills: "",
    experience: "",
    description: "",
    workArrangement: "onsite",
    bounty: 250,
    // Screening questions
    screeningQuestions: [
      { id: 1, question: "Do you have at least 3 years of experience in this field?", expectedAnswer: "yes" },
      { id: 2, question: "Are you authorized to work in the United States?", expectedAnswer: "yes" },
      { id: 3, question: "Do you have reliable transportation?", expectedAnswer: "yes" }
    ],
    passingPercentage: 100,
    // Round 2 video question
    videoQuestion: "",
    enableScreening: true,
    enableVideoQuestion: false
  })
  
  // AI Generate Job Order
  const generateJobOrder = async () => {
    setIsGeneratingJob(true)
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Sample AI-generated job posting based on business context
    setJobForm({
      title: "Senior Operations Manager",
      department: "Operations",
      location: "Austin, TX",
      salary: "$85,000 - $110,000",
      employmentType: "Full-time",
      skills: "Project Management, Team Leadership, Process Optimization, ERP Systems, Budget Management",
      experience: "5-7 years",
      description: "We are seeking an experienced Senior Operations Manager to oversee daily operations and drive efficiency improvements across our organization. The ideal candidate will have a proven track record of leading teams, optimizing processes, and delivering measurable results.\n\nResponsibilities:\n- Lead and mentor a team of 10+ operations staff\n- Develop and implement operational strategies\n- Monitor KPIs and drive continuous improvement\n- Manage vendor relationships and contracts\n- Collaborate with cross-functional teams\n\nRequirements:\n- Bachelor's degree in Business or related field\n- 5+ years of operations management experience\n- Strong analytical and problem-solving skills\n- Excellent communication and leadership abilities",
      workArrangement: "hybrid",
      bounty: 500,
      screeningQuestions: [
        { id: 1, question: "Do you have 5+ years of operations management experience?", expectedAnswer: "yes" },
        { id: 2, question: "Have you managed teams of 10 or more people?", expectedAnswer: "yes" },
        { id: 3, question: "Are you proficient with ERP systems (SAP, Oracle, etc.)?", expectedAnswer: "yes" },
        { id: 4, question: "Do you have experience with budget management over $1M?", expectedAnswer: "yes" }
      ],
      passingPercentage: 75,
      videoQuestion: "Tell us about a time when you identified an operational inefficiency and implemented a solution. What was the impact?",
      enableScreening: true,
      enableVideoQuestion: true
    })
    setIsGeneratingJob(false)
  }
  
  // Scroll to tab content on mobile when tab is selected
  useEffect(() => {
    if (activeTab && window.innerWidth < 640) {
      const tabContent = document.getElementById('tab-content')
      if (tabContent) {
        setTimeout(() => {
          tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [activeTab])
  
  // Dark mode toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  // New user - use business name from props
  const [businessInfo, setBusinessInfo] = useState({
    name: businessName,
    address: "",
    phone: "",
    website: "",
    email: ""
  })
  // Empty state for new users
  const [referralActivity, setReferralActivity] = useState<any[]>([])

  const updateReferralStatus = (id: number, newStatus: string) => {
    setReferralActivity(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, amount: newStatus === "confirmed" ? item.amount : 0 } : item
    ))
  }

  const totalOwed = referralActivity.filter(r => r.status === "confirmed").reduce((sum, r) => sum + r.amount, 0)
  const pendingCount = referralActivity.filter(r => r.status === "pending").length

  return (
    <>
    {/* Products & Services full-screen wizard (own header + back arrow) */}
    {activeTab === "productsServices" && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <ProductsServicesWizard onClose={() => setActiveTab(null)} />
      </div>
    )}

    {/* Full Page Tab Views */}
    {activeTab && activeTab !== "productsServices" && (
      <div className={`fixed inset-0 z-50 overflow-y-auto ${
        activeTab === "hire" || activeTab === "referrals" ? "bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30" :
        activeTab === "services" || activeTab === "marketplace" ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30" :
        activeTab === "orders" ? "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" :
        activeTab === "bounties" ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30" :
        "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30"
      }`}>
        {/* Header - Clean White Minimalist */}
        <div className="sticky top-0 z-10 border-b px-4 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab(null)} 
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronRight className="size-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeTab === "hire" && (showJobOrderWizard ? "Create Job Posting" : "Post Jobs & Hire")}
                  {activeTab === "services" && "Create Referral Campaign"}
                  {activeTab === "products" && "Create Product Campaign"}
                  {activeTab === "marketplace" && "BUNGEE Marketplace"}
                  {activeTab === "referrals" && "Applicant Tracking"}
                  {activeTab === "orders" && "Orders"}
                  {activeTab === "bounties" && "Active Campaigns"}
                  {activeTab === "invoices" && "Invoices"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeTab === "hire" && (showJobOrderWizard ? "Post your job and set your referral reward" : "Post jobs and find candidates")}
                  {activeTab === "services" && "Post your service and set your referral reward"}
                  {activeTab === "products" && "Post your product and set your referral reward"}
                  {activeTab === "marketplace" && "Browse products and services"}
                  {activeTab === "referrals" && "Manage referred candidates"}
                  {activeTab === "orders" && "Track customer orders"}
                  {activeTab === "bounties" && "Your active referral campaigns"}
                  {activeTab === "invoices" && "Payment history"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="size-4 text-yellow-500" />
                ) : (
                  <Moon className="size-4 text-gray-500" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab(null)} 
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Full Page Content */}
        <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-24">
          {/* Hire Tab Full Page */}
          {activeTab === "hire" && (
            <div className="animate-in fade-in duration-300">
              {showJobOrderWizard ? (
                /* Show Job Order Wizard directly */
                <JobOrderWizard onClose={() => setShowJobOrderWizard(false)} />
              ) : (
                /* Show hiring options */
                <div className="space-y-6">
                  {/* Two Main Hiring Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option 1: Hire Through Referrals */}
                    <button 
                      onClick={() => setShowJobOrderWizard(true)}
                      className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00] hover:shadow-xl transition-all text-center group shadow-sm"
                    >
                      <div className="size-20 rounded-xl overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&crop=faces" 
                          alt="Collaborative team"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Hire Through Referrals</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Post jobs and let the network refer candidates</p>
                      <Badge className="bg-amber-50 text-gray-800 border-2 border-[#FF8C00] font-semibold shadow-sm">Free to Post</Badge>
                    </button>

                    {/* Option 2: Managed Recruiting */}
                    <button 
                      onClick={() => setShowProRecruit(true)}
                      className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00] hover:shadow-xl transition-all text-center group shadow-sm"
                    >
                      <div className="size-20 rounded-xl overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces" 
                          alt="Professional handshake"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Managed Recruiting</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Professional recruiters at half the cost</p>
                      <Badge className="bg-amber-50 text-gray-800 border-2 border-[#FF8C00] font-semibold shadow-sm">10-12% Fee</Badge>
                    </button>
                  </div>

                  {/* Priority Talent Blast - Coming Soon */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="size-10 rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=100&h=100&fit=crop" 
                          alt="Urgent hiring"
                          className="w-full h-full object-cover opacity-60"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Priority Talent Blast</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Emergency hiring blast</p>
                      </div>
                      <Badge className="bg-gray-50 text-gray-500 border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-medium">Coming Soon</Badge>
                    </div>
                  </div>

                  {/* Talent Pools Section */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white text-center">Browse Pre-Vetted Talent Pools</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Veteran Pool - Clean Card */}
                      <button 
                        onClick={() => setShowVeteranPool(true)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00] hover:shadow-xl transition-all group h-24 shadow-sm"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="size-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=150&h=150&fit=crop&crop=faces" 
                              alt="Military veteran professional"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Veteran Pool</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">5,000+ pre-vetted veterans</p>
                            <Badge className="mt-1 bg-amber-50 text-gray-800 border-2 border-[#FF8C00] text-xs font-semibold shadow-sm">Priority Hire</Badge>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400 group-hover:text-[#FF8C00] group-hover:translate-x-1 transition-all" />
                      </button>

                      {/* General Talent Pool - Clean Card */}
                      <button 
                        onClick={() => setShowBungeePool(true)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00] hover:shadow-xl transition-all group h-24 shadow-sm"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="size-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=150&h=150&fit=crop&crop=faces" 
                              alt="Diverse professional team"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">General Talent Pool</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Access Bungee&apos;s referral network</p>
                            <Badge className="mt-1 bg-amber-50 text-gray-800 border-2 border-[#FF8C00] text-xs font-semibold shadow-sm">Network Verified</Badge>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400 group-hover:text-[#FF8C00] group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Active Job Postings */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Job Postings</h3>
                      <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600">0 Active</Badge>
                    </div>
                    <div className="text-center py-8">
                      <Briefcase className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No active job postings</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your first job posting above</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Services Tab Full Page - Direct to Service Wizard */}
          {activeTab === "services" && (
            <div className="animate-in fade-in duration-300">
              <ServiceBountyWizard onClose={() => setActiveTab(null)} defaultCategory="services" />
            </div>
          )}

          {/* Products Tab Full Page - Direct to Product Wizard */}
          {activeTab === "products" && (
            <div className="animate-in fade-in duration-300">
              <ServiceBountyWizard onClose={() => setActiveTab(null)} defaultCategory="products" />
            </div>
          )}

          {/* Marketplace Tab Full Page - For BUNGEE Dashboard only */}
          {activeTab === "marketplace" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {showServiceWizard ? (
                <ServiceBountyWizard onClose={() => setShowServiceWizard(false)} defaultCategory="services" />
              ) : showProductWizard ? (
                <ServiceBountyWizard onClose={() => setShowProductWizard(false)} defaultCategory="products" />
              ) : showBountyCreation ? (
                <BountyCreationPage 
                  onClose={() => setShowBountyCreation(false)} 
                  isDarkMode={isDarkMode}
                  onSuccess={(split) => {
                    console.log('Bounty created successfully:', split)
                    setShowBountyCreation(false)
                  }}
                />
              ) : (
                <>
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setShowServiceWizard(true)}
                      className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-green-200 dark:border-emerald-900 hover:border-emerald-500 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                          <img 
                            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop" 
                            alt="Service professional"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Find a Service</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Browse local service providers</p>
                        </div>
                        <ChevronRight className="size-5 text-emerald-500 ml-auto" />
                      </div>
                    </button>

                    <button 
                      onClick={() => setShowProductWizard(true)}
                      className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-green-200 dark:border-emerald-900 hover:border-emerald-500 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                          <img 
                            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&h=150&fit=crop" 
                            alt="Product shopping"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Find a Product</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Browse products and deals</p>
                        </div>
                        <ChevronRight className="size-5 text-emerald-500 ml-auto" />
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        if (isBusinessVerified || isDemo) {
                          setShowBountyCreation(true)
                        } else {
                          setShowVerificationModal(true)
                        }
                      }}
                      className="p-6 rounded-xl bg-gradient-to-br from-[#FF8C00]/10 to-amber-500/10 dark:from-[#FF8C00]/20 dark:to-amber-500/20 border border-[#FF8C00]/30 dark:border-[#FF8C00]/50 hover:border-[#FF8C00] hover:shadow-lg hover:shadow-[#FF8C00]/10 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl bg-gradient-to-br from-[#FF8C00] to-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <DollarSign className="size-7 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Create Bounty</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isBusinessVerified || isDemo ? "Set up a referral reward" : "Verification required"}
                          </p>
                        </div>
                        <ChevronRight className="size-5 text-[#FF8C00] ml-auto" />
                      </div>
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-emerald-900 p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Marketplace Activity</h3>
                    <div className="text-center py-8">
                      <ShoppingBag className="size-12 text-emerald-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start browsing the marketplace</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Referrals/ATS Tab Full Page */}
          {activeTab === "referrals" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Pipeline Stats */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "New", count: 3, color: "fuchsia" },
                  { label: "Screening", count: 1, color: "purple" },
                  { label: "Interview", count: 1, color: "pink" },
                  { label: "Offer", count: 0, color: "violet" },
                  { label: "Hired", count: 0, color: "green" },
                ].map((stage) => (
                  <div key={stage.label} className={`p-4 rounded-xl bg-white dark:bg-gray-800 border text-center ${
                    stage.color === "fuchsia" ? "border-fuchsia-300 dark:border-fuchsia-800" :
                    stage.color === "purple" ? "border-purple-300 dark:border-purple-800" :
                    stage.color === "pink" ? "border-pink-300 dark:border-pink-800" :
                    stage.color === "violet" ? "border-violet-300 dark:border-violet-800" :
                    "border-emerald-400 dark:border-emerald-900"
                  }`}>
                    <p className={`text-2xl font-bold ${
                      stage.color === "fuchsia" ? "text-fuchsia-700 dark:text-fuchsia-500" :
                      stage.color === "purple" ? "text-purple-600 dark:text-purple-400" :
                      stage.color === "pink" ? "text-pink-600 dark:text-pink-400" :
                      stage.color === "violet" ? "text-violet-600 dark:text-violet-400" :
                      "text-emerald-700 dark:text-emerald-500"
                    }`}>{stage.count}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{stage.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Candidate List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 p-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Candidates</h3>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", initials: "JD", role: "Senior Full-Stack Engineer", referrer: "Alex Smith", status: "new", match: 94, bounty: "$2,500" },
                    { name: "Sarah Chen", initials: "SC", role: "Senior Full-Stack Engineer", referrer: "Mike Johnson", status: "screening", match: 88, bounty: "$2,500" },
                    { name: "Marcus Williams", initials: "MW", role: "Operations Manager", referrer: "Lisa Brown", status: "interview", match: 91, bounty: "$3,000" },
                    { name: "Emily Rodriguez", initials: "ER", role: "Senior Full-Stack Engineer", referrer: "David Lee", status: "new", match: 85, bounty: "$2,500" },
                    { name: "James Thompson", initials: "JT", role: "Operations Manager", referrer: "Rachel Kim", status: "new", match: 79, bounty: "$3,000" },
                  ].map((candidate, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowCandidateWizard(true);
                      }}
                      className="w-full p-4 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50/50 dark:bg-fuchsia-900/20 hover:border-fuchsia-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-gradient-to-br from-fuchsia-700 to-pink-500 flex items-center justify-center text-white font-bold">
                          {candidate.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{candidate.name}</p>
                            <Badge className={`text-xs ${
                              candidate.status === 'new' ? 'bg-fuchsia-700 text-white border-fuchsia-700' :
                              candidate.status === 'screening' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300' :
                              'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300'
                            }`}>
                              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.role}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Referred by {candidate.referrer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-fuchsia-700 dark:text-fuchsia-500">{candidate.bounty}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.match}% match</p>
                        </div>
                        <ChevronRight className="size-5 text-fuchsia-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab Full Page */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Order Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Pending", count: 0, color: "sky" },
                  { label: "Processing", count: 0, color: "blue" },
                  { label: "Shipped", count: 0, color: "indigo" },
                  { label: "Delivered", count: 0, color: "green" },
                ].map((stage) => (
                  <div key={stage.label} className={`p-4 rounded-xl bg-white dark:bg-gray-800 border text-center ${
                    stage.color === "sky" ? "border-blue-400 dark:border-blue-900" :
                    stage.color === "blue" ? "border-blue-300 dark:border-blue-800" :
                    stage.color === "indigo" ? "border-indigo-300 dark:border-indigo-800" :
                    "border-emerald-400 dark:border-emerald-900"
                  }`}>
                    <p className={`text-2xl font-bold ${
                      stage.color === "sky" ? "text-blue-700 dark:text-blue-500" :
                      stage.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                      stage.color === "indigo" ? "text-indigo-600 dark:text-indigo-400" :
                      "text-emerald-700 dark:text-emerald-500"
                    }`}>{stage.count}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{stage.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Empty State */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-300 dark:border-blue-900 p-8 text-center">
                <ShoppingBag className="size-16 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No purchases yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Customer orders will appear here</p>
                <Button className="mt-6 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white">Add Products to Sell</Button>
              </div>
            </div>
          )}

          {/* Bounties Tab Full Page */}
          {activeTab === "bounties" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-800 p-8 text-center">
                <Zap className="size-16 text-orange-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No active bounties</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your job bounties will appear here</p>
                <Button 
                  className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  onClick={() => { setActiveTab("hire"); setShowSelfHire(true); }}
                >
                  Create Your First Bounty
                </Button>
              </div>
            </div>
          )}

          {/* Invoices Tab Full Page */}
          {activeTab === "invoices" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 p-8 text-center">
                <FileText className="size-16 text-purple-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No invoices yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your payment history will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200 ${activeTab ? 'hidden' : ''}`}>
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="size-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">BUSINESS DASHBOARD</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Business Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
        {/* Company Logo Upload - Empty for new users */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Company Logo</p>
          <div className="relative group">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-700 to-gray-50 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden hover:border-[#FF8C00] transition-colors cursor-pointer">
              <div className="size-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-900 dark:text-white font-bold text-3xl mb-3">
                <Building2 className="size-10 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Business</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Add your logo</p>
            </div>
            <button className="absolute bottom-3 right-3 size-10 rounded-full bg-[#FF8C00] flex items-center justify-center hover:bg-[#E67E00] transition-colors shadow-lg">
              <Camera className="size-5 text-gray-900 dark:text-white" />
            </button>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Upload className="size-8 text-gray-900 dark:text-white mx-auto mb-2" />
                <p className="text-sm text-gray-900 dark:text-white">Upload Logo</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-gray-50 dark:bg-gray-8000/20 text-gray-600 dark:text-gray-400 border-gray-500/30 text-xs">Unverified</Badge>
          </div>
        </div>

        {/* Quick Stats - Empty for new users */}
        <div className="space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Hiring Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</span>
              <span className="font-semibold text-gray-900 dark:text-white">0</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Candidates</span>
              <span className="font-semibold text-[#FF8C00]">0</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Hired This Month</span>
              <span className="font-semibold text-emerald-500">0</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Time to Hire</span>
              <span className="font-semibold text-gray-900 dark:text-white">--</span>
            </div>
          </div>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-28">
        {/* Dashboard Content */}
        <div className="p-1.5 sm:p-4 lg:p-8 bg-gray-50 dark:bg-gray-800 dark:bg-gray-900 overflow-x-hidden">
          {/* Clean Header - Action Bar */}
          <div className="mb-3 sm:mb-6 p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header Row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Business Profile - Left */}
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  {uploadedLogo ? (
                    <img src={uploadedLogo} alt="Business Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{businessName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Business Dashboard</p>
                </div>
              </button>

              {/* Action Buttons - Center */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                {/* Inbox Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all">
                      <Inbox className="size-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">Inbox</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">8</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 sm:w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                    <DropdownMenuLabel className="flex items-center justify-between text-gray-900 dark:text-white">
                      <span className="flex items-center gap-2">
                        <Inbox className="size-4 text-[#FF8C00]" />
                        Inbox
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-blue-500 text-white border-0 text-[10px]">3 in</Badge>
                        <Badge className="bg-emerald-500 text-white border-0 text-[10px]">5 sent</Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    
                    {/* Inbox Section */}
                    <div className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">Inbox</p>
                    </div>
                    <DropdownMenuGroup className="max-h-40 overflow-y-auto">
                      {/* New Service Lead */}
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <Briefcase className="size-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">New Service Lead</p>
                          <p className="text-[10px] truncate text-gray-600 dark:text-gray-400">Michael Scott requested plumbing quote.</p>
                          <p className="text-[9px] text-[#FF8C00] mt-0.5">10m ago</p>
                        </div>
                        <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                      </DropdownMenuItem>
                      {/* Job Application */}
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        <div className="size-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center shrink-0">
                          <UserCheck className="size-4 text-fuchsia-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">New Job Applicant</p>
                          <p className="text-[10px] truncate text-gray-600 dark:text-gray-400">Jim Halpert applied for Sales Manager.</p>
                          <p className="text-[9px] text-[#FF8C00] mt-0.5">1h ago</p>
                        </div>
                        <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                      </DropdownMenuItem>
                      {/* Product Inquiry */}
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                          <ShoppingBag className="size-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">Product Inquiry</p>
                          <p className="text-[10px] truncate text-gray-600 dark:text-gray-400">Dwight Schrute wants to buy 50 units.</p>
                          <p className="text-[9px] text-[#FF8C00] mt-0.5">3h ago</p>
                        </div>
                        <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    {/* Sent Section */}
                    <div className="px-2 py-1 mt-1 bg-emerald-50 dark:bg-emerald-500/10">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Sent</p>
                    </div>
                    <DropdownMenuGroup className="max-h-40 overflow-y-auto">
                      {/* Sent Quote */}
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <FileText className="size-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">Quote Sent</p>
                          <p className="text-[10px] truncate text-gray-600 dark:text-gray-400">Sent service quote to Stanley Hudson.</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">Yesterday</p>
                        </div>
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-1" />
                      </DropdownMenuItem>
                      {/* Interview Invite */}
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        <div className="size-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center shrink-0">
                          <Calendar className="size-4 text-fuchsia-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">Interview Scheduled</p>
                          <p className="text-[10px] truncate text-gray-600 dark:text-gray-400">Interview invite sent to Andy Bernard.</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">2 days ago</p>
                        </div>
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-1" />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem className="flex items-center justify-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                      <span className="text-xs font-semibold text-[#FF8C00]">View All Messages</span>
                      <ArrowUpRight className="size-3 text-[#FF8C00]" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Right: Settings & Dark Mode */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                >
                  <Settings className="size-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">Settings</span>
                </button>
                
                {/* Dark Mode Toggle */}
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="size-4 text-yellow-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="size-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

            {/* Referrals Tab - ATS View */}
            {activeTab === "referrals" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Applicant Tracking</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage referred candidates</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Pipeline Stats */}
              <div className="grid grid-cols-5 gap-2">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">3</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">New</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">1</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Screening</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">1</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Interview</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Offer</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Hired</p>
                </div>
              </div>
              
              {/* Candidate List */}
              <div className="space-y-2">
                {[
                  { name: "John Doe", initials: "JD", role: "Senior Full-Stack Engineer", referrer: "Alex Smith", status: "new", match: 94, bounty: "$2,500" },
                  { name: "Sarah Chen", initials: "SC", role: "Senior Full-Stack Engineer", referrer: "Mike Johnson", status: "screening", match: 88, bounty: "$2,500" },
                  { name: "Marcus Williams", initials: "MW", role: "Operations Manager", referrer: "Lisa Brown", status: "interview", match: 91, bounty: "$3,000" },
                  { name: "Emily Rodriguez", initials: "ER", role: "Senior Full-Stack Engineer", referrer: "David Lee", status: "new", match: 85, bounty: "$2,500" },
                  { name: "James Thompson", initials: "JT", role: "Operations Manager", referrer: "Rachel Kim", status: "new", match: 79, bounty: "$3,000" },
                ].map((candidate, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowCandidateWizard(true);
                    }}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm">
                        {candidate.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{candidate.name}</p>
                          <Badge className={`text-[10px] ${
                            candidate.status === 'new' ? 'bg-gray-900 text-white border-gray-900' :
                            candidate.status === 'screening' ? 'bg-gray-200 text-gray-700 dark:text-gray-300 border-gray-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300'
                          }`}>
                            {candidate.status === 'new' ? 'New' : candidate.status === 'screening' ? 'Screening' : 'Interview'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{candidate.role}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Referred by {candidate.referrer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{candidate.bounty}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{candidate.match}% match</p>
                      </div>
                      <ChevronRight className="size-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => setActiveTab("hire")}
              >
                <Plus className="size-4 mr-2" />
                Post Another Job to Attract More Referrals
              </Button>
            </div>
            )}

            {/* Orders/Purchases Tab */}
            {activeTab === "orders" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Product Purchases</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track customer orders</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Order Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Pending</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Processing</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Shipped</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[8px] text-gray-600 dark:text-gray-400">Delivered</p>
                </div>
              </div>
              
              {/* Empty State */}
              <Card className="border border-gray-200 dark:border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 dark:bg-gray-800">
                <CardContent className="py-8 text-center">
                  <ShoppingBag className="size-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">No purchases yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customer orders will appear here</p>
                  <Button className="mt-4 bg-gray-900 hover:bg-gray-800 text-white">Add Products to Sell</Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Paid Bounties Tab */}
            {activeTab === "bounties" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Paid Bounties</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bounties paid to Bungees</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Bounty Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-center">
                  <p className="text-xl font-bold text-[#FF8C00]">$0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Paid</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-700/10 border border-emerald-700/30 text-center">
                  <p className="text-xl font-bold text-emerald-500">0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Successful Hires</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center">
                  <p className="text-xl font-bold text-orange-400">$0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Bounty</p>
                </div>
              </div>
              
              {/* Empty State */}
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <CardContent className="py-8 text-center">
                  <Zap className="size-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">No bounties paid yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">When you hire referred candidates, bounty payments appear here</p>
                  <Button className="mt-4 bg-[#FF8C00] hover:bg-[#E67E00]">Set Up Bounties</Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Invoices</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Amounts owed to Bungee Corp</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              
              {/* Invoice Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                  <p className="text-xl font-bold text-red-400">${totalOwed}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Outstanding</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
                  <p className="text-xl font-bold text-yellow-400">$0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Due Soon</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-700/10 border border-emerald-700/30 text-center">
                  <p className="text-xl font-bold text-emerald-500">$0</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Paid</p>
                </div>
              </div>
              
              {/* Empty State */}
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <CardContent className="py-8 text-center">
                  <CreditCard className="size-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">No invoices yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform fees and charges will appear here</p>
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">View Billing History</Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Corporate Hub Activity Center - PROMINENT NAVIGATIONAL DASHBOARD */}
            <div className={`mb-3 sm:mb-6 rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 ${
              isCommandCenterOpen 
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
            }`}>
              {/* Activity Center Toggle Header - Clean Light Style */}
              <div 
                onClick={() => setIsCommandCenterOpen(!isCommandCenterOpen)}
                className="p-3 sm:p-5 flex items-center justify-between cursor-pointer select-none relative overflow-hidden"
              >
                <div className="relative flex items-center gap-3 sm:gap-4">
                  <div className="size-10 sm:size-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <LayoutGrid className="size-5 sm:size-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
                      <span className="sm:hidden">Activity Center</span>
                      <span className="hidden sm:inline">Activity Center</span>
                      {!isCommandCenterOpen && (
                        <Badge className="bg-[#FF8C00] text-white border-0 text-[9px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 font-semibold">
                          14 Active
                        </Badge>
                      )}
                    </h3>
                    <p className="text-[9px] sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="sm:hidden">Tap to view active workflows</span>
                      <span className="hidden sm:inline">Monitor and coordinate active workflows across your Bungee ecosystem</span>
                    </p>
                  </div>
                </div>
                <button className={`p-2 sm:p-3 rounded-xl transition-all ${isCommandCenterOpen ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {isCommandCenterOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>

              {/* Expanded Pipeline Matrix Grid - Clean Light Panels */}
              {isCommandCenterOpen && !expandedCommandItem && (
                <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Column 1: Job Orders / Candidates */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col h-[220px] sm:h-[300px]">
                    <div className="p-2.5 sm:p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <div className="size-5 sm:size-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FF8C00]" />
                        </div>
                        Job Orders / Candidates
                      </span>
                      <Badge className="text-[8px] sm:text-[10px] bg-orange-50 dark:bg-orange-900/20 text-[#FF8C00] border-orange-200 dark:border-orange-800 font-medium">4 Active</Badge>
                    </div>
                    <div className="p-2 sm:p-2.5 flex-1 overflow-y-auto space-y-2 sm:space-y-2.5">
                      {hiringCandidates.map(cand => (
                        <button 
                          key={cand.id} 
                          onClick={() => setExpandedCommandItem(`candidate-${cand.id}`)}
                          className="w-full text-left p-2.5 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[10px] sm:text-sm text-gray-900 dark:text-white">{cand.name}</span>
                            <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium">{cand.lastActivity}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-[9px] sm:text-xs truncate">{cand.role}</p>
                          <div className="flex items-center justify-between pt-1.5">
                            <Badge className="text-[8px] sm:text-[10px] font-medium bg-orange-50 dark:bg-orange-900/20 text-[#FF8C00] border-orange-200 dark:border-orange-800 px-2 py-0.5">
                              {cand.score ? `Round ${cand.currentStep}: ${cand.score}%` : 'Video Pending'}
                            </Badge>
                            <span className="text-[9px] sm:text-[11px] text-gray-400 hover:text-[#FF8C00] font-semibold flex items-center gap-0.5">
                              Open <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Lead Generation / Services */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col h-[220px] sm:h-[300px]">
                    <div className="p-2.5 sm:p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <div className="size-5 sm:size-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                          <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
                        </div>
                        Lead Generation / Services
                      </span>
                      <Badge className="text-[8px] sm:text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800 font-medium">5 Open</Badge>
                    </div>
                    <div className="p-2 sm:p-2.5 flex-1 overflow-y-auto space-y-2 sm:space-y-2.5">
                      {[
                        { id: 's1', name: 'Robert Vance', company: 'Vance Refrigeration', stage: 'New Referral', bounty: '$150', phone: '(555) 123-4567', email: 'rvance@vancerefrig.com', service: 'HVAC Installation', referredBy: 'Phyllis Lapin' },
                        { id: 's2', name: 'Michael Scott', company: 'Dunder Mifflin', stage: 'Contacted', bounty: '$150', phone: '(555) 987-6543', email: 'mscott@dundermifflin.com', service: 'Paper Supply Contract', referredBy: 'Jan Levinson' },
                        { id: 's3', name: 'Angela Martin', company: 'Martin Pet Supplies', stage: 'Quoted', bounty: '$200', phone: '(555) 222-3333', email: 'amartin@martinpets.com', service: 'Bulk Pet Food Order', referredBy: 'Dwight Schrute' },
                        { id: 's4', name: 'Stanley Hudson', company: 'Hudson Crosswords LLC', stage: 'New Referral', bounty: '$75', phone: '(555) 444-5555', email: 'shudson@crosswords.com', service: 'Print Services', referredBy: 'Kevin Malone' },
                        { id: 's5', name: 'Andy Bernard', company: 'Bernard Boat Rentals', stage: 'Contacted', bounty: '$300', phone: '(555) 666-7777', email: 'abernard@boatrentals.com', service: 'Fleet Maintenance', referredBy: 'Erin Hannon' }
                      ].map(lead => (
                        <button 
                          key={lead.id}
                          onClick={() => setExpandedCommandItem(`lead-${lead.id}`)}
                          className="w-full text-left p-2.5 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[10px] sm:text-sm text-gray-900 dark:text-white">{lead.name}</span>
                            <span className="font-mono font-semibold text-[9px] sm:text-[11px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-1.5 rounded border border-emerald-200 dark:border-emerald-800">{lead.bounty}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-[9px] sm:text-xs truncate">{lead.company}</p>
                          <div className="flex items-center justify-between pt-1.5">
                            <Badge className={`text-[8px] sm:text-[10px] font-medium border px-2 py-0.5 ${
                              lead.stage === 'New Referral' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800'
                            }`}>{lead.stage}</Badge>
                            <span className="text-[9px] sm:text-[11px] text-gray-400 hover:text-emerald-600 font-semibold flex items-center gap-0.5">
                              Open <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Product Sales Trackers */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col h-[220px] sm:h-[300px]">
                    <div className="p-2.5 sm:p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <div className="size-5 sm:size-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                        </div>
                        Product Sales Trackers
                      </span>
                      <Badge className="text-[8px] sm:text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800 font-medium">5 Logs</Badge>
                    </div>
                    <div className="p-1.5 sm:p-2 flex-1 overflow-y-auto space-y-1.5 sm:space-y-2">
                      {[
                        { id: 'p1', name: 'Pam Beesly', item: 'Ergonomic Desk Chair', stage: 'Sale Confirmed', trackingCode: 'BUNG-DESK-09', email: 'pbeesly@email.com', phone: '(555) 234-5678', referredBy: 'Jim Halpert', amount: '$299.99' },
                        { id: 'p2', name: 'Kevin Malone', item: 'Hydration Powder Bulk', stage: 'Cart Abandoned', trackingCode: 'BUNG-HYDR-44', email: 'kmalone@email.com', phone: '(555) 345-6789', referredBy: 'Oscar Martinez', amount: '$89.99' },
                        { id: 'p3', name: 'Creed Bratton', item: 'Vintage Office Supplies', stage: 'Sale Confirmed', trackingCode: 'BUNG-VINT-22', email: 'cbratton@email.com', phone: '(555) 111-2222', referredBy: 'Meredith Palmer', amount: '$45.00' },
                        { id: 'p4', name: 'Ryan Howard', item: 'WUPHF Premium Plan', stage: 'Pending Payment', trackingCode: 'BUNG-WUPH-77', email: 'rhoward@wuphf.com', phone: '(555) 888-9999', referredBy: 'Kelly Kapoor', amount: '$199.99' },
                        { id: 'p5', name: 'Toby Flenderson', item: 'Legal Document Templates', stage: 'Sale Confirmed', trackingCode: 'BUNG-LEGL-33', email: 'tflenderson@email.com', phone: '(555) 333-4444', referredBy: 'Holly Flax', amount: '$149.00' }
                      ].map(sale => (
                        <button 
                          key={sale.id}
                          onClick={() => setExpandedCommandItem(`sale-${sale.id}`)}
                          className="w-full text-left p-2 sm:p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[9px] sm:text-xs text-gray-900 dark:text-white">{sale.name}</span>
                            <span className="text-[7px] sm:text-[9px] font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-1 rounded border border-gray-200 dark:border-gray-600">{sale.trackingCode}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-[8px] sm:text-[11px] truncate">Item: {sale.item}</p>
                          <div className="flex items-center justify-between pt-1">
                            <Badge className={`text-[7px] sm:text-[9px] font-medium border px-1.5 py-0 ${
                              sale.stage === 'Sale Confirmed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800'
                            }`}>{sale.stage}</Badge>
                            <span className="text-[8px] sm:text-[10px] text-gray-400 hover:text-blue-600 font-semibold flex items-center gap-0.5">
                              Open <ArrowRight className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Expanded Individual Item Dashboard */}
              {isCommandCenterOpen && expandedCommandItem && (
                <div className="p-3 sm:p-5 bg-gray-50/50 dark:bg-gray-900/30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Back Button */}
                  <button 
                    onClick={() => setExpandedCommandItem(null)}
                    className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back to Activity Center
                  </button>

                  {/* Candidate Detail Dashboard */}
                  {expandedCommandItem.startsWith('candidate-') && (() => {
                    const candId = expandedCommandItem.replace('candidate-', '')
                    const cand = hiringCandidates.find(c => c.id === candId)
                    if (!cand) return null
                    
                    // Vetting Questions Dataset
                    const verificationQuestions = [
                      { id: 1, text: 'Do you possess an active, unexpired state Cosmetology License?', candidateAns: 'Yes', correctAns: 'Yes', match: true },
                      { id: 2, text: 'Are you available to work mandatory weekend morning shifts?', candidateAns: 'Yes', correctAns: 'Yes', match: true },
                      { id: 3, text: 'Do you have 2+ years of high-volume salon shift management experience?', candidateAns: 'No', correctAns: 'Yes', match: false }
                    ]
                    
                    return (
                      <div className="space-y-3 sm:space-y-4">
                        {/* CANDIDATE HEADER MANAGEMENT BLOCK */}
                        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-gray-800 border border-[#FF8C00]/20 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3">
                              <div className="size-12 sm:size-14 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center text-sm sm:text-base font-black ring-2 ring-[#FF8C00]/20 shrink-0">
                                {cand.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm sm:text-lg font-black tracking-tight text-gray-900 dark:text-white">{cand.name}</h3>
                                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">
                                    {cand.score ? `Passed Round 1 Gate` : 'Pending Review'}
                                  </Badge>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  Position Order: <span className="font-bold text-gray-900 dark:text-white">{cand.role}</span>
                                </p>
                              </div>
                            </div>

                            {/* PIPELINE DISBURSEMENT CONVERSION CONTROLS */}
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => setCandidateActionLogged('hired')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3 shadow-sm"
                              >
                                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Approve Hire
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setCandidateActionLogged('passed')}
                                className="text-red-500 hover:bg-red-500/5 border-red-500/20 font-bold text-[10px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3"
                              >
                                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" /> Pass
                              </Button>
                            </div>
                          </div>

                          {/* ECOSYSTEM CONNECTIVITY TRACKING META */}
                          <div className="flex flex-wrap gap-y-1.5 justify-between text-[9px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2.5 mt-1">
                            <span className="flex items-center gap-1"><Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FF8C00]" /> Referred by: <strong className="text-gray-900 dark:text-white">Alex Smith (Bungee User)</strong></span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Applied: May 28, 2026</span>
                          </div>
                        </div>

                        {/* NEXT ROUND CONFIGURATION - DESKTOP ONLY */}
                        <div className="hidden sm:block p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="h-4 w-4 text-[#FF8C00]" />
                                Configure Next Round Options
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Select screening and verification options for this candidate</p>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                              <span className="bg-white dark:bg-gray-800 px-2 text-gray-400 font-medium">Screening</span>
                            </div>
                          </div>

                          {/* TOGGLE: 60-Second Video */}
                          <div className={`rounded-lg border transition-all ${nextRoundVideoActive ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-700/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md transition-colors ${nextRoundVideoActive ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                  <Video className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <Label className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer">60-Second Video Response</Label>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Request video pitch from candidate</p>
                                </div>
                              </div>
                              <Switch checked={nextRoundVideoActive} onCheckedChange={setNextRoundVideoActive} className="data-[state=checked]:bg-gray-900" />
                            </div>
                            {nextRoundVideoActive && (
                              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
                                  <p className="font-medium text-gray-900 dark:text-white mb-1">Requirements:</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    <li>Maximum 60 seconds</li>
                                    <li>Auto-saved to profile</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* TOGGLE: Screening Questions */}
                          <div className={`rounded-lg border transition-all ${nextRoundScreeningActive ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-700/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md transition-colors ${nextRoundScreeningActive ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <Label className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer">Screening Questions</Label>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Custom questions for candidate</p>
                                </div>
                              </div>
                              <Switch checked={nextRoundScreeningActive} onCheckedChange={setNextRoundScreeningActive} className="data-[state=checked]:bg-gray-900" />
                            </div>
                            {nextRoundScreeningActive && (
                              <div className="px-3 pb-3 pt-0 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                {nextRoundQuestions.map((q, idx) => (
                                  <div key={idx}>
                                    <Label className="text-[10px] text-gray-500 dark:text-gray-400">Question {idx + 1}</Label>
                                    <Input 
                                      placeholder={`Enter question ${idx + 1}...`}
                                      value={q}
                                      onChange={(e) => {
                                        const updated = [...nextRoundQuestions];
                                        updated[idx] = e.target.value;
                                        setNextRoundQuestions(updated);
                                      }}
                                      className="h-8 text-xs mt-1"
                                    />
                                  </div>
                                ))}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-[10px] h-7 w-full"
                                  onClick={() => setNextRoundQuestions([...nextRoundQuestions, ''])}
                                >
                                  + Add Question
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                              <span className="bg-white dark:bg-gray-800 px-2 text-gray-400 font-medium">Verifications</span>
                            </div>
                          </div>

                          {/* TOGGLE: Background Check */}
                          <div className={`rounded-lg border transition-all ${nextRoundBgCheckActive ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-700/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md transition-colors ${nextRoundBgCheckActive ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <Label className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer">Background Check</Label>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Criminal background screening</p>
                                </div>
                              </div>
                              <Switch checked={nextRoundBgCheckActive} onCheckedChange={setNextRoundBgCheckActive} className="data-[state=checked]:bg-gray-900" />
                            </div>
                            {nextRoundBgCheckActive && (
                              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
                                  <ul className="list-disc list-inside space-y-0.5">
                                    <li>National database search</li>
                                    <li>County records validation</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* TOGGLE: Drug Screen */}
                          <div className={`rounded-lg border transition-all ${nextRoundDrugTestActive ? 'border-gray-900 dark:border-gray-500 bg-gray-50 dark:bg-gray-700/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md transition-colors ${nextRoundDrugTestActive ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                  <AlertCircle className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <Label className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer">Drug Screen</Label>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">10-panel drug testing</p>
                                </div>
                              </div>
                              <Switch checked={nextRoundDrugTestActive} onCheckedChange={setNextRoundDrugTestActive} className="data-[state=checked]:bg-gray-900" />
                            </div>
                            {nextRoundDrugTestActive && (
                              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
                                  <ul className="list-disc list-inside space-y-0.5">
                                    <li>Automated voucher issued</li>
                                    <li>Results in 24-48 hours</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* TOGGLE: PI Survey - Premium */}
                          <div className={`relative rounded-lg border-2 transition-all ${nextRoundPsychEvalActive ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-200'}`}>
                            <div className="absolute -top-2 left-3">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                                <Brain className="size-2.5" />
                                PREMIUM
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 pt-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md transition-colors ${nextRoundPsychEvalActive ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                                  <Brain className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <Label className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer">PI Survey Assessment</Label>
                                    <span className="text-[8px] font-semibold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 px-1 py-0.5 rounded">+$49</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Powered by <span className="text-indigo-600 font-medium">pisurvey potentially</span></p>
                                </div>
                              </div>
                              <Switch checked={nextRoundPsychEvalActive} onCheckedChange={setNextRoundPsychEvalActive} className="data-[state=checked]:bg-indigo-600" />
                            </div>
                            {nextRoundPsychEvalActive && (
                              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                                <div className="p-2 bg-white dark:bg-gray-900/50 rounded border border-indigo-200 dark:border-indigo-800 text-[10px]">
                                  <div className="grid grid-cols-3 gap-1.5">
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                      <CheckCircle2 className="size-3 text-indigo-500" />
                                      <span>Cognitive</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                      <CheckCircle2 className="size-3 text-indigo-500" />
                                      <span>Behavioral</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                      <CheckCircle2 className="size-3 text-indigo-500" />
                                      <span>Job-Fit</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Active Summary */}
                          {(nextRoundVideoActive || nextRoundScreeningActive || nextRoundBgCheckActive || nextRoundDrugTestActive || nextRoundPsychEvalActive) && (
                            <div className="p-2 text-center text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50 animate-in fade-in duration-200">
                              Active: {[nextRoundVideoActive && 'Video', nextRoundScreeningActive && 'Questions', nextRoundBgCheckActive && 'Background', nextRoundDrugTestActive && 'Drug Test', nextRoundPsychEvalActive && 'PI Survey'].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>

                        {/* WORKSPACE SEPARATOR TABS SYSTEM */}
                        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <Tabs value={candidateDetailTab} onValueChange={setCandidateDetailTab} className="w-full space-y-3 sm:space-y-4">
                            <TabsList className="grid w-full grid-cols-3 h-9 sm:h-10 border bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl">
                              <TabsTrigger value="vetting" className="text-[8px] sm:text-xs font-bold data-[state=active]:bg-[#FF8C00] data-[state=active]:text-white transition-all rounded-lg">
                                <ClipboardCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 shrink-0" /> <span className="hidden xs:inline">1.</span> Vetting
                              </TabsTrigger>
                              <TabsTrigger value="video" className="text-[8px] sm:text-xs font-bold data-[state=active]:bg-[#FF8C00] data-[state=active]:text-white transition-all rounded-lg">
                                <Video className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 shrink-0" /> <span className="hidden xs:inline">2.</span> Video
                              </TabsTrigger>
                              <TabsTrigger value="resume" className="text-[8px] sm:text-xs font-bold data-[state=active]:bg-[#FF8C00] data-[state=active]:text-white transition-all rounded-lg">
                                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 shrink-0" /> <span className="hidden xs:inline">3.</span> Resume
                              </TabsTrigger>
                            </TabsList>

                            {/* TAB 1: ROUND 1 VETTING RESULTS */}
                            <TabsContent value="vetting" className="space-y-3 sm:space-y-4 outline-none mt-0">
                              <div className="p-3 sm:p-4 rounded-xl border border-[#FF8C00]/20 bg-[#FF8C00]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#FF8C00] flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Matrix Performance Index
                                  </span>
                                  <p className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400">Automatic score generated during verification screening.</p>
                                </div>
                                <Badge className="bg-[#FF8C00] text-white font-mono font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 border-none shrink-0 w-fit">
                                  Passed: {cand.score || 66}% Accurate
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                {verificationQuestions.map((q, idx) => (
                                  <div key={q.id} className="p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs space-y-2 shadow-sm">
                                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                                      <p className="font-bold text-gray-900 dark:text-white leading-snug text-[10px] sm:text-xs"><span className="text-[#FF8C00] mr-1">Q{idx + 1}.</span> {q.text}</p>
                                      <Badge className={`text-[7px] sm:text-[9px] font-black uppercase border-none tracking-wider px-1 sm:px-1.5 py-0 shrink-0 ${
                                        q.match ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                                      }`}>
                                        {q.match ? 'Match' : 'Mismatch'}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 font-mono text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                                      <span>Candidate: <strong className={q.match ? 'text-emerald-600' : 'text-red-500'}>"{q.candidateAns}"</strong></span>
                                      <span>Required: <strong className="text-gray-900 dark:text-white">"{q.correctAns}"</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            {/* TAB 2: VIDEO PITCH */}
                            <TabsContent value="video" className="space-y-3 sm:space-y-4 outline-none mt-0">
                              <div className="space-y-1.5">
                                <span className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Round 2 Evaluation Prompt</span>
                                <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white leading-normal bg-gray-100 dark:bg-gray-700/30 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner">
                                  "Walk us through a complex state-management issue you solved in a production React environment."
                                </p>
                              </div>

                              <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group border border-slate-800 shadow-xl cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-0" />
                                <Video className="h-10 w-10 sm:h-12 sm:w-12 text-white/30 mb-2 z-10 group-hover:scale-110 group-hover:text-[#FF8C00] transition-all" />
                                <p className="text-[10px] sm:text-xs text-white/90 font-medium z-10 max-w-xs">
                                  Click to play candidate video response
                                </p>
                                <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-[8px] sm:text-[10px] text-white/60 font-mono z-10 bg-black/50 px-1.5 sm:px-2 py-0.5 rounded border border-white/10">
                                  SIZE: 12.4 MB • LENGTH: 0:58s
                                </span>
                              </div>
                            </TabsContent>

                            {/* TAB 3: RESUME BRIEF */}
                            <TabsContent value="resume" className="space-y-3 sm:space-y-4 outline-none mt-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 dark:bg-gray-700/30 p-2.5 sm:p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 gap-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
                                  <span className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white font-mono">{cand.name.toLowerCase().replace(' ', '_')}_resume_2026.pdf</span>
                                </div>
                                <div className="flex gap-1.5">
                                  <Button size="sm" variant="outline" className="h-6 sm:h-7 text-[8px] sm:text-[10px] font-bold gap-1"><Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> View</Button>
                                  <Button size="sm" variant="outline" className="h-6 sm:h-7 text-[8px] sm:text-[10px] font-bold gap-1"><Download className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Download</Button>
                                </div>
                              </div>

                              {/* RESUME DOCUMENT VIEWPORT */}
                              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-inner space-y-3 sm:space-y-4 text-xs max-h-56 sm:max-h-64 overflow-y-auto leading-relaxed text-gray-500 dark:text-gray-400">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 space-y-0.5 text-center sm:text-left">
                                  <h4 className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base tracking-tight">{cand.name.toUpperCase()}</h4>
                                  <p className="text-[9px] sm:text-[10px] font-mono">Atlanta, GA • {cand.name.toLowerCase().replace(' ', '.')}@bungeenetwork.io • (404) 555-0143</p>
                                </div>
                                <div className="space-y-1">
                                  <h5 className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FF8C00]">Professional Experience</h5>
                                  <p className="font-semibold text-gray-900 dark:text-white text-[10px] sm:text-xs">{cand.role} ��� TechFlow Systems (2024 - Present)</p>
                                  <ul className="list-disc list-inside space-y-1 pl-1 text-[9px] sm:text-[11px]">
                                    <li>Engineered modular multi-tier dashboard micro-widgets scaling code performance benchmarks by 32%.</li>
                                    <li>Integrated real-time streaming JSON configuration matrices natively into structural application frameworks.</li>
                                  </ul>
                                </div>
                                <div className="space-y-1 pt-1">
                                  <h5 className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FF8C00]">Technical Stack</h5>
                                  <p className="text-[9px] sm:text-[11px] font-mono text-gray-900 dark:text-white">React, Next.js, TypeScript, Node.js, Redux Toolkit, Tailwind CSS, REST APIs</p>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* DYNAMIC PIPELINE ACTION BANNER */}
                        {candidateActionLogged && (
                          <div className={`p-2.5 sm:p-3 rounded-xl border font-medium text-[10px] sm:text-xs text-center animate-in fade-in zoom-in-95 duration-200 ${
                            candidateActionLogged === 'hired' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                          }`}>
                            {candidateActionLogged === 'hired' 
                              ? 'Authorization Complete: Position closed. Processing immediate $2,000.00 Bounty disbursement to Alex Smith.' 
                              : 'Candidate profile archived. Log parameters hidden from active candidate tracking arrays.'}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Lead Detail Dashboard */}
                  {expandedCommandItem.startsWith('lead-') && (() => {
                    const leadId = expandedCommandItem.replace('lead-', '')
                    const leadData = [
                      { id: 's1', name: 'Robert Vance', company: 'Vance Refrigeration', stage: 'New Referral', bounty: '$150', phone: '(555) 123-4567', email: 'rvance@vancerefrig.com', service: 'HVAC Installation', referredBy: 'Phyllis Lapin' },
                      { id: 's2', name: 'Michael Scott', company: 'Dunder Mifflin', stage: 'Contacted', bounty: '$150', phone: '(555) 987-6543', email: 'mscott@dundermifflin.com', service: 'Paper Supply Contract', referredBy: 'Jan Levinson' },
                      { id: 's3', name: 'Angela Martin', company: 'Martin Pet Supplies', stage: 'Quoted', bounty: '$200', phone: '(555) 222-3333', email: 'amartin@martinpets.com', service: 'Bulk Pet Food Order', referredBy: 'Dwight Schrute' },
                      { id: 's4', name: 'Stanley Hudson', company: 'Hudson Crosswords LLC', stage: 'New Referral', bounty: '$75', phone: '(555) 444-5555', email: 'shudson@crosswords.com', service: 'Print Services', referredBy: 'Kevin Malone' },
                      { id: 's5', name: 'Andy Bernard', company: 'Bernard Boat Rentals', stage: 'Contacted', bounty: '$300', phone: '(555) 666-7777', email: 'abernard@boatrentals.com', service: 'Fleet Maintenance', referredBy: 'Erin Hannon' }
                    ].find(l => l.id === leadId)
                    if (!leadData) return null
                    return (
                      <div className="space-y-3 sm:space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <div className="size-12 sm:size-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-lg sm:text-xl">
                              {leadData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{leadData.name}</h3>
                              <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">{leadData.company}</p>
                              <Badge className={`mt-1 text-[8px] sm:text-[10px] border-0 ${
                                leadData.stage === 'New Referral' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                              }`}>{leadData.stage}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] sm:text-xs text-gray-400">Potential Bounty</p>
                            <p className="text-lg sm:text-xl font-bold text-emerald-600">{leadData.bounty}</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Phone</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white">{leadData.phone}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Email</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white truncate">{leadData.email}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Service Interest</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white">{leadData.service}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Referred By</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white">{leadData.referredBy}</p>
                          </div>
                        </div>

                        {/* Activity Log */}
                        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> Activity Log
                          </h4>
                          <div className="space-y-2">
                            {[
                              { action: 'Lead referred by ' + leadData.referredBy, time: '3 days ago', icon: Users },
                              { action: 'Lead assigned to you', time: '3 days ago', icon: UserCheck },
                              ...(leadData.stage === 'Contacted' ? [
                                { action: 'Initial contact made', time: '2 days ago', icon: Phone },
                                { action: 'Follow-up email sent', time: '1 day ago', icon: Mail },
                              ] : []),
                            ].map((activity, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[9px] sm:text-[11px]">
                                <activity.icon className="h-3 w-3 text-gray-400" />
                                <span className="flex-1 text-gray-600 dark:text-gray-400">{activity.action}</span>
                                <span className="text-gray-400">{activity.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Update Stage */}
                        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Update Lead Stage</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant={leadData.stage === 'New Referral' ? 'default' : 'outline'} className="h-7 text-[9px] sm:text-[10px]">New</Button>
                            <Button size="sm" variant={leadData.stage === 'Contacted' ? 'default' : 'outline'} className="h-7 text-[9px] sm:text-[10px]">Contacted</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[9px] sm:text-[10px]">Quoted</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[9px] sm:text-[10px] bg-emerald-500 text-white hover:bg-emerald-600">Won</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[9px] sm:text-[10px] text-red-500">Lost</Button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="h-8 text-[10px] sm:text-xs bg-emerald-500 hover:bg-emerald-600">
                            <Phone className="h-3 w-3 mr-1" /> Call Now
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                            <Mail className="h-3 w-3 mr-1" /> Send Email
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                            <FileText className="h-3 w-3 mr-1" /> Add Note
                          </Button>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Sale Detail Dashboard */}
                  {expandedCommandItem.startsWith('sale-') && (() => {
                    const saleId = expandedCommandItem.replace('sale-', '')
                    const saleData = [
                      { id: 'p1', name: 'Pam Beesly', item: 'Ergonomic Desk Chair', stage: 'Sale Confirmed', trackingCode: 'BUNG-DESK-09', email: 'pbeesly@email.com', phone: '(555) 234-5678', referredBy: 'Jim Halpert', amount: '$299.99' },
                      { id: 'p2', name: 'Kevin Malone', item: 'Hydration Powder Bulk', stage: 'Cart Abandoned', trackingCode: 'BUNG-HYDR-44', email: 'kmalone@email.com', phone: '(555) 345-6789', referredBy: 'Oscar Martinez', amount: '$89.99' },
                      { id: 'p3', name: 'Creed Bratton', item: 'Vintage Office Supplies', stage: 'Sale Confirmed', trackingCode: 'BUNG-VINT-22', email: 'cbratton@email.com', phone: '(555) 111-2222', referredBy: 'Meredith Palmer', amount: '$45.00' },
                      { id: 'p4', name: 'Ryan Howard', item: 'WUPHF Premium Plan', stage: 'Pending Payment', trackingCode: 'BUNG-WUPH-77', email: 'rhoward@wuphf.com', phone: '(555) 888-9999', referredBy: 'Kelly Kapoor', amount: '$199.99' },
                      { id: 'p5', name: 'Toby Flenderson', item: 'Legal Document Templates', stage: 'Sale Confirmed', trackingCode: 'BUNG-LEGL-33', email: 'tflenderson@email.com', phone: '(555) 333-4444', referredBy: 'Holly Flax', amount: '$149.00' }
                    ].find(s => s.id === saleId)
                    if (!saleData) return null
                    return (
                      <div className="space-y-3 sm:space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            <div className="size-12 sm:size-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-lg sm:text-xl">
                              {saleData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{saleData.name}</h3>
                              <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">{saleData.item}</p>
                              <Badge className={`mt-1 text-[8px] sm:text-[10px] border-0 ${
                                saleData.stage === 'Sale Confirmed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                              }`}>{saleData.stage}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] sm:text-xs text-gray-400">Order Value</p>
                            <p className="text-lg sm:text-xl font-bold text-blue-600">{saleData.amount}</p>
                            <p className="text-[8px] sm:text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded mt-1">{saleData.trackingCode}</p>
                          </div>
                        </div>

                        {/* Contact & Order Info */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Customer Email</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white truncate">{saleData.email}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Customer Phone</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white">{saleData.phone}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Referred By</p>
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-800 dark:text-white">{saleData.referredBy}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[8px] sm:text-[10px] text-gray-400 mb-1">Status</p>
                            <p className={`text-[10px] sm:text-sm font-semibold ${saleData.stage === 'Sale Confirmed' ? 'text-emerald-600' : 'text-red-500'}`}>
                              {saleData.stage}
                            </p>
                          </div>
                        </div>

                        {/* Activity Log */}
                        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> Order Activity
                          </h4>
                          <div className="space-y-2">
                            {(saleData.stage === 'Sale Confirmed' ? [
                              { action: 'Product added to cart', time: '5 days ago', icon: ShoppingBag },
                              { action: 'Checkout initiated', time: '5 days ago', icon: CreditCard },
                              { action: 'Payment confirmed', time: '5 days ago', icon: Check },
                              { action: 'Order shipped', time: '3 days ago', icon: Truck },
                            ] : [
                              { action: 'Product added to cart', time: '2 days ago', icon: ShoppingBag },
                              { action: 'Cart abandoned', time: '2 days ago', icon: AlertCircle },
                              { action: 'Reminder email sent', time: '1 day ago', icon: Mail },
                            ]).map((activity, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[9px] sm:text-[11px]">
                                <activity.icon className="h-3 w-3 text-gray-400" />
                                <span className="flex-1 text-gray-600 dark:text-gray-400">{activity.action}</span>
                                <span className="text-gray-400">{activity.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                          {saleData.stage === 'Cart Abandoned' ? (
                            <>
                              <Button size="sm" className="h-8 text-[10px] sm:text-xs bg-blue-500 hover:bg-blue-600">
                                <Mail className="h-3 w-3 mr-1" /> Send Reminder
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                                <Phone className="h-3 w-3 mr-1" /> Call Customer
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                                <Tag className="h-3 w-3 mr-1" /> Offer Discount
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" className="h-8 text-[10px] sm:text-xs bg-blue-500 hover:bg-blue-600">
                                <Truck className="h-3 w-3 mr-1" /> Track Shipment
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                                <Mail className="h-3 w-3 mr-1" /> Contact Customer
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-[10px] sm:text-xs">
                                <FileText className="h-3 w-3 mr-1" /> View Invoice
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* Tagline */}
            <div className="text-center mt-2 sm:mt-6 mb-2 sm:mb-5">
              <p className="text-xs sm:text-lg text-gray-700 dark:text-gray-300 font-medium">Select a category below to accelerate your growth.</p>
            </div>

            {/* Main Action Cards - Clean Minimalist Design */}
            <div className="flex flex-col w-full gap-3 sm:gap-4 mb-3 sm:mb-6">
              {/* Products & Services Card - Unified entry that opens a chooser */}
              <button 
                onClick={() => setActiveTab("productsServices")}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-[0.99] shadow-sm hover:shadow-lg ${activeTab === "productsServices" ? "ring-2 ring-[#FF8C00] shadow-lg" : "border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00]/60"} bg-white dark:bg-gray-800`}
              >
                <div className="flex items-center p-4 sm:p-5 gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop" 
                      alt="Products and services"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Products &amp; Services</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Add what you sell or provide and set word-of-mouth referral bounties</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF8C00] transition-colors" />
                </div>
              </button>

              {/* Hiring Card - Clean White Card */}
              <button 
                onClick={() => setActiveTab("hire")}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-[0.99] shadow-sm hover:shadow-lg ${activeTab === "hire" ? "ring-2 ring-fuchsia-600 shadow-lg" : "border border-gray-200 dark:border-gray-700 hover:border-fuchsia-400"} bg-white dark:bg-gray-800`}
              >
                <div className="flex items-center p-4 sm:p-5 gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=150&h=150&fit=crop&crop=faces" 
                      alt="Job interview handshake"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Post Jobs &amp; Hire</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Find qualified local candidates through trusted referrals</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-fuchsia-600 transition-colors" />
                </div>
              </button>
            </div>

            {/* Partner Spotlight - Native Sponsored Card */}
            <div className="mt-3 sm:mt-4">
              <SponsorCarousel variant="native" isDarkMode={false} />
            </div>
          </div>

          {/* Bungee Network Performance & Optimization - DROPDOWN */}
          {!activeTab && (
          <div className="w-full mt-3 sm:mt-4">
            <div className={`rounded-xl border transition-all duration-300 ${
              isNetworkPerfOpen 
                ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-md' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              {/* Dropdown Header */}
              <button 
                onClick={() => setIsNetworkPerfOpen(!isNetworkPerfOpen)}
                className="w-full p-3 sm:p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Bungee Network Performance & Optimization</span>
                </div>
                <div className={`p-1.5 rounded-lg transition-colors ${isNetworkPerfOpen ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
                  {isNetworkPerfOpen ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Dropdown Content */}
              {isNetworkPerfOpen && (
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    {/* Metric Card 1: Ecosystem CAC Savings */}
                    <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ecosystem CAC Savings</span>
                        <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
                      </div>
                      <div className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-baseline">
                        <span className="text-[10px] sm:text-sm font-semibold text-gray-500 mr-0.5">$</span>1,420.00
                      </div>
                      <p className="text-[8px] sm:text-[11px] text-gray-500 dark:text-gray-400 leading-normal mt-1">
                        Your wallet saved an estimated <span className="font-semibold text-emerald-500">$1,420</span> this month by acquiring customers through the Bungee referral network.
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                          <span className="text-gray-400">vs. Traditional CAC</span>
                          <span className="font-bold text-emerald-500">-68% cost</span>
                        </div>
                      </div>
                    </div>

                    {/* Metric Card 2: Network Reach */}
                    <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Network Reach</span>
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                      </div>
                      <div className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                        12,450
                      </div>
                      <p className="text-[8px] sm:text-[11px] text-gray-500 dark:text-gray-400 leading-normal mt-1">
                        Potential customers in your extended Bungee network through <span className="font-semibold text-blue-500">2nd & 3rd degree</span> connections.
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                          <span className="text-gray-400">Growth this week</span>
                          <span className="font-bold text-blue-500">+8.2%</span>
                        </div>
                      </div>
                    </div>

                    {/* Metric Card 3: Trust Score */}
                    <div className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Trust Score</span>
                        <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FF8C00]" />
                      </div>
                      <div className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-baseline">
                        94<span className="text-[10px] sm:text-sm font-semibold text-gray-500 ml-0.5">%</span>
                      </div>
                      <p className="text-[8px] sm:text-[11px] text-gray-500 dark:text-gray-400 leading-normal mt-1">
                        Your business trust rating based on <span className="font-semibold text-[#FF8C00]">referral success</span> and customer satisfaction.
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between text-[8px] sm:text-[10px]">
                          <span className="text-gray-400">Bungee Verified</span>
                          <Badge className="bg-[#FF8C00]/10 text-[#FF8C00] border-0 text-[7px] sm:text-[9px] px-1.5 py-0">Elite</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          
          {/* Tab Content Area - tabs are in the header card above */}
          <div className="space-y-2 sm:space-y-4" id="tab-content">
            {/* Hire Tab Content */}
            {activeTab === "hire" && (
            <div className="space-y-2 sm:space-y-4 animate-in fade-in duration-300">
              {/* Mobile Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">Referral Hires</h2>
                  <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Fill a Position</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <X className="size-3.5" />
                </button>
              </div>
              
              {/* Three Hiring Options - At the TOP */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                {/* Option 1: Self-Hire Referrals */}
                <button 
                  onClick={() => setShowSelfHire(true)}
                  className="p-2 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-fuchsia-500 text-center overflow-hidden shadow-sm"
                >
                  <div className="size-10 sm:size-14 mx-auto mb-1 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=faces" 
                      alt="Team collaboration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white">Self-Hire</h4>
                  <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">Free</p>
                </button>

                {/* Option 2: Pro-Bungee Recruiters */}
                <button 
                  onClick={() => setShowProRecruit(true)}
                  className="p-2 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 text-center overflow-hidden shadow-sm"
                >
                  <div className="size-10 sm:size-14 mx-auto mb-1 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" 
                      alt="Professional recruiter"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white">Pro</h4>
                  <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">10%</p>
                </button>

                {/* Option 3: Bungee Blast */}
                <button 
                  onClick={() => setShowBungeeBlast(true)}
                  className="p-2 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-rose-500 text-center shadow-sm"
                >
                  <div className="size-10 sm:size-14 mx-auto mb-1 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=150&h=150&fit=crop" 
                      alt="Urgent hiring"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white">Blast</h4>
                  <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">$500+</p>
                </button>
              </div>
              
              {/* Job Order Card - Opens Wizard */}
              <Card className="border border-gray-900/50 bg-gradient-to-br from-gray-900/10 to-gray-50 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 sm:size-14 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=150&h=150&fit=crop&crop=faces" 
                        alt="Professional handshake"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">Create Job Posting</h3>
                      <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Use our AI-powered wizard to build the perfect job listing</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* AI Feature Highlight */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/10 border border-gray-900/30">
                      <Sparkles className="size-5 text-gray-900 dark:text-white" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Bungee AI Talent Scraper</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Auto-fill job details from your company website</p>
                      </div>
                    </div>
                    
                    {/* Steps Preview */}
                    <div className="flex items-center justify-between px-2">
                      {['Role Profile', 'Qualifications', 'Screening', 'Bounty'].map((stepName, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className="size-6 sm:size-8 rounded-full bg-gray-900/20 border border-gray-900/30 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-800">
                            {idx + 1}
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">{stepName}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white h-10 sm:h-12 text-sm sm:text-base font-semibold gap-2"
                      onClick={() => setShowJobOrderWizard(true)}
                    >
                      <Plus className="size-4 sm:size-5" />
                      Start Job Order Wizard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Your Services Tab */}
            {activeTab === "marketplace" && (
            <div className="space-y-1.5 sm:space-y-4 animate-in fade-in duration-300">
              {/* Mobile Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-xl font-bold text-gray-900 dark:text-white">Your Services</h2>
                  <p className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">Get New Customers</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <X className="size-3" />
                </button>
              </div>
              
              {/* View Toggle - Compact */}
              <div className="flex gap-0.5 p-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
                <button
                  onClick={() => setMarketplaceView("inventory")}
                  className={`px-1.5 py-0.5 rounded text-[9px] sm:text-sm font-medium transition-colors ${marketplaceView === "inventory" ? "bg-emerald-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                >
                  <Package className="size-2.5 inline mr-0.5" />Inv
                </button>
                <button
                  onClick={() => setMarketplaceView("leads")}
                  className={`px-1.5 py-0.5 rounded text-[9px] sm:text-sm font-medium transition-colors ${marketplaceView === "leads" ? "bg-[#FF8C00] text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                >
                  <Users className="size-2.5 inline mr-0.5" />Leads
                </button>
              </div>
              
              {/* INVENTORY VIEW */}
              {marketplaceView === "inventory" && (
              <>
              {/* Category Buttons - Compact */}
              <div className="flex flex-wrap gap-0.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-5 text-[8px] px-1.5 ${marketplaceCategory === "all" ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setMarketplaceCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-5 text-[8px] px-1.5 ${marketplaceCategory === "vehicles" ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-700" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setMarketplaceCategory("vehicles")}
                >
                  <Car className="size-2 mr-0.5" />Auto
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-5 text-[8px] px-1.5 ${marketplaceCategory === "equipment" ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-700" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setMarketplaceCategory("equipment")}
                >
                  <Wrench className="size-2 mr-0.5" />Eqp
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-5 text-[8px] px-1.5 ${marketplaceCategory === "materials" ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-700" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setMarketplaceCategory("materials")}
                >
                  <Package className="size-2 mr-0.5" />Mat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-5 text-[8px] px-1.5 ${marketplaceCategory === "services" ? "border-emerald-700/50 bg-emerald-700/10 text-emerald-700" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setMarketplaceCategory("services")}
                >
                  <Briefcase className="size-2 mr-0.5" />Svc
                </Button>
              </div>
              
              {/* Quick Stats Bar - Compact */}
              <div className="grid grid-cols-4 gap-0.5 sm:gap-2">
                <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-[10px] sm:text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">List</p>
                </div>
                <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-[10px] sm:text-2xl font-bold text-emerald-500">$847K</p>
                  <p className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Val</p>
                </div>
                <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-[10px] sm:text-2xl font-bold text-[#FF8C00]">156</p>
                  <p className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Lead</p>
                </div>
                <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-[10px] sm:text-2xl font-bold text-green-500">12</p>
                  <p className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Sale</p>
                </div>
              </div>
              
              {/* Add New Service - Wizard */}
              <ServiceBountyWizard onClose={() => setActiveTab(null)} defaultCategory="services" />
              
              {/* Bungee Blast - Compact */}
              <button
                onClick={() => setShowBungeeBlast(true)}
                className="w-full p-1.5 sm:p-4 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-500 border border-red-400/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Megaphone className="size-3.5 sm:size-6 text-gray-900 dark:text-white" />
                    <h3 className="text-[10px] sm:text-lg font-bold text-gray-900 dark:text-white">BLAST</h3>
                  </div>
                  <ChevronRight className="size-3.5 text-gray-900 dark:text-white" />
                </div>
              </button>
              
              {/* Network - Compact */}
              <Card className="border border-emerald-700/30 bg-gradient-to-br from-emerald-700/5 to-gray-50">
                <CardHeader className="pb-1 pt-1.5 px-1.5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 sm:size-6 text-emerald-500" />
                      <CardTitle className="text-gray-900 dark:text-white dark:text-white text-[10px] sm:text-lg">Network</CardTitle>
                    </div>
                    <Badge className="bg-emerald-700/20 text-emerald-500 border-emerald-700/30 text-[8px] sm:text-xs">
                      1,247
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 px-1.5 sm:px-6 pb-1.5 sm:pb-6">
                  <div className="grid grid-cols-3 gap-0.5 sm:gap-3">
                    <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-[10px] sm:text-2xl font-bold text-gray-900 dark:text-white">892</div>
                      <div className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Email</div>
                    </div>
                    <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-[10px] sm:text-2xl font-bold text-gray-900 dark:text-white">355</div>
                      <div className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Phone</div>
                    </div>
                    <div className="p-1 sm:p-3 rounded bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-[10px] sm:text-2xl font-bold text-emerald-500">78%</div>
                      <div className="text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">Open</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Active Inventory - Compact */}
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <CardHeader className="pb-1 pt-1.5 px-1.5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-gray-900 dark:text-white dark:text-white text-[10px] sm:text-lg">Inventory</CardTitle>
                      <Badge className="bg-emerald-700/20 text-emerald-500 border-emerald-700/30 text-[8px] sm:text-xs">24</Badge>
                    </div>
                    <Input placeholder="Search" className="w-16 sm:w-60 h-5 sm:h-8 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-[8px] sm:text-xs px-1" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 px-1.5 sm:px-6 pb-1.5 sm:pb-6">
                  {/* Sample Inventory Items */}
                  {[
                    { name: "Pella 250 Window", price: "$999", stock: 25, bounty: "5%" },
                    { name: "Therma-Tru Door", price: "$1,899", stock: 8, bounty: "5%" },
                    { name: "Ford F-150 XLT", price: "$52K", stock: 3, bounty: "$500" },
                    { name: "Carrier AC", price: "$4,299", stock: 12, bounty: "3%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5 sm:gap-3 p-1 sm:p-3 rounded bg-gray-100 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                      <div className="size-6 sm:size-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Package className="size-3 sm:size-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] sm:text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                        <div className="flex items-center gap-1 text-[7px] sm:text-xs text-gray-600 dark:text-gray-400">
                          <span className="text-emerald-500 font-semibold">{item.price}</span>
                          <span className="text-gray-600 dark:text-gray-400">|</span>
                          <span>{item.stock}</span>
                          <span className="text-[#FF8C00]">{item.bounty}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 h-5 sm:h-8 text-[8px] sm:text-xs px-1 sm:px-3">
                        Edit
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full border-dashed border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-700 h-10">
                    View All 24 Items
                  </Button>
                </CardContent>
              </Card>
              </>
              )}
              
              {/* LEADS VIEW - Customer Referrals Dashboard */}
              {marketplaceView === "leads" && (
              <>
              {/* Leads Stats */}
              <div className="grid grid-cols-4 gap-1 sm:gap-3">
                <div className="p-1.5 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-[#FF8C00]">3</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Pending</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-emerald-500">12</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Closed</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-red-400">5</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">No Sale</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">$4.2K</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Paid</p>
                </div>
              </div>
              
              {/* Pending Leads - Need Action - Compact */}
              <Card className="border border-[#FF8C00]/50 bg-gradient-to-br from-[#FF8C00]/10 to-gray-50">
                <CardHeader className="pb-2 pt-2 px-2 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="size-4 sm:size-5 text-[#FF8C00]" />
                      <CardTitle className="text-gray-900 dark:text-white dark:text-white text-xs sm:text-lg">Pending Leads</CardTitle>
                    </div>
                    <Badge className="bg-red-500 text-white text-[9px] sm:text-xs">{marketplaceLeads.filter(l => l.status === "pending").length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 px-2 sm:px-6 pb-2 sm:pb-6">
                  {marketplaceLeads.filter(l => l.status === "pending").map((lead) => (
                    <button 
                      key={lead.id} 
                      className="w-full p-2 sm:p-4 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-emerald-700/50 hover:shadow-md transition-all text-left"
                      onClick={() => {
                        setSelectedLeadForDetail(lead)
                        setShowLeadDetailModal(true)
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="size-8 sm:size-12 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-sm flex-shrink-0">
                          {lead.customerName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{lead.customerName}</p>
                            <Badge className={`text-[8px] px-1 py-0 ${
                              lead.stage === 'new' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' :
                              lead.stage === 'contacted' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                              'bg-orange-500/20 text-orange-600 border-orange-500/30'
                            }`}>{lead.stage}</Badge>
                          </div>
                          <p className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300 truncate">{lead.product}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                            <span>Referred by <span className="text-emerald-700 font-medium">{lead.referredBy}</span></span>
                            <span className="text-green-500 font-semibold">{lead.bounty}</span>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                  {marketplaceLeads.filter(l => l.status === "pending").length === 0 && (
                    <div className="text-center py-6">
                      <Users className="size-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No pending leads yet</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Leads will appear when Bungees refer customers</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity - Completed - Compact */}
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <CardHeader className="pb-2 pt-2 px-2 sm:px-6">
                  <CardTitle className="text-gray-900 dark:text-white dark:text-white text-xs sm:text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 px-2 sm:px-6 pb-2 sm:pb-6">
                  {marketplaceLeads.filter(l => l.status !== "pending").map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-1.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`size-6 sm:size-8 rounded-full flex items-center justify-center ${lead.status === "sale" ? "bg-emerald-700/20" : "bg-red-500/20"}`}>
                          {lead.status === "sale" ? <Check className="size-3 sm:size-4 text-emerald-500" /> : <X className="size-3 sm:size-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-sm text-gray-900 dark:text-white">{lead.customerName}</p>
                          <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[100px] sm:max-w-none">{lead.product}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-[8px] sm:text-xs px-1 sm:px-2 ${lead.status === "sale" ? "bg-emerald-700/20 text-emerald-500 border-emerald-700/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                          {lead.status === "sale" ? "Sale" : "No Sale"}
                        </Badge>
                        {lead.status === "sale" && (
                          <p className="text-[8px] sm:text-xs text-emerald-500 mt-0.5">{lead.bounty}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </>
              )}
            </div>
            )}

            {/* Your Products Tab */}
            {activeTab === "services" && (
            <div className="space-y-2 sm:space-y-4 animate-in fade-in duration-300">
              {/* Mobile Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">Your Products</h2>
                  <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Boost Product Sales</p>
                </div>
                <button onClick={() => setActiveTab(null)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <X className="size-3.5" />
                </button>
              </div>
              
              {/* View Toggle - Compact */}
              <div className="flex gap-1 p-0.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
                <button
                  onClick={() => setServicesView("services")}
                  className={`px-2 py-1 rounded text-[10px] sm:text-sm font-medium transition-colors ${servicesView === "services" ? "bg-gray-900 text-white" : "text-gray-600 dark:text-gray-400"}`}
                >
                  <Wrench className="size-3 inline mr-1" />Products
                </button>
                <button
                  onClick={() => setServicesView("leads")}
                  className={`px-2 py-1 rounded text-[10px] sm:text-sm font-medium transition-colors ${servicesView === "leads" ? "bg-gray-900 text-white" : "text-gray-600 dark:text-gray-400"}`}
                >
                  <Users className="size-3 inline mr-1" />Leads
                </button>
              </div>
              
              {/* SERVICES VIEW */}
              {servicesView === "services" && (
              <>
              {/* Category Buttons - Compact */}
              <div className="flex flex-wrap gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 text-[9px] px-2 ${serviceCategory === "all" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setServiceCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 text-[9px] px-2 ${serviceCategory === "home" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setServiceCategory("home")}
                >
                  <Home className="size-2.5 mr-0.5" />Home
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 text-[9px] px-2 ${serviceCategory === "outdoor" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setServiceCategory("outdoor")}
                >
                  <TreeDeciduous className="size-2.5 mr-0.5" />Outdoor
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 text-[9px] px-2 ${serviceCategory === "professional" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setServiceCategory("professional")}
                >
                  <Briefcase className="size-2.5 mr-0.5" />Pro
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 text-[9px] px-2 ${serviceCategory === "auto" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                  onClick={() => setServiceCategory("auto")}
                >
                  <Car className="size-2.5 mr-0.5" />Auto
                </Button>
              </div>
              
              {/* Quick Stats Bar - Compact */}
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
                <div className="p-1.5 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">6</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Products</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">$12K</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">MTD</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">28</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Leads</p>
                </div>
                <div className="p-1.5 sm:p-3 rounded bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">78%</p>
                  <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Close</p>
                </div>
              </div>
              
              {/* Create New Product - Wizard */}
              <ProductBountyWizard onClose={() => setActiveTab(null)} />

              {/* Bungee Blast Button - Services - Compact */}
              <button
                onClick={() => setShowBungeeBlast(true)}
                className="w-full p-2 sm:p-4 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-500 border border-red-400/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="size-4 sm:size-6 text-gray-900 dark:text-white" />
                    <div className="text-left">
                      <h3 className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">BLAST</h3>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-gray-900 dark:text-white" />
                </div>
              </button>

              {/* Blast Network Hub - Compact */}
              <Card className="border border-gray-200 dark:border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 dark:bg-gray-800">
                <CardHeader className="pb-2 pt-2 px-2 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 sm:size-6 text-gray-900 dark:text-white" />
                      <div>
                        <CardTitle className="text-gray-900 dark:text-white dark:text-white text-xs sm:text-lg">Network</CardTitle>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 text-[9px] sm:text-xs">
                      1,247
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 px-2 sm:px-6 pb-2 sm:pb-6">
                  <div className="grid grid-cols-3 gap-1 sm:gap-3">
                    <div className="p-1.5 sm:p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">892</div>
                      <div className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Email</div>
                    </div>
                    <div className="p-1.5 sm:p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">355</div>
                      <div className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Phone</div>
                    </div>
                    <div className="p-1.5 sm:p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                      <div className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">82%</div>
                      <div className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Offerings - Compact */}
              <div>
                <h3 className="text-xs sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                  <Star className="size-3 sm:size-5 text-[#FF8C00]" />
                  Your Services
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                {[
                  { service: "IT Consulting", requests: 12, earned: "$4,200", status: "Active" },
                  { service: "Marketing Services", requests: 8, earned: "$2,800", status: "Active" },
                  { service: "Business Coaching", requests: 5, earned: "$1,500", status: "Paused" },
                ].map((svc) => (
                  <div key={svc.service} className="flex items-center gap-2 p-1.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 hover:border-orange-500/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] sm:text-sm font-medium text-gray-900 dark:text-white truncate">{svc.service}</p>
                        <Badge className={`text-[8px] px-1 py-0 ${svc.status === "Active" ? "bg-emerald-700/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-400"}`}>{svc.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-emerald-500 font-semibold">{svc.earned}</span>
                        <span>|</span>
                        <span>{svc.requests} requests</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 h-6 sm:h-8 text-[9px] sm:text-xs px-1.5 sm:px-3">
                      Edit
                    </Button>
                  </div>
                ))}
                </div>
              </div>
              </>
              )}
              
              {/* LEADS VIEW - Client Referrals Dashboard */}
              {servicesView === "leads" && (
              <>
              {/* Leads Stats */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-[#FF8C00]">2</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Pending Review</p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-emerald-500">8</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Contracts Won</p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-red-400">3</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">No Deal</p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">$1,450</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Bounties Paid</p>
                </div>
              </div>
              
              {/* Pending Leads - Need Action */}
              <Card className="border-2 border-[#FF8C00]/50 bg-gradient-to-br from-[#FF8C00]/10 to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-700/20 flex items-center justify-center">
                      <Bell className="size-5 text-blue-700" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-900 dark:text-white dark:text-white text-lg">Pending Client Leads</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">Click to view details and mark outcome</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">{serviceLeads.filter(l => l.status === "pending").length} Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceLeads.filter(l => l.status === "pending").map((lead) => (
                    <button 
                      key={lead.id} 
                      className="w-full p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-sky-500/50 hover:shadow-md transition-all text-left"
                      onClick={() => {
                        setSelectedLeadForDetail(lead)
                        setShowLeadDetailModal(true)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {lead.customerName.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 dark:text-white">{lead.customerName}</p>
                            <Badge className={`text-[10px] ${
                              lead.stage === 'scheduled' ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' :
                              lead.stage === 'contacted' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                              lead.stage === 'quoted' ? 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30' :
                              'bg-blue-500/20 text-blue-600 border-blue-500/30'
                            }`}>{lead.stage}</Badge>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{lead.service}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Referred by <span className="text-blue-700 font-medium">{lead.referredBy}</span></span>
                            <span className="text-xs font-semibold text-green-500">Bounty: {lead.bounty}</span>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                  {serviceLeads.filter(l => l.status === "pending").length === 0 && (
                    <div className="text-center py-6">
                      <Users className="size-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No pending service leads</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Leads will appear when Bungees refer clients</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity - Completed */}
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 dark:text-white dark:text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {serviceLeads.filter(l => l.status !== "pending").map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center ${lead.status === "sale" ? "bg-emerald-700/20" : "bg-red-500/20"}`}>
                          {lead.status === "sale" ? <Check className="size-4 text-emerald-500" /> : <X className="size-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{lead.customerName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{lead.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${lead.status === "sale" ? "bg-emerald-700/20 text-emerald-500 border-emerald-700/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                          {lead.status === "sale" ? "Contract Won" : "No Deal"}
                        </Badge>
                        {lead.status === "sale" && (
                          <p className="text-xs text-emerald-500 mt-1">Bounty paid: {lead.bounty}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </>
              )}
            </div>
            )}
        </div>
      </div>

      {/* Self-Hire Referrals Modal - Job Order Creation */}
      {showSelfHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSelfHire(false)}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowSelfHire(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-md">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=faces" 
                    alt="Team hiring"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Job Order</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Post a position and let the BUNGEE network bring you candidates</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* AI Auto-Fill Button */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                    <Sparkles className="size-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">AI Smart Auto-Fill</p>
                    <p className="text-sm text-gray-300">Let AI help you create the perfect job posting</p>
                  </div>
                </div>
                <Button size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold gap-2">
                  <Sparkles className="size-4" />
                  Generate
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Job Title</Label>
                  <Input placeholder="e.g. Senior Accountant" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Department</Label>
                  <Input placeholder="e.g. Finance" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Location</Label>
                  <Input placeholder="City, State" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Salary Range</Label>
                  <Input placeholder="$60,000 - $80,000" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Employment Type</Label>
                  <Input placeholder="Full-time, Part-time" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white font-medium">Job Description</Label>
                <textarea 
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="w-full h-24 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
              
              {/* Additional Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Required Skills</Label>
                  <Input placeholder="e.g. Excel, QuickBooks, CPA" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 dark:text-white font-medium">Experience Level</Label>
                  <Input placeholder="e.g. 3-5 years" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
              </div>
              
              {/* Work Arrangement */}
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white font-medium">Work Arrangement</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-gray-900 bg-gray-900 text-white hover:bg-gray-800">On-site</Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700">Remote</Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700">Hybrid</Button>
                </div>
              </div>
              
              {/* Bounty Section */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-5 text-gray-900 dark:text-white" />
                    <span className="font-bold text-gray-900 dark:text-white">Set Your Referral Bounty</span>
                  </div>
                  <Badge className="bg-gray-900 text-white border-0">Attract Top Referrals</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$100</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Standard</p>
                  </button>
                  <button className="p-3 rounded-lg bg-gray-900 border-2 border-gray-900 cursor-pointer text-center">
                    <p className="text-2xl font-bold text-white">$250</p>
                    <p className="text-xs text-gray-300">Recommended</p>
                  </button>
                  <button className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$500+</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Premium</p>
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Input placeholder="Or enter custom amount" className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white placeholder:text-gray-400 max-w-[200px]" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Higher bounties get 3x more referrals</span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700" onClick={() => setShowSelfHire(false)}>Cancel</Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white gap-2">
                  <Zap className="size-4" />
                  Post Position
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sale Confirmation Modal - Triggers Stripe Payment */}
      {showSaleConfirmModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSaleConfirmModal(false)}>
          <div className="relative w-full max-w-md bg-[#2D3748] rounded-2xl border border-emerald-700/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-emerald-700/30">
              <button onClick={() => setShowSaleConfirmModal(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-gray-100 dark:bg-gray-700/90 hover:bg-red-500 transition-colors z-10 border border-gray-200 dark:border-gray-700">
                <X className="size-6 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl bg-emerald-700/20 flex items-center justify-center">
                  <Check className="size-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Sale</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This will trigger bounty payment</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Sale Details */}
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedLead.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Product</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedLead.product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Referred By</span>
                  <span className="text-sm font-semibold text-[#FF8C00]">{selectedLead.referredBy}</span>
                </div>
              </div>
              
              {/* Payment Breakdown */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF8C00]/10 to-yellow-500/10 border border-[#FF8C00]/30 space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="size-4 text-[#FF8C00]" /> Bounty Payment Breakdown
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">BUNGEE Referrer ({selectedLead.referredBy})</span>
                    <span className="text-sm font-bold text-emerald-500">{selectedLead.bounty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">BUNGEE Corporate (15%)</span>
                    <span className="text-sm font-bold text-blue-400">${(parseFloat(selectedLead.bounty.replace('$', '')) * 0.15).toFixed(0)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Total to be charged</span>
                    <span className="text-lg font-bold text-[#FF8C00]">${(parseFloat(selectedLead.bounty.replace('$', '')) * 1.15).toFixed(0)}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="p-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-700/20 flex items-center justify-center">
                  <CreditCard className="size-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Payment via Stripe</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Visa ending in 4242</p>
                </div>
                <Badge className="bg-emerald-700/20 text-emerald-500 border-emerald-700/30">Connected</Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700"
                  onClick={() => setShowSaleConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-emerald-700 hover:bg-green-600 text-gray-900 dark:text-white gap-2"
                  onClick={() => {
                    // Here we would trigger the Stripe payment
                    // For now, just close the modal and show success
                    setShowSaleConfirmModal(false)
                    setSelectedLead(null)
                  }}
                >
                  <Check className="size-4" />
                  Confirm & Pay Bounty
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Sale / No Hire Confirmation Modal - Triggers Email */}
      {showNoSaleModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowNoSaleModal(false)}>
          <div className="relative w-full max-w-md bg-[#2D3748] rounded-2xl border border-red-500/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gradient-to-r from-red-600/20 to-gray-50 border-b border-red-500/30">
              <button onClick={() => setShowNoSaleModal(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-gray-100 dark:bg-gray-700/90 hover:bg-red-500 transition-colors z-10 border border-gray-200 dark:border-gray-700">
                <X className="size-6 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <X className="size-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm No Sale</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This will notify the customer</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Lead Details */}
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedLead.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Service/Product</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedLead.product || selectedLead.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Referred By</span>
                  <span className="text-sm font-semibold text-[#FF8C00]">{selectedLead.referredBy}</span>
                </div>
              </div>
              
              {/* Reason Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 text-sm">Reason for No Sale (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {["Budget", "Timing", "Chose competitor", "Not a fit", "No response", "Other"].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setNoSaleReason(reason)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${noSaleReason === reason ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-500"}`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Email Preview */}
              <div className="p-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="size-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Email will be sent to customer:</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Subject: Update on your inquiry</p>
                  <p>Dear {selectedLead.customerName},</p>
                  <p className="mt-1">Thank you for your interest in our services. After careful review, we are unable to move forward with your request at this time...</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-700"
                  onClick={() => {
                    setShowNoSaleModal(false)
                    setNoSaleReason("")
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-gray-900 dark:text-white gap-2"
                  onClick={() => {
                    // Trigger email notification
                    console.log("[v0] Sending no-sale email to:", selectedLead.email)
                    setShowNoSaleModal(false)
                    setSelectedLead(null)
                    setNoSaleReason("")
                  }}
                >
                  <Mail className="size-4" />
                  Confirm & Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bungee Blast Modal */}
      {showBungeeBlast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowBungeeBlast(false)}>
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowBungeeBlast(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-md">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=150&h=150&fit=crop" 
                    alt="Urgent hiring"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Priority Talent Blast</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Emergency hiring blast to nearby Bungees</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 block">Select Blast Radius</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => setBlastRadius(radius)}
                      className={`py-3 px-2 rounded-lg text-center transition-all ${blastRadius === radius ? "bg-gray-900 text-white border-2 border-gray-700" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 hover:border-gray-900"}`}
                    >
                      <p className="text-lg font-bold">{radius}</p>
                      <p className="text-xs">miles</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Estimated Bungees Reached</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{blastRadius * 47}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Avg Response Time</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">&lt; 2 hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white font-medium">Position Title</Label>
                <Input placeholder="e.g. Warehouse Associate, Driver, etc." className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-white font-medium">Bounty Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["$250", "$500", "$750"].map((amt) => (
                    <button key={amt} className="py-2 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:bg-gray-700 hover:border-gray-900 transition-colors">
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-bold">
                <AlertTriangle className="size-5 mr-2" />
                SEND EMERGENCY BLAST
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {/* Business Profile - Full Page View (no backdrop) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {/* Header - Clean White Minimalist */}
          <div className="sticky top-0 z-10 border-b px-4 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <ChevronRight className="size-5 rotate-180" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Business Profile</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage your business information</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Full Page Content */}
          <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Business Avatar */}
              <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-[#FF8C00]/10 to-amber-900/10 border-b border-gray-200 dark:border-gray-700">
                <div className="relative inline-block">
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-[#FF8C00]/30 to-amber-900/30 border-2 border-[#FF8C00]/50 overflow-hidden shadow-xl flex items-center justify-center">
                    {uploadedLogo ? (
                      <img src={uploadedLogo} alt="Business Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="size-14 text-[#FF8C00]" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 size-10 rounded-full bg-[#FF8C00] flex items-center justify-center border-3 border-white dark:border-gray-800 shadow-lg hover:bg-[#E67E00] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("File size must be less than 2MB")
                            return
                          }
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            setUploadedLogo(event.target?.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <Camera className="size-5 text-white" />
                  </label>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-4">
                  {uploadedLogo ? "Logo uploaded! Tap camera to change." : "Upload your business logo"}
                </p>
                {uploadedLogo && (
                  <button 
                    onClick={() => setUploadedLogo(null)}
                    className="mt-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                  >
                    Remove logo
                  </button>
                )}
              </div>

              {/* Profile Fields */}
              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Business Name</label>
                  <Input 
                    defaultValue={businessName}
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Industry</label>
                  <Input 
                    defaultValue="Technology"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Business Email</label>
                  <Input 
                    defaultValue="contact@yourbusiness.com"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
                  <Input 
                    defaultValue="+1 (555) 123-4567"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Business Address</label>
                  <Input 
                    defaultValue="123 Business St, City, ST 12345"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-12 text-base"
                  />
                </div>

                {/* Save Button */}
                <Button className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-base mt-6">
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="relative w-full max-w-lg bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-700/50 to-gray-50/50 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowSettings(false)} className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700/90 hover:bg-red-500 transition-colors z-10 border border-gray-200 dark:border-gray-700">
                <X className="size-5 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-[#FF8C00]/20 flex items-center justify-center">
                  <Settings className="size-6 text-[#FF8C00]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Business Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your business profile</p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setSettingsTab("business")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${settingsTab === "business" ? "text-[#FF8C00] border-b-2 border-[#FF8C00]" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"}`}
              >
                Business Info
              </button>
              <button 
                onClick={() => setSettingsTab("legal")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${settingsTab === "legal" ? "text-[#FF8C00] border-b-2 border-[#FF8C00]" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"}`}
              >
                Legal & Contracts
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {settingsTab === "business" && (
                <div className="space-y-4">
                  {/* Business Logo */}
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-xl bg-[#FF8C00]/20 flex items-center justify-center border-2 border-dashed border-[#FF8C00]/50">
                      <Building2 className="size-8 text-[#FF8C00]" />
                    </div>
                    <div>
                      <Button size="sm" className="bg-[#FF8C00] hover:bg-[#E67E00] text-gray-900 dark:text-white">
                        Upload Logo
                      </Button>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">PNG or JPG, max 2MB</p>
                    </div>
                  </div>
                  
                  {/* Business Name */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Business Name</label>
                    <Input 
                      value={businessInfo.name} 
                      onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})} 
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                      placeholder="Enter business name" 
                    />
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Business Address</label>
                    <Input 
                      value={businessInfo.address} 
                      onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})} 
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                      placeholder="123 Main St, City, State" 
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Phone Number</label>
                    <Input 
                      value={businessInfo.phone} 
                      onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})} 
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                      placeholder="(555) 123-4567" 
                    />
                  </div>
                  
                  {/* Website */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Website</label>
                    <Input 
                      value={businessInfo.website} 
                      onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})} 
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                      placeholder="https://yourwebsite.com" 
                    />
                  </div>
                  
                  {/* Industry */}
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Industry</label>
                    <Input 
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                      placeholder="e.g., Technology, Healthcare, Retail" 
                    />
                  </div>
                  
                  {/* Save Button */}
                  <Button className="w-full bg-emerald-700 hover:bg-green-600 text-gray-900 dark:text-white mt-4">
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
              
              {settingsTab === "legal" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Complete the required contracts to activate your business on Bungee.
                  </p>
                  
                  {/* Contract List */}
                  <div className="space-y-3">
                    {/* Service Agreement */}
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <FileText className="size-5 text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Service Agreement</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Required to use Bungee services</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Signed</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-[#FF8C00] hover:bg-[#E67E00]">
                        Review & Sign
                      </Button>
                    </div>
                    
                    {/* Referral Terms */}
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <FileText className="size-5 text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Referral Terms</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Bounty payment agreement</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Signed</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-[#FF8C00] hover:bg-[#E67E00]">
                        Review & Sign
                      </Button>
                    </div>
                    
                    {/* Privacy Policy */}
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <FileText className="size-5 text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Privacy Policy</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data handling agreement</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Signed</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-[#FF8C00] hover:bg-[#E67E00]">
                        Review & Sign
                      </Button>
                    </div>
                    
                    {/* W-9 Form */}
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <FileText className="size-5 text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">W-9 Tax Form</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Required for payments</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-gray-200 hover:bg-gray-50 dark:bg-gray-8000">
                        Upload W-9
                      </Button>
                    </div>
                  </div>
                  
                  {/* Status Summary */}
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="size-5" />
                      <span className="text-sm font-semibold">3 contracts require attention</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Complete all contracts to fully activate your account.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Veteran Pool Modal */}
      {showVeteranPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowVeteranPool(false)}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowVeteranPool(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-md">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1580130732478-4e339fb6836f?w=150&h=150&fit=crop&crop=faces" 
                    alt="Military veteran"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Veteran Pool</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Support veteran employment through trusted referrals</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Input placeholder="Search by skill, MOS, or job title..." className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white flex-1" />
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Search</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Marcus J.", branch: "Army", mos: "11B Infantry", skills: "Leadership, Security, Logistics", years: 8, available: true },
                  { name: "Jennifer K.", branch: "Navy", mos: "IT Specialist", skills: "Cybersecurity, Networks, Systems Admin", years: 6, available: true },
                  { name: "Robert M.", branch: "Marines", mos: "Motor Transport", skills: "Fleet Management, CDL-A, Mechanics", years: 12, available: true },
                  { name: "Amanda L.", branch: "Air Force", mos: "Admin Specialist", skills: "Office Management, HR, Scheduling", years: 4, available: false },
                  { name: "David P.", branch: "Coast Guard", mos: "Operations Specialist", skills: "Logistics, Emergency Response, Training", years: 10, available: true },
                ].map((vet, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:shadow-md transition-all">
                    <div className="size-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                      {vet.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white">{vet.name}</p>
                        <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 text-xs font-medium">{vet.branch}</Badge>
                        {vet.available && <Badge className="bg-gray-900 text-white border-gray-900 text-xs">Available</Badge>}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{vet.mos} - {vet.years} years service</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{vet.skills}</p>
                    </div>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">Contact</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Talent Pool Modal */}
      {showBungeePool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowBungeePool(false)}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowBungeePool(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-md">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=150&h=150&fit=crop&crop=faces" 
                    alt="Diverse professional team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Talent Pool</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Silver & Bronze medalists from past hiring blasts</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Input placeholder="Search by role, skills, or company..." className="bg-white dark:bg-gray-800 border-gray-300 text-gray-900 dark:text-white flex-1" />
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Search</Button>
              </div>
              <div className="flex gap-2 mb-4">
                <Badge className="bg-gray-900 text-white border-gray-900 cursor-pointer">All</Badge>
                <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 cursor-pointer hover:bg-gray-200">Silver Medalists</Badge>
                <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 cursor-pointer hover:bg-gray-200">Bronze Medalists</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sarah M.", role: "Full Stack Developer", company: "TechCorp", match: 94, medal: "silver", skills: "React, Node.js, AWS" },
                  { name: "James K.", role: "Sales Manager", company: "SalesForce Inc", match: 91, medal: "silver", skills: "B2B Sales, CRM, Team Leadership" },
                  { name: "Maria L.", role: "Marketing Director", company: "AdVenture Co", match: 87, medal: "bronze", skills: "Digital Marketing, SEO, Analytics" },
                  { name: "Tom W.", role: "Project Manager", company: "BuildIt LLC", match: 89, medal: "silver", skills: "Agile, Scrum, JIRA" },
                  { name: "Lisa R.", role: "UX Designer", company: "DesignHub", match: 85, medal: "bronze", skills: "Figma, User Research, Prototyping" },
                ].map((candidate, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:shadow-md transition-all">
                    <div className={`size-12 rounded-full flex items-center justify-center text-white font-bold ${candidate.medal === "silver" ? "bg-gray-400" : "bg-gray-600"}`}>
                      {candidate.medal === "silver" ? "2" : "3"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white">{candidate.name}</p>
                        <Badge className={`text-xs font-medium ${candidate.medal === "silver" ? "bg-gray-200 text-gray-700 dark:text-gray-300 border-gray-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300"}`}>
                          {candidate.medal === "silver" ? "Silver" : "Bronze"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{candidate.role}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Previously at {candidate.company} | {candidate.skills}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={candidate.match} className="h-1.5 flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-900 dark:text-white font-medium">{candidate.match}% match</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">View</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Recruit Modal */}
      {showProRecruit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowProRecruit(false)}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowProRecruit(false)} className="absolute top-3 right-3 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-md">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" 
                    alt="Professional recruiter"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managed Recruiting</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Professional recruiters at 10-12% (half industry rate)</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Fee Breakdown */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><DollarSign className="size-4 text-gray-900 dark:text-white" /> Fee Structure &amp; Agreement</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">10-12%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">BUNGEE Recruiter Fee</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 text-center">
                    <p className="text-2xl font-bold text-gray-400 line-through">20-25%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Industry Standard</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="size-4 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                    <span>Fee is based on first-year salary of placed candidate</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="size-4 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                    <span>90-day replacement guarantee at no additional cost</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="size-4 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                    <span>No upfront fees - pay only when candidate is hired</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="size-4 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                    <span>Payment plans available (split over 3 months)</span>
                  </div>
                </div>
              </div>

              {/* Available Recruiters */}
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Available Recruiters</h3>
              <div className="space-y-3">
                {[
                  { name: "Michael Chen", specialty: "Tech & Engineering", placements: 156, rating: 4.9, fee: "10%" },
                  { name: "Sarah Williams", specialty: "Sales & Marketing", placements: 203, rating: 4.8, fee: "11%" },
                  { name: "David Martinez", specialty: "Healthcare", placements: 89, rating: 4.9, fee: "12%" },
                  { name: "Emily Johnson", specialty: "Finance & Accounting", placements: 124, rating: 4.7, fee: "10%" },
                ].map((recruiter, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 transition-colors">
                    <div className="size-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                      {recruiter.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">{recruiter.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{recruiter.specialty}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{recruiter.placements} placements</span>
                        <span className="text-xs text-gray-900 dark:text-white flex items-center gap-0.5">
                          <Star className="size-3 fill-gray-900" /> {recruiter.rating}
                        </span>
                        <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 text-xs">{recruiter.fee} fee</Badge>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">Hire</Button>
                  </div>
                ))}
              </div>

              {/* Agreement Notice */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">By selecting a Managed Recruiter, you agree to the BUNGEE Placement Agreement. The recruiter will present a shortlist within 5-10 business days. The placement fee is due within 30 days of the candidate&apos;s start date. All recruiters are background-checked and BUNGEE-certified.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Management Wizard Modal */}
      {showCandidateWizard && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowCandidateWizard(false)}>
          <div className="relative w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowCandidateWizard(false)} 
              className="absolute -top-2 -right-2 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <X className="size-5 text-gray-900 dark:text-white" />
            </button>
            <CandidateManagementWizard 
              onClose={() => setShowCandidateWizard(false)}
              candidateName={selectedCandidate.name}
              jobTitle={selectedCandidate.role}
              referredBy={selectedCandidate.referrer + " (Bungee User)"}
              bountyAmount={selectedCandidate.bounty}
            />
          </div>
        </div>
      )}

      {/* Job Order Wizard Modal */}
      {showJobOrderWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowJobOrderWizard(false)}>
          <div className="relative w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowJobOrderWizard(false)} 
              className="absolute -top-2 -right-2 p-2.5 rounded-full bg-white dark:bg-gray-800 hover:bg-red-500 transition-colors z-10 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <X className="size-5 text-gray-900 dark:text-white" />
            </button>
            <JobOrderWizard onClose={() => setShowJobOrderWizard(false)} />
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetailModal && selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowLeadDetailModal(false)}>
          <div className="relative w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <Card className="border border-emerald-700/30 bg-white dark:bg-gray-800 shadow-2xl">
              {/* Close Button */}
              <button 
                onClick={() => setShowLeadDetailModal(false)} 
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white transition-colors z-10"
              >
                <X className="size-4" />
              </button>

              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedLeadForDetail.customerName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{selectedLeadForDetail.customerName}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLeadForDetail.product || selectedLeadForDetail.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${
                        selectedLeadForDetail.stage === 'new' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' :
                        selectedLeadForDetail.stage === 'contacted' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                        selectedLeadForDetail.stage === 'scheduled' ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' :
                        selectedLeadForDetail.stage === 'negotiating' ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' :
                        selectedLeadForDetail.stage === 'quoted' ? 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30' :
                        'bg-gray-50 dark:bg-gray-8000/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
                      }`}>{selectedLeadForDetail.stage}</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{selectedLeadForDetail.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* What They're Looking For */}
                <div className="p-3 rounded-lg bg-emerald-700/10 border border-emerald-700/30">
                  <h4 className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                    <Target className="size-3" />
                    What They&apos;re Looking For
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedLeadForDetail.lookingFor}</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contact Information</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <Mail className="size-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{selectedLeadForDetail.email}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <Phone className="size-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{selectedLeadForDetail.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Referral Info */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Referred by</p>
                    <p className="text-sm font-semibold text-emerald-700">{selectedLeadForDetail.referredBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bounty</p>
                    <p className="text-lg font-bold text-green-500">{selectedLeadForDetail.bounty}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedLeadForDetail.notes && (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="text-xs font-semibold text-yellow-700 mb-1">Notes</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedLeadForDetail.notes}</p>
                  </div>
                )}

                {/* Action Buttons - Sale or No Sale */}
                {selectedLeadForDetail.status === 'pending' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">Did this lead result in a sale?</p>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-emerald-700 hover:bg-green-600 text-white h-12 text-base font-semibold gap-2"
                        onClick={() => {
                          // Update lead status to sale
                          const isMarketplace = selectedLeadForDetail.product !== undefined
                          if (isMarketplace) {
                            setMarketplaceLeads(prev => prev.map(l => 
                              l.id === selectedLeadForDetail.id ? {...l, status: 'sale', stage: 'closed'} : l
                            ))
                          } else {
                            setServiceLeads(prev => prev.map(l => 
                              l.id === selectedLeadForDetail.id ? {...l, status: 'sale', stage: 'completed'} : l
                            ))
                          }
                          setShowLeadDetailModal(false)
                        }}
                      >
                        <Check className="size-5" />
                        Sale Made
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-500 hover:bg-red-50 h-12 text-base font-semibold gap-2"
                        onClick={() => {
                          // Update lead status to no_sale
                          const isMarketplace = selectedLeadForDetail.product !== undefined
                          if (isMarketplace) {
                            setMarketplaceLeads(prev => prev.map(l => 
                              l.id === selectedLeadForDetail.id ? {...l, status: 'no_sale', stage: 'lost'} : l
                            ))
                          } else {
                            setServiceLeads(prev => prev.map(l => 
                              l.id === selectedLeadForDetail.id ? {...l, status: 'no_sale', stage: 'lost'} : l
                            ))
                          }
                          setShowLeadDetailModal(false)
                        }}
                      >
                        <X className="size-5" />
                        No Sale
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status Badge for closed leads */}
                {selectedLeadForDetail.status !== 'pending' && (
                  <div className={`p-4 rounded-lg text-center ${
                    selectedLeadForDetail.status === 'sale' 
                      ? 'bg-emerald-700/20 border border-emerald-700/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <p className={`text-lg font-bold ${
                      selectedLeadForDetail.status === 'sale' ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {selectedLeadForDetail.status === 'sale' ? 'Sale Completed' : 'No Sale'}
                    </p>
                    {selectedLeadForDetail.status === 'sale' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bounty of {selectedLeadForDetail.bounty} paid to {selectedLeadForDetail.referredBy}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Wallet/Escrow Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white dark:bg-gray-900 w-full sm:w-[420px] sm:max-w-[90vw] max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FF8C00] to-orange-500 border-b border-orange-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Wallet & Escrow</h3>
                  <p className="text-xs text-white/80">Manage your funds</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Balance Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$2,450.00</p>
                <p className="text-xs text-emerald-600 mt-1">+$350.00 this month</p>
              </div>
              
              {/* Escrow Section */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">In Escrow</p>
                  <p className="text-lg font-bold text-amber-800 dark:text-amber-300">$1,200.00</p>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">3 active job orders pending completion</p>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-sm transition-colors">
                  Add Funds
                </button>
                <button className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm border border-gray-200 dark:border-gray-700 transition-colors">
                  Withdraw
                </button>
              </div>
              
              {/* Recent Transactions */}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Transactions</p>
                <div className="space-y-2">
                  {[
                    { desc: "Job Order #1042 - Escrow Release", amount: "+$450.00", date: "Today", type: "credit" },
                    { desc: "Service Bounty Payment", amount: "-$125.00", date: "Yesterday", type: "debit" },
                    { desc: "Referral Bonus", amount: "+$50.00", date: "May 28", type: "credit" },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                      </div>
                      <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around py-3 px-6 max-w-lg mx-auto">
          {/* Campaigns */}
          <button 
            onClick={() => setActiveTab(null)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 ${
              !activeTab 
                ? 'bg-[#FF8C00]/10 border-2 border-[#FF8C00] shadow-md shadow-[#FF8C00]/20' 
                : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
            }`}>
              <Megaphone className={`w-5 h-5 ${!activeTab ? 'text-[#FF8C00]' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs font-semibold ${!activeTab ? 'text-[#FF8C00]' : 'text-gray-500'}`}>Campaigns</span>
          </button>

          {/* Analytics */}
          <button 
            onClick={() => setActiveTab('marketplace')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 ${
              activeTab === 'marketplace'
                ? 'bg-[#FF8C00]/10 border-2 border-[#FF8C00] shadow-md shadow-[#FF8C00]/20' 
                : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
            }`}>
              <BarChart3 className={`w-5 h-5 ${activeTab === 'marketplace' ? 'text-[#FF8C00]' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs font-semibold ${activeTab === 'marketplace' ? 'text-[#FF8C00]' : 'text-gray-500'}`}>Analytics</span>
          </button>

          {/* Wallet/Escrow */}
          <button 
            onClick={() => setShowWalletModal(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <Wallet className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs font-semibold text-gray-500">Wallet</span>
          </button>
        </div>
      </div>

      {/* Floating Ask Bungee Button - Draggable, positions itself */}
      <AskBungeeChat 
        variant="floating"
        onNavigate={(tab) => {
          if (tab === 'hire' || tab === 'services' || tab === 'products' || tab === 'marketplace') {
            setActiveTab(tab as typeof activeTab)
          }
        }}
        onOpenModal={(modal) => {
          if (modal === 'self-hire') {
            setActiveTab('hire')
            setShowJobOrderWizard(true)
          } else if (modal === 'pro-recruit') {
            setActiveTab('hire')
            setShowProRecruit(true)
          } else if (modal === 'veteran-pool') {
            setShowVeteranPool(true)
          } else if (modal === 'bungee-pool') {
            setShowBungeePool(true)
          }
        }}
      />

      {/* Business Verification Modal */}
      <BusinessVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerified={() => {
          setIsBusinessVerified(true)
          setShowVerificationModal(false)
          // After verification, open bounty creation
          setShowBountyCreation(true)
        }}
        userId={userProfile?.id || ''}
        isDarkMode={isDarkMode}
      />

    </div>
    </>
  )
}
