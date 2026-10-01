export interface AppNotification {
  id: string;
  recipientId: string;
  senderName: string;
  senderAvatar: string;
  type: 'connection_request' | 'connection_accepted' | 'safety_alert' | 'rep_message' | 'mehram_activity' | 'chat_message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientId: 'me',
    senderName: 'Dr. Fatima Noor',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    type: 'connection_request',
    title: 'Nayi Connection Request',
    message: 'Dr. Fatima Noor ne aapko Serious Rishta ke liye connect request bheji hai.',
    timestamp: '5 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    recipientId: 'me',
    senderName: 'Representative Ahmed',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    type: 'rep_message',
    title: 'Assigned Safety Representative',
    message: 'Assalam-o-Alaikum, mein aapka safety rep Ahmed hoon. Kisi bhi issue ke liye rabta karein.',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: 'notif-3',
    recipientId: 'me',
    senderName: 'Hamsafar Safety System',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    type: 'safety_alert',
    title: 'Safety Tip: Financial Protection',
    message: 'Online kabhi kisi ko paise, OTP ya bank details na bhejein.',
    timestamp: '1 day ago',
    read: true,
  },
];
