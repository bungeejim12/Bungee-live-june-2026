/**
 * Bungee Daisy Chain SMS Payload Generator
 * 
 * Generates dynamic, high-converting text payloads for SMS and Web Share API
 * that automatically alert every recipient of the cash reward opportunity.
 * 
 * Works for ALL categories: Hiring, Services, and Products
 */

export type CampaignType = 'hiring' | 'service' | 'product';

export interface DaisyChainPayload {
  // Campaign details
  businessName: string;
  title: string; // Job title, service name, or product name
  bountyAmount: string | number;
  campaignType: CampaignType;
  campaignId: string;
  
  // Chain tracking (optional - for pass-through referrers)
  originatorId?: string;
  referrerId?: string;
  currentUserId?: string;
}

/**
 * Generate the dynamic tracking URL with chain parameters
 */
export function generateTrackingUrl(payload: DaisyChainPayload): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://justbungee.com';
  
  const url = new URL(`/refer/${payload.campaignId}`, baseUrl);
  
  // Add chain tracking parameters
  if (payload.originatorId) {
    url.searchParams.set('originator', payload.originatorId);
  } else if (payload.currentUserId) {
    // This user is the originator (first in chain)
    url.searchParams.set('originator', payload.currentUserId);
  }
  
  if (payload.currentUserId) {
    url.searchParams.set('referrer', payload.currentUserId);
  }
  
  return url.toString();
}

/**
 * Get the action verb based on campaign type
 */
function getActionVerb(type: CampaignType): string {
  switch (type) {
    case 'hiring':
      return 'accepts the position';
    case 'service':
      return 'books the service';
    case 'product':
      return 'makes a purchase';
    default:
      return 'converts';
  }
}

/**
 * Get the position/offer label based on campaign type
 */
function getOfferLabel(type: CampaignType): string {
  switch (type) {
    case 'hiring':
      return 'an open position for a';
    case 'service':
      return 'a service offer for';
    case 'product':
      return 'a product deal on';
    default:
      return 'an opportunity for';
  }
}

/**
 * Generate the high-converting daisy chain SMS text payload
 * 
 * Template: "Hey! [Business Name] has [offer label] [Title] with a $[Bounty Amount] Cash Reward. 
 * I thought of you! If you aren't a fit but know someone who is, forward your custom link below. 
 * You will automatically receive a Cash Referral Fee or a Network Placement Override the moment 
 * your contact [action verb]! Check out the details here: [Dynamic Tracking URL]"
 */
export function generateSmsPayload(payload: DaisyChainPayload): string {
  const trackingUrl = generateTrackingUrl(payload);
  const offerLabel = getOfferLabel(payload.campaignType);
  const actionVerb = getActionVerb(payload.campaignType);
  const bountyFormatted = typeof payload.bountyAmount === 'number' 
    ? payload.bountyAmount.toLocaleString() 
    : payload.bountyAmount.replace(/[$,]/g, '');
  
  return `Hey! ${payload.businessName} has ${offerLabel} ${payload.title} with a $${bountyFormatted} Cash Reward. I thought of you! If you aren't a fit but know someone who is, forward your custom link below. You will automatically receive a Cash Referral Fee or a Network Placement Override the moment your contact ${actionVerb}! Check out the details here: ${trackingUrl}`;
}

/**
 * Generate email subject line for the campaign
 */
export function generateEmailSubject(payload: DaisyChainPayload): string {
  const bountyFormatted = typeof payload.bountyAmount === 'number' 
    ? payload.bountyAmount.toLocaleString() 
    : payload.bountyAmount;
  
  switch (payload.campaignType) {
    case 'hiring':
      return `Earn $${bountyFormatted} - Know someone perfect for ${payload.title}?`;
    case 'service':
      return `Earn $${bountyFormatted} - Refer someone to ${payload.businessName}`;
    case 'product':
      return `Earn $${bountyFormatted} - Share ${payload.title} with your network`;
    default:
      return `Earn $${bountyFormatted} Cash Reward - ${payload.title}`;
  }
}

/**
 * Generate the SMS protocol URL (sms:?body=...)
 */
export function generateSmsProtocolUrl(payload: DaisyChainPayload): string {
  const smsBody = generateSmsPayload(payload);
  return `sms:?body=${encodeURIComponent(smsBody)}`;
}

/**
 * Generate mailto URL with pre-filled subject and body
 */
export function generateMailtoUrl(payload: DaisyChainPayload): string {
  const subject = generateEmailSubject(payload);
  const body = generateSmsPayload(payload);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Trigger native Web Share API with proper fallbacks
 * Returns true if share was successful, false otherwise
 */
export async function triggerNativeShare(payload: DaisyChainPayload): Promise<boolean> {
  const title = generateEmailSubject(payload);
  const text = generateSmsPayload(payload);
  const url = generateTrackingUrl(payload);
  
  // Try Web Share API first
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      // User cancelled or API not fully supported
      if ((err as Error).name === 'AbortError') {
        return false; // User cancelled - don't fallback
      }
      // Fall through to SMS fallback
    }
  }
  
  // Fallback: Open SMS with pre-filled body
  if (typeof window !== 'undefined') {
    const smsUrl = generateSmsProtocolUrl(payload);
    window.location.href = smsUrl;
    return true;
  }
  
  return false;
}

/**
 * Copy referral text to clipboard with fallback
 */
export async function copyToClipboard(payload: DaisyChainPayload): Promise<boolean> {
  const text = generateSmsPayload(payload);
  
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback for older browsers
    if (typeof window !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }
  
  return false;
}
