import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from '@/data/profiles';

export interface CloudNotification {
  id: string;
  userId: string;
  senderName: string;
  senderAvatar?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CloudConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  sender?: UserProfile;
}

// Send real connection request & notification to another user in Supabase cloud
export const sendCloudConnectionRequest = async (
  sender: UserProfile,
  receiverId: string
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    // 1. Insert connection request into connection_requests table
    const { data: reqData, error: reqErr } = await supabase
      .from('connection_requests')
      .insert([
        {
          sender_id: sender.id.startsWith('user-') ? null : sender.id,
          receiver_id: receiverId.startsWith('user-') ? null : receiverId,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (reqErr) {
      console.warn('Connection request insert note:', reqErr.message);
    }

    // 2. Insert real notification for the recipient
    const { error: notifErr } = await supabase.from('notifications').insert([
      {
        user_id: receiverId.startsWith('user-') ? null : receiverId,
        sender_name: sender.name,
        sender_avatar: sender.avatar,
        type: 'connection_request',
        title: 'Nayi Connection Request 💍',
        message: `${sender.name} (${sender.age} saal, ${sender.city}) ne aapko serious connection request bheji hai.`,
        read: false,
      },
    ]);

    if (notifErr) {
      console.warn('Notification insert note:', notifErr.message);
    }

    return true;
  } catch (err) {
    console.error('Failed to send cloud connection request:', err);
    return false;
  }
};

// Fetch real notifications for the logged in user from Supabase
export const fetchCloudNotifications = async (userId: string): Promise<CloudNotification[]> => {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const isUuid = !userId.startsWith('user-');
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

    if (isUuid) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      senderName: n.sender_name,
      senderAvatar: n.sender_avatar,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read ?? false,
      createdAt: n.created_at,
    }));
  } catch (err) {
    return [];
  }
};

// Fetch pending connection requests for the logged in user
export const fetchCloudConnectionRequests = async (
  userId: string,
  allProfiles: UserProfile[]
): Promise<CloudConnectionRequest[]> => {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const isUuid = !userId.startsWith('user-');
    let query = supabase
      .from('connection_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (isUuid) {
      query = query.eq('receiver_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r: any) => {
      const senderProfile = allProfiles.find((p) => p.id === r.sender_id);
      return {
        id: r.id,
        senderId: r.sender_id,
        receiverId: r.receiver_id,
        status: r.status,
        createdAt: r.created_at,
        sender: senderProfile,
      };
    });
  } catch (err) {
    return [];
  }
};

// Accept or decline connection request in cloud
export const updateCloudConnectionRequestStatus = async (
  requestId: string,
  newStatus: 'accepted' | 'declined',
  acceptorProfile?: UserProfile
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !requestId) return false;

  try {
    const { data: req, error } = await supabase
      .from('connection_requests')
      .update({ status: newStatus })
      .eq('id', requestId)
      .select()
      .single();

    if (error) return false;

    // If accepted, notify the original sender so both devices are alerted!
    if (newStatus === 'accepted' && req && req.sender_id) {
      const senderName = acceptorProfile?.name || 'Aapke partner';
      const senderAvatar = acceptorProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400';
      await supabase.from('notifications').insert([
        {
          user_id: req.sender_id,
          sender_name: senderName,
          sender_avatar: senderAvatar,
          type: 'connection_accepted',
          title: 'Request Accept Ho Gayi! 🤝',
          message: `${senderName} ne aapki connection request accept kar li hai. Inbox mein ba-asaani chat karein!`,
          read: false,
        },
      ]);
    }

    return true;
  } catch (err) {
    return false;
  }
};

// Delete notification from Supabase
export const deleteCloudNotification = async (notificationId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !notificationId) return false;
  try {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
    return !error;
  } catch (err) {
    return false;
  }
};

// Mark single notification as read in Supabase
export const markCloudNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !notificationId) return false;
  try {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    return !error;
  } catch (err) {
    return false;
  }
};

// Mark all notifications for a user as read
export const markAllCloudNotificationsAsRead = async (userId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !userId) return false;
  try {
    const isUuid = !userId.startsWith('user-');
    if (isUuid) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
    }
    return true;
  } catch (err) {
    return false;
  }
};

// Clean up / remove connection request notifications for this partner once accepted or declined
export const deleteCloudNotificationsForSender = async (
  receiverId: string,
  senderName: string
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !receiverId) return false;
  try {
    const isUuid = !receiverId.startsWith('user-');
    if (isUuid) {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', receiverId)
        .eq('sender_name', senderName);
    }
    return true;
  } catch (err) {
    return false;
  }
};
