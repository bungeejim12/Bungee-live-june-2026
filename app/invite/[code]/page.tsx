import Image from "next/image"
import Link from "next/link"
import { Building2, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getReferrerByCode } from "@/app/actions/referrals"
import { getReferrerDisplayName } from "@/lib/referrals"

interface InvitePageProps {
  params: Promise<{ code: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params
  const referrer = await getReferrerByCode(code)

  if (!referrer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 md:p-6 bg-white border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Invite not found</h1>
            <p className="text-gray-600 mb-6">This referral link is invalid or has expired.</p>
            <Link href="/auth/sign-up">
              <Button className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold">
                Sign up without a referral
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const referrerName = getReferrerDisplayName(referrer)
  const isBusinessReferrer = referrer.user_type === "business"
  const signUpUrl = `/auth/sign-up?ref=${encodeURIComponent(referrer.referral_code)}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 md:p-6 bg-white border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#FF8C00]/5 to-transparent border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center mb-4">
              {isBusinessReferrer ? (
                <Building2 className="h-8 w-8 text-[#FF8C00]" />
              ) : (
                <Users className="h-8 w-8 text-[#FF8C00]" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a]">You&apos;re invited!</h1>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold text-[#0f172a]">{referrerName}</span> invited you to join Bungee
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-sm text-gray-600 text-center">
              {isBusinessReferrer
                ? "Create your account to connect with local promoters and grow through referrals."
                : "Create your account to start earning by referring people, products, and services."}
            </p>

            <Link href={signUpUrl} className="block">
              <Button className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-base rounded-xl shadow-lg shadow-[#FF8C00]/20">
                Accept Invite & Sign Up
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#FF8C00] hover:text-[#E67E00] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
