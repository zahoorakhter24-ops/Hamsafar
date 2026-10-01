import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from '@/data/profiles';

export interface CloudChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  hasSafetyWarning: boolean;
  warningType?: string;
  read: boolean;
  createdAt: string;
}

export interface ConversationSummary {
  partner: UserProfile;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// Send real message in Supabase and trigger notification for receiver
export const sendCloudMessage = async (
  sender: UserProfile,
  receiver: UserProfile,
  content: string,
  warningType?: string
): Promise<CloudChatMessage | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const isSenderUuid = !sender.id.startsWith('user-');
    const isReceiverUuid = !receiver.id.startsWith('user-');

    // 1. Insert message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: isSenderUuid ? sender.id : null,
          receiver_id: isReceiverUuid ? receiver.id : null,
          content,
          has_safety_warning: Boolean(warningType),
          warning_type: warningType || null,
          read: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Send message error:', error);
      return null;
    }

    // 2. Insert notification for receiver
    const preview = content.length > 50 ? content.slice(0, 50) + '...' : content;
    await supabase.from('notifications').insert([
      {
        user_id: isReceiverUuid ? receiver.id : null,
        sender_name: sender.name,
        sender_avatar: sender.avatar,
        type: 'chat_message',
        title: 'Naya Paigham (New Message) 💬',
        message: `${sender.name}: "${preview}"`,
        read: false,
      },
    ]);

    return {
      id: data.id,
      senderId: data.sender_id || sender.id,
      receiverId: data.receiver_id || receiver.id,
      content: data.content,
      hasSafetyWarning: data.has_safety_warning,
      warningType: data.warning_type,
      read: data.read,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Failed to send message:', err);
    return null;
  }
};

// Fetch real-time chat messages between two users
export const fetchCloudMessagesBetween = async (
  user1Id: string,
  user2Id: string
): Promise<CloudChatMessage[]> => {
  if (!isSupabaseConfigured() || !user1Id || !user2Id) return [];

  try {
    const isU1 = !user1Id.startsWith('user-');
    const isU2 = !user2Id.startsWith('user-');

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (isU1 && isU2) {
      query = query.or(
        `and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`
      );
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      content: m.content,
      hasSafetyWarning: m.has_safety_warning,
      warningType: m.warning_type,
      read: m.read,
      createdAt: m.created_at,
    }));
  } catch (err) {
    return [];
  }
};

// Fetch active conversation partners (Accepted connection requests + messages)
export const fetchActiveConversations = async (
  currentUserId: string,
  allProfiles: UserProfile[]
): Promise<ConversationSummary[]> => {
  if (!isSupabaseConfigured() || !currentUserId) return [];

  try {
    const isUuid = !currentUserId.startsWith('user-');
    const partnerIds = new Set<string>();

    // 1. Get accepted connection requests where currentUser is either sender or receiver
    let reqQuery = supabase
      .from('connection_requests')
      .select('*')
      .eq('status', 'accepted');

    if (isUuid) {
      reqQuery = reqQuery.or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
    }

    const { data: reqs } = await reqQuery;
    if (reqs) {
      reqs.forEach((r: any) => {
        if (r.sender_id && r.sender_id !== currentUserId) partnerIds.add(r.sender_id);
        if (r.receiver_id && r.receiver_id !== currentUserId) partnerIds.add(r.receiver_id);
      });
    }

    // 2. Also check any messages exchanged
    let msgQuery = supabase.from('messages').select('sender_id, receiver_id, content, created_at');
    if (isUuid) {
      msgQuery = msgQuery.or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
    }
    const { data: msgs } = await msgQuery;
    if (msgs) {
      msgs.forEach((m: any) => {
        if (m.sender_id && m.sender_id !== currentUserId) partnerIds.add(m.sender_id);
        if (m.receiver_id && m.receiver_id !== currentUserId) partnerIds.add(m.receiver_id);
      });
    }

    // Map partner IDs to profiles
    const summaries: ConversationSummary[] = [];
    for (const pid of partnerIds) {
      const partner = allProfiles.find((p) => p.id === pid);
      if (partner) {
        summaries.push({
          partner,
          unreadCount: 0,
        });
      }
    }

    return summaries;
  } catch (err) {
    return [];
  }
};

// Mark messages from a partner as read
export const markMessagesAsRead = async (senderId: string, receiverId: string) => {
  if (!isSupabaseConfigured()) return;
  try {
    if (!senderId.startsWith('user-') && !receiverId.startsWith('user-')) {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId);
    }
  } catch (e) {}
};
