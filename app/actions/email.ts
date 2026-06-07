"use server"

import { Resend } from "resend"

type WaitlistEmailData = {
  to: string
  fullName: string
  waitlistSpot: number
  accountType: "bungee" | "business" | "both"
  referralLink: string
}

export async function sendWaitlistConfirmationEmail(data: WaitlistEmailData) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Email service not configured" }
  }
  
  const resendClient = new Resend(process.env.RESEND_API_KEY)

  const { to, fullName, waitlistSpot, accountType, referralLink } = data
  
  // BUSINESS EMAIL TEMPLATE
  if (accountType === "business") {
    const businessPlainText = `Hi ${fullName},

Your business is officially locked in on the Bungee waitlist! Your Launch Tier Priority is secured.

Thank you for joining the Bungee network. We are actively building your hyper-local cluster. At launch, an army of hundreds of thousands of local community promoters will be deployed to drive risk-free customer acquisition, premium service leads, and emergency hiring talent straight to your business.

Keep an eye on your inbox for our merchant onboarding dashboard access link coming soon.

See you at launch,
Maika & The Bungee Team

---
You received this email because you or a friend joined the Bungee waitlist.
JustBungee.com | St. Augustine, FL
To unsubscribe, reply with "unsubscribe" in the subject line.`

    try {
      const { error } = await resendClient.emails.send({
        from: "Maika from Bungee <hello@justbungee.com>",
        to: [to],
        subject: `Your Business is Locked In, ${fullName}! Launch Tier Priority Secured`,
        text: businessPlainText,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Business is Locked In - Bungee</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:32px;font-weight:800;color:#FF8C00;letter-spacing:-1px;">bungee</span>
            </td>
          </tr>

          <!-- Greeting & Hook -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 16px 0;font-size:18px;color:#1e293b;line-height:1.5;">Hi ${fullName},</p>
              <h1 style="margin:0 0 12px 0;font-size:26px;font-weight:700;color:#1e293b;line-height:1.3;">Your business is officially locked in!</h1>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">Launch Tier Priority Secured.</p>
            </td>
          </tr>

          <!-- Priority Badge -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:12px 24px;background-color:#FFF7ED;border:2px solid #FF8C00;border-radius:12px;">
                    <span style="font-size:14px;color:#92400e;font-weight:500;">Launch Tier:</span>
                    <span style="font-size:24px;font-weight:800;color:#FF8C00;margin-left:8px;">Priority Secured</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:28px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Value Pitch - Business Focused -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#475569;line-height:1.6;">Thank you for joining the Bungee network. We are actively building your hyper-local cluster.</p>
              <p style="margin:0 0 16px 0;font-size:15px;color:#1e293b;line-height:1.6;font-weight:600;">At launch, an army of <span style="color:#FF8C00;">hundreds of thousands of local community promoters</span> will be deployed to drive:</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#475569;line-height:1.5;">
                    <span style="color:#FF8C00;margin-right:8px;">✓</span>Risk-free customer acquisition
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#475569;line-height:1.5;">
                    <span style="color:#FF8C00;margin-right:8px;">✓</span>Premium service leads
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#475569;line-height:1.5;">
                    <span style="color:#FF8C00;margin-right:8px;">✓</span>Emergency hiring talent
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.6;">Keep an eye on your inbox for our <strong style="color:#1e293b;">merchant onboarding dashboard access link</strong> coming soon.</p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color:#FF8C00;border-radius:10px;box-shadow:0 4px 14px rgba(255,140,0,0.3);">
                    <a href="https://justbungee.com" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Explore Merchant Launch Perks</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.5;">See you at launch,</p>
              <p style="margin:4px 0 0 0;font-size:15px;color:#FF8C00;font-weight:600;">Maika & The Bungee Team</p>
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding-bottom:24px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;line-height:1.5;">
                You received this email because you or a friend joined the Bungee waitlist.
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                JustBungee.com | St. Augustine, FL
              </p>
              <p style="margin:8px 0 0 0;font-size:11px;color:#cbd5e1;">
                To unsubscribe, reply with "unsubscribe" in the subject line.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      })

      if (error) {
        console.error("[v0] Resend API error:", JSON.stringify(error))
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      console.error("[v0] Email send error:", err)
      return { success: false, error: "Failed to send email" }
    }
  }

  // REFERRER EMAIL TEMPLATE (includes "bungee" and "both" account types)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0f172a&margin=10`

  const referrerPlainText = `Hi ${fullName},

You are officially locked in on the Bungee waitlist! Your priority spot #${waitlistSpot} is secured.

Don't wait until launch day to start building your pipeline—your 18-month residual income clock can start right now.

Whether you are standing in front of a local business looking for hundreds of thousands of promoters, or a friend looking to build an uncapped revenue stream, have them scan your unique tracking QR code or use your backup invite link below.

The exact second they scan this and join the waitlist, our system securely ties their profile to your account. Every time that business uses Bungee or that user completes a campaign, you unlock a powerful residual income stream for the next 18 months.

Backup Invite Link: ${referralLink}

See you at launch,
Maika & The Bungee Team

---
You received this email because you or a friend joined the Bungee waitlist.
JustBungee.com | St. Augustine, FL
To unsubscribe, reply with "unsubscribe" in the subject line.`

  try {
    const { error } = await resendClient.emails.send({
      from: "Maika from Bungee <hello@justbungee.com>",
      to: [to],
      subject: `You're Locked In, ${fullName}! Your Bungee Spot #${waitlistSpot} is Secured`,
      text: referrerPlainText,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You're Locked In - Bungee</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:32px;font-weight:800;color:#FF8C00;letter-spacing:-1px;">bungee</span>
            </td>
          </tr>

          <!-- Greeting & Hook -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 16px 0;font-size:18px;color:#1e293b;line-height:1.5;">Hi ${fullName},</p>
              <h1 style="margin:0 0 12px 0;font-size:26px;font-weight:700;color:#1e293b;line-height:1.3;">You are officially locked in on the Bungee waitlist!</h1>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.5;">Your priority spot is secured.</p>
            </td>
          </tr>

          <!-- Spot Badge -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:12px 24px;background-color:#FFF7ED;border:2px solid #FF8C00;border-radius:12px;">
                    <span style="font-size:14px;color:#92400e;font-weight:500;">Your Spot:</span>
                    <span style="font-size:28px;font-weight:800;color:#FF8C00;margin-left:8px;">#${waitlistSpot}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:28px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Value Pitch -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#1e293b;line-height:1.6;font-weight:600;">Don't wait until launch day to start building your pipeline—your 18-month residual income clock can start right now.</p>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.6;">Your Unique Tracking QR Code is below. Whether you are standing in front of a local business looking for hundreds of thousands of promoters, or a friend looking to build an uncapped revenue stream, have them scan this code:</p>
            </td>
          </tr>

          <!-- QR Code - Centered Hero -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:24px;background-color:#ffffff;border:2px solid #e2e8f0;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                    <img src="${qrCodeUrl}" alt="Your Unique Tracking QR Code" width="200" height="200" style="display:block;border:0;outline:none;">
                    <p style="margin:16px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;">Scan to join via your referral</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tracking Explanation -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">The exact second they scan this and join the waitlist, our system <strong style="color:#1e293b;">securely ties their profile to your account</strong>. Every time that business uses Bungee or that user completes a campaign, you unlock a powerful <strong style="color:#FF8C00;">residual income stream for the next 18 months</strong>.</p>
            </td>
          </tr>

          <!-- Backup Link Box -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:16px 20px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                    <p style="margin:0 0 6px 0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Backup Invite Link</p>
                    <p style="margin:0;font-size:14px;color:#1e293b;font-family:monospace;word-break:break-all;">${referralLink}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color:#FF8C00;border-radius:10px;box-shadow:0 4px 14px rgba(255,140,0,0.3);">
                    <a href="${referralLink}" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Start Sharing Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.5;">See you at launch,</p>
              <p style="margin:4px 0 0 0;font-size:15px;color:#FF8C00;font-weight:600;">Maika & The Bungee Team</p>
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding-bottom:24px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;line-height:1.5;">
                You received this email because you or a friend joined the Bungee waitlist.
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                JustBungee.com | St. Augustine, FL
              </p>
              <p style="margin:8px 0 0 0;font-size:11px;color:#cbd5e1;">
                To unsubscribe, reply with "unsubscribe" in the subject line.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    if (error) {
      console.error("[v0] Resend API error:", JSON.stringify(error))
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("[v0] Email send error:", err)
    return { success: false, error: "Failed to send email" }
  }
}
