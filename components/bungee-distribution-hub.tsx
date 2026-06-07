"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Link, FileCheck, Users, Check, Share2, Globe, FileText, ArrowUpRight, Loader2, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  details: string;
  selected: boolean;
  type: 'email' | 'sms';
}

interface CampaignMeta {
  companyWebsite: string;
  assetAttachmentName: string;
  referralLink: string;
  bountyReward: string;
  jobTitle?: string;
  businessEmail?: string;
}

interface BungeeDistributionHubProps {
  isOpen: boolean;
  onClose: () => void;
  campaignMeta?: CampaignMeta;
}

export default function BungeeDistributionHub({ isOpen, onClose, campaignMeta: propsCampaignMeta }: BungeeDistributionHubProps) {
  const [distributionMode, setDistributionMode] = useState<'email' | 'sms'>('email');
  const [isProcessingLaunch, setIsProcessingLaunch] = useState(false);
  const [launchComplete, setLaunchComplete] = useState(false);
  
  // Embedded verification payload parameters passed down from the Upstream wizards
  const campaignMeta = propsCampaignMeta || {
    companyWebsite: 'www.example.com',
    assetAttachmentName: 'bungee_onboarding_packet.pdf',
    referralLink: 'https://justbungee.com/ref/share-job',
    bountyReward: '1,500.00',
    jobTitle: 'Open Position',
    businessEmail: 'hr@company.com'
  };

  // Interactive address book
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Alex Smith', details: 'alex.smith@networktalent.io', selected: true, type: 'email' },
    { id: 'c2', name: 'Sarah Jenkins', details: 's.jenkins@vanceops.org', selected: true, type: 'email' },
    { id: 'c3', name: 'David Miller', details: 'david.miller@techrecruits.net', selected: false, type: 'email' },
    { id: 'c4', name: 'Jim Halpert', details: '(570) 555-0192', selected: true, type: 'sms' },
    { id: 'c5', name: 'Kelly Kapoor', details: '(570) 555-0144', selected: false, type: 'sms' }
  ]);

  const activeChannelContacts = contacts.filter(c => c.type === distributionMode);
  const selectedCount = activeChannelContacts.filter(c => c.selected).length;

  const toggleContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleLaunchBlast = async () => {
    setIsProcessingLaunch(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessingLaunch(false);
    setLaunchComplete(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-2">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="size-5 text-fuchsia-500" />
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Bungee Distribution Hub</CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Blast your bounty to your network. Select contacts to receive the job details, PDF, and referral link.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Campaign Summary */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/20 dark:to-purple-900/20 border border-fuchsia-200 dark:border-fuchsia-800">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Campaign Payload</h4>
            <div className="space-y-1.5 text-sm">
              {campaignMeta.jobTitle && (
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-fuchsia-500" />
                  <span className="text-gray-700 dark:text-gray-300">Job: <strong>{campaignMeta.jobTitle}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-fuchsia-500" />
                <span className="text-gray-700 dark:text-gray-300">{campaignMeta.companyWebsite}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="size-4 text-fuchsia-500" />
                <span className="text-gray-700 dark:text-gray-300">{campaignMeta.assetAttachmentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link className="size-4 text-fuchsia-500" />
                <span className="text-gray-700 dark:text-gray-300 text-xs truncate">{campaignMeta.referralLink}</span>
              </div>
              {campaignMeta.businessEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-fuchsia-500" />
                  <span className="text-gray-700 dark:text-gray-300">{campaignMeta.businessEmail}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300">
                  ${campaignMeta.bountyReward} Bounty
                </Badge>
              </div>
            </div>
          </div>

          {/* Distribution Channel Toggle */}
          <Tabs value={distributionMode} onValueChange={(v) => setDistributionMode(v as 'email' | 'sms')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="email" className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <Mail className="size-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                <MessageSquare className="size-4" />
                SMS
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Contact List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Users className="size-4" />
                {distributionMode === 'email' ? 'Email Contacts' : 'SMS Contacts'}
              </h4>
              <Badge variant="outline" className="text-xs">
                {selectedCount} selected
              </Badge>
            </div>
            
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {activeChannelContacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    contact.selected 
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-300 dark:border-fuchsia-700' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      contact.selected 
                        ? 'bg-fuchsia-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.details}</p>
                    </div>
                  </div>
                  <Switch checked={contact.selected} />
                </div>
              ))}
            </div>
          </div>

          {/* Add Contact Button */}
          <Button variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-fuchsia-400 hover:text-fuchsia-600">
            + Add New Contact
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          {launchComplete ? (
            <div className="w-full text-center py-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <Check className="size-6 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Blast Sent Successfully!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedCount} {distributionMode === 'email' ? 'emails' : 'SMS messages'} sent to your network.
              </p>
              <Button onClick={onClose} className="mt-4 bg-gray-900 hover:bg-gray-800 text-white">
                Close
              </Button>
            </div>
          ) : (
            <>
              <Button 
                onClick={handleLaunchBlast}
                disabled={isProcessingLaunch || selectedCount === 0}
                className="w-full h-11 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold"
              >
                {isProcessingLaunch ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Sending Blast...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="size-4 mr-2" />
                    Send Blast to {selectedCount} {distributionMode === 'email' ? 'Emails' : 'Contacts'}
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full text-gray-600 dark:text-gray-400">
                Skip for Now
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
