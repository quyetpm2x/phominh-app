// Preview content from Figma, pending the referral service.
export const INVITE_PREVIEW = {
  code: 'QUYET842',
  invited: 6,
  earned: '120.000',
  referralUrl: null as string | null,
};
export const INVITE_CHANNELS = [
  { id: 'zalo', label: 'Zalo', icon: 'inviteZalo', color: '#0068FF', size: 20 },
  { id: 'messenger', label: 'Messenger', icon: 'inviteMessenger', color: '#0084FF', size: 24 },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'inviteWhatsapp', color: '#25D366', size: 24 },
  { id: 'link', label: 'Link', icon: 'inviteLink', color: '#FFFFFF', size: 20 },
] as const;
