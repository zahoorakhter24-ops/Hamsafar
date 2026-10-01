'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_PROFILES, UserProfile } from '@/data/profiles';
import { INITIAL_NOTIFICATIONS, AppNotification } from '@/data/notifications';
import { ProfileCard } from '@/components/ProfileCard';
import { ProfileModal } from '@/components/ProfileModal';
import { RegisterModal } from '@/components/RegisterModal';
import { ChatModal } from '@/components/ChatModal';
import { RepresentativeDashboard } from '@/components/RepresentativeDashboard';
import { VerificationModal } from '@/components/VerificationModal';
import { MehramModal } from '@/components/MehramModal';
import { ConnectionRequestsModal, ConnectionRequestItem } from '@/components/ConnectionRequestsModal';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { LoginModal } from '@/components/LoginModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { DetailedProfileModal } from '@/components/DetailedProfileModal';
import { InboxModal } from '@/components/InboxModal';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  ShieldCheck,
  Search,
  Filter,
  Users,
  Download,
  CheckCircle,
  Headphones,
  MessageSquare,
  BadgeCheck,
  UserCheck,
  AlertCircle,
  Bell,
  LogIn,
  LogOut,
  ShieldAlert,
  UserPen,
  Sparkles
} from 'lucide-react';

import {
  fetchCloudProfiles,
  insertCloudProfile,
  updateCloudProfile,
  deleteCloudProfile,
  clearCloudDemoProfiles
} from '@/lib/cloudProfiles';

import {
  sendCloudConnectionRequest,
  fetchCloudNotifications,
  fetchCloudConnectionRequests,
  updateCloudConnectionRequestStatus
} from '@/lib/cloudRequests';

export default function Home() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRepDashboard, setShowRepDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showMehramModal, setShowMehramModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showInboxModal, setShowInboxModal] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [browserPushAllowed, setBrowserPushAllowed] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Incoming Connection Requests
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestItem[]>([]);

  // Search and filter state
  const [searchCity, setSearchCity] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'rishta' | 'friendship'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Cloud Profiles & Sync
  useEffect(() => {
    // 1. Register Service Worker for Mobile PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW registration skipped', err));
    }

    // 2. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Check browser notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setBrowserPushAllowed(true);
      }
    }

    // 4. Fetch Global Cloud Profiles (Multi-device sync)
    const loadProfiles = async () => {
      const cloudData = await fetchCloudProfiles();
      setProfiles(cloudData);
      localStorage.setItem('hamsafar_profiles', JSON.stringify(cloudData));
    };
    loadProfiles();

    // Polling interval every 4 seconds for live multi-device sync
    const syncInterval = setInterval(async () => {
      const liveData = await fetchCloudProfiles();
      if (liveData && liveData.length > 0) {
        setProfiles(liveData);
      }

      // If user is logged in, sync their real cloud notifications & connection requests!
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('hamsafar_current_user') : null;
      if (userRaw) {
        try {
          const loggedUser: UserProfile = JSON.parse(userRaw);
          if (loggedUser && loggedUser.id) {
            // 1. Fetch real cloud notifications
            const cloudNotifs = await fetchCloudNotifications(loggedUser.id);
            if (cloudNotifs && cloudNotifs.length > 0) {
              setNotifications((prev) => {
                const mapped: AppNotification[] = cloudNotifs.map((cn) => ({
                  id: cn.id,
                  recipientId: 'me',
                  senderName: cn.senderName,
                  senderAvatar: cn.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                  type: (cn.type as any) || 'connection_request',
                  title: cn.title,
                  message: cn.message,
                  timestamp: 'Recently',
                  read: cn.read,
                }));
                const existingIds = new Set(prev.map((p) => p.id));
                const newItems = mapped.filter((m) => !existingIds.has(m.id));
                if (newItems.length > 0) {
                  const first = newItems[0];
                  triggerToast(`🔔 ${first.title}: ${first.message}`);
                  firePushNotification(first.title, first.message);
                  return [...newItems, ...prev];
                }
                return prev;
              });
            }

            // 2. Fetch real cloud connection requests
            const cloudReqs = await fetchCloudConnectionRequests(loggedUser.id, liveData || []);
            if (cloudReqs && cloudReqs.length > 0) {
              setConnectionRequests((prev) => {
                const mapped: ConnectionRequestItem[] = cloudReqs.map((cr) => ({
                  id: cr.id,
                  sender: cr.sender || {
                    id: cr.senderId,
                    name: 'Hamsafar Member',
                    age: 26,
                    gender: 'female',
                    city: 'Pakistan',
                    country: 'Pakistan',
                    profession: 'Professional',
                    education: 'Graduate',
                    languages: ['Urdu'],
                    purpose: ['rishta'],
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
                    about: 'Aapko serious connection request bheji hai.',
                    badges: { mobileVerified: true, identityVerified: false, photoVerified: false, familyVerified: false, noActiveRestrictions: true },
                  },
                  recipientId: 'me',
                  status: cr.status,
                  sentAt: 'Live',
                }));
                return mapped;
              });
            }
          }
        } catch (e) {}
      }
    }, 4000);

    const savedNotifs = localStorage.getItem('hamsafar_notifications');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
    }

    const savedUser = localStorage.getItem('hamsafar_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // Default demo connection request to show the user how it works
    setConnectionRequests([
      {
        id: 'req-demo-1',
        sender: INITIAL_PROFILES[1], // Dr. Fatima Noor
        recipientId: 'me',
        status: 'pending',
        sentAt: '5 mins ago',
      },
    ]);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(syncInterval);
    };
  }, []);

  const saveNotifications = (updated: AppNotification[]) => {
    setNotifications(updated);
    localStorage.setItem('hamsafar_notifications', JSON.stringify(updated));
  };

  const saveProfilesState = (updated: UserProfile[]) => {
    setProfiles(updated);
    localStorage.setItem('hamsafar_profiles', JSON.stringify(updated));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger Real System Push Notification if permission granted
  const firePushNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserPushAllowed(true);
        triggerToast('🔔 Browser Push Notifications Enabled! Ab aapko screen par alerts aayenge.');
        firePushNotification('Hamsafar Notifications Active', 'Aapko nayi requests aur safety alerts screen par milenge.');
      }
    } else {
      alert('Aapka browser desktop/mobile push notifications support nahi karta.');
    }
  };

  // When current user sends a connection request to someone
  const handleConnectRequest = async (profile: UserProfile) => {
    if (!currentUser) {
      triggerToast('Pehle login karein ya naya account banayein taake request bhej sakein.');
      setShowLogin(true);
      return;
    }

    triggerToast(`Safe Connection Request sent to ${profile.name}! Unki device par notification alert bhej diya gaya hai.`);

    // 1. Send to Supabase Cloud for real multi-device sync
    await sendCloudConnectionRequest(currentUser, profile.id);

    // 2. Local confirmation notification for sender
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'me',
      senderName: profile.name,
      senderAvatar: profile.avatar,
      type: 'connection_request',
      title: 'Connection Request Sent 💍',
      message: `Aapne ${profile.name} ko request bheji hai. Unke response aane par foran alert milega.`,
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([newNotif, ...notifications]);
    firePushNotification('Request Sent!', `${profile.name} ko connection request bhej di gayi hai.`);
  };

  // Register New User
  const handleNewUserRegistered = async (formData: any) => {
    const partnerCities = formData.partnerCity
      ? formData.partnerCity.split(',').map((c: string) => c.trim()).filter(Boolean)
      : ['Lahore', 'Islamabad'];

    const dealBreakersList = formData.dealBreakers
      ? formData.dealBreakers.split(',').map((d: string) => d.trim()).filter(Boolean)
      : ['Smoking', 'Dishonesty', 'Bad temper'];

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: formData.fullName,
      age: Number(formData.age) || 25,
      gender: formData.gender,
      dob: formData.dob || undefined,
      mobileNumber: formData.mobileNumber || undefined,
      password: formData.password || undefined,
      city: formData.currentCity || formData.city || 'Lahore',
      country: formData.country || 'Pakistan',
      nativeCity: formData.nativeCity || undefined,
      profession: formData.profession || 'Professional',
      education: formData.educationLevel || formData.education || 'Graduate',
      degreeField: formData.degreeField || undefined,
      institution: formData.institution || undefined,
      jobType: formData.jobType || 'Job',
      incomeRange: formData.incomeRange || '100k - 250k PKR',
      languages: formData.languages || ['Urdu', 'English'],
      purpose: formData.purpose || ['rishta'],
      seriousnessLevel: formData.seriousnessLevel || 'Marriage کے لیے serious',
      avatar: formData.avatar || (formData.gender === 'female'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'),
      additionalPhotos: formData.additionalPhotos || [],
      about: formData.aboutMe || 'Hamsafar verified member seeking genuine, respectful and family-aligned connections.',
      maritalStatus: formData.maritalStatus || 'Never Married',
      hasChildren: Boolean(formData.hasChildren),
      childrenCount: Number(formData.childrenCount) || 0,
      familyType: formData.familyType || 'Nuclear Family',
      parentsStatus: `Father: ${formData.fatherStatus || 'Alive'}, Mother: ${formData.motherStatus || 'Alive'}`,
      brothersCount: Number(formData.brothersCount) || 0,
      sistersCount: Number(formData.sistersCount) || 0,
      livingArrangementPreference: formData.livingArrangementPreference || 'Flexible',
      religiousCommitment: formData.religion || 'Islam (Practicing)',
      requirements: {
        gender: formData.gender === 'male' ? 'female' : 'male',
        ageRange: [Number(formData.partnerAgeMin) || 20, Number(formData.partnerAgeMax) || 30],
        flexibleAge: true,
        preferredCities: partnerCities.length > 0 ? partnerCities : ['Lahore'],
        relocationWillingness: (formData.relocationWillingness as any) || 'Maybe',
        maritalStatusPreference: [formData.partnerMaritalStatus || 'Never Married'],
        childrenPreference: 'Prefer no children',
        minEducation: formData.partnerMinEducation || "Bachelor's",
        preferredFields: ['Any field'],
        preferredProfessions: ['Any respectable profession'],
        financialLifestyle: 'Moderate',
        familyTypePreference: 'No preference',
        livingArrangementAfterMarriage: 'Flexible',
        religiousImportance: 'Important',
        personalityTraits: ['Kind', 'Respectful', 'Family-oriented'],
        lifestylePreferences: ['Balanced'],
        smokingPreference: (formData.smokingPreference as any) || 'Must not smoke',
        careerAfterMarriage: 'Flexible',
        futureChildrenPreference: 'Want children',
        marriageTimeline: 'Within 1 year',
        seriousnessLevel: formData.seriousnessLevel || 'Marriage کے لیے serious',
        friendshipBeforeMarriage: 'Prefer direct serious rishta',
        dealBreakers: dealBreakersList,
        importantQualities: ['Mutual respect', 'Loyalty', 'Good communication'],
        flexibleIn: ['City', 'Cast'],
        mustHaves: ['Religious & Family values', 'Honesty'],
        idealPartnerSummary: formData.idealPartnerSummary || `Talash hai aik mukhlis hamsafar ki jiski umar ${formData.partnerAgeMin || 22}-${formData.partnerAgeMax || 30} saal aur taleem kam az kam ${formData.partnerMinEducation || "Bachelor's"} ho.`,
      },
      verificationStatus: 'unsubmitted',
      badges: {
        mobileVerified: true,
        identityVerified: false,
        photoVerified: Boolean(formData.hasCustomPhoto),
        familyVerified: false,
        noActiveRestrictions: true,
      },
      isDemo: false,
    };

    // Save locally and in Supabase Cloud
    const updated = [newProfile, ...profiles];
    saveProfilesState(updated);
    setCurrentUser(newProfile);
    localStorage.setItem('hamsafar_current_user', JSON.stringify(newProfile));
    
    // Sync to Supabase Cloud
    const saved = await insertCloudProfile(newProfile);
    if (saved && saved.id) {
      newProfile.id = saved.id;
      setCurrentUser(newProfile);
      localStorage.setItem('hamsafar_current_user', JSON.stringify(newProfile));
    }
    const fresh = await fetchCloudProfiles();
    if (fresh && fresh.length > 0) {
      saveProfilesState(fresh);
    }

    triggerToast(`Mubarak ho ${formData.fullName}! Aapka Hamsafar profile mukammal tayyar ho gaya hai.`);

    // Add welcoming notification
    const welcomeNotif: AppNotification = {
      id: `notif-welcome-${Date.now()}`,
      recipientId: 'me',
      senderName: 'Hamsafar Safety Desk',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      type: 'rep_message',
      title: 'Welcome to Hamsafar Platform',
      message: 'Aapka account verify ho chuka hai. Behtar matches ke liye CNIC aur Mehram mode add karein.',
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([welcomeNotif, ...notifications]);
  };

  const handleVerificationSubmitted = async (docData: any) => {
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        verificationStatus: 'pending',
        submittedDocuments: {
          cnicNumber: docData.cnicNumber,
          cnicFrontName: docData.cnicFrontName,
          selfieName: docData.selfieName,
          submittedAt: 'Just now',
        },
        badges: {
          ...currentUser.badges,
          identityVerified: false,
          photoVerified: false,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('hamsafar_current_user', JSON.stringify(updatedUser));
      
      const updatedProfiles = profiles.map((p) => p.id === currentUser.id ? updatedUser : p);
      saveProfilesState(updatedProfiles);

      // Notification for User: Pending Review
      const userNotif: AppNotification = {
        id: `notif-user-pending-${Date.now()}`,
        recipientId: 'me',
        senderName: 'Verification Desk',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        type: 'safety_alert',
        title: 'Documents Submitted (Under Review)',
        message: 'Aapka CNIC & Live Selfie submit ho chuka hai. Admin review ke baad Blue ID Badge activate karega.',
        timestamp: 'Just now',
        read: false,
      };

      // Notification for Admin: New Pending Verification
      const adminNotif: AppNotification = {
        id: `notif-admin-${Date.now()}`,
        recipientId: 'admin',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        type: 'safety_alert',
        title: '⚠️ New Verification Pending Review',
        message: `${currentUser.name} (${currentUser.city}) ne CNIC: ${docData.cnicNumber} submit kiya hai. Admin Portal mein review karein.`,
        timestamp: 'Just now',
        read: false,
      };

      saveNotifications([adminNotif, userNotif, ...notifications]);
      firePushNotification('Documents Under Review', 'Aapka CNIC & Live Selfie Admin review queue mein bhej diya gaya hai.');
      triggerToast('Documents submit ho chuke hain! Admin ke approve karne tak status Pending rahega.');

      // Sync verification submission to cloud
      await updateCloudProfile(currentUser.id, updatedUser);
    }
  };

  const handleMehramInvited = async (data: any) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        badges: {
          ...currentUser.badges,
          familyVerified: true,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('hamsafar_current_user', JSON.stringify(updatedUser));
      
      const updatedProfiles = profiles.map((p) => p.id === currentUser.id ? updatedUser : p);
      saveProfilesState(updatedProfiles);
      await updateCloudProfile(currentUser.id, updatedUser);
    }

    const mNotif: AppNotification = {
      id: `notif-m-${Date.now()}`,
      recipientId: 'me',
      senderName: 'Mehram Guardian Center',
      senderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      type: 'mehram_activity',
      title: 'Family Guardian Linked',
      message: `Aapke ${data.guardianRole} (${data.guardianName}) ko limited access invite bhej diya gaya hai.`,
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([mNotif, ...notifications]);
    triggerToast(`Mehram / Guardian (${data.guardianRole}) invite link generate ho gaya. Gold Badge activate ho chuka hai!`);
  };

  const handleAcceptRequest = async (req: ConnectionRequestItem) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r))
    );

    // Sync cloud status & notify sender across devices
    await updateCloudConnectionRequestStatus(req.id, 'accepted', currentUser || undefined);

    // Notify user that connection is accepted & chat unlocked
    const acceptNotif: AppNotification = {
      id: `notif-acc-${Date.now()}`,
      recipientId: 'me',
      senderName: req.sender.name,
      senderAvatar: req.sender.avatar,
      type: 'connection_accepted',
      title: 'Connection Accepted! 🤝',
      message: `Aap aur ${req.sender.name} ab aapas mein safe chat kar sakte hain.`,
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([acceptNotif, ...notifications]);
    firePushNotification('Connection Accepted!', `${req.sender.name} ke sath aapki chat activate ho gayi hai.`);
    triggerToast(`${req.sender.name} ki request accept kar li gayi hai. Ab aap safe chat kar sakte hain.`);
    setChatPartner(req.sender);
  };

  const handleDeclineRequest = async (req: ConnectionRequestItem) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'declined' } : r))
    );
    await updateCloudConnectionRequestStatus(req.id, 'declined');
    triggerToast('Connection request ba-adab tareeqay se decline kar di gayi.');
  };

  // ADMIN ACTIONS (Syncs with Cloud Database)
  const handleAdminApproveVerification = async (userId: string) => {
    let approvedUserName = '';
    const updated = profiles.map((p) => {
      if (p.id === userId) {
        approvedUserName = p.name;
        return {
          ...p,
          verificationStatus: 'verified' as const,
          badges: {
            ...p.badges,
            identityVerified: true,
            photoVerified: true,
          },
        };
      }
      return p;
    });
    saveProfilesState(updated);

    await updateCloudProfile(userId, {
      verificationStatus: 'verified',
      badges: {
        mobileVerified: true,
        identityVerified: true,
        photoVerified: true,
        familyVerified: false,
        noActiveRestrictions: true,
      },
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        verificationStatus: 'verified' as const,
        badges: {
          ...currentUser.badges,
          identityVerified: true,
          photoVerified: true,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('hamsafar_current_user', JSON.stringify(updatedUser));
    }

    // Send Approval notification to user
    const approveNotif: AppNotification = {
      id: `notif-appr-${Date.now()}`,
      recipientId: userId,
      senderName: 'Verification Officer (Approved)',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      type: 'safety_alert',
      title: 'Official ID Verified! 🔵',
      message: `Mubarak ho! Admin ne aapka CNIC aur live selfie verify kar liya hai. Blue Identity & Purple Photo badges activate ho chukay hain.`,
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([approveNotif, ...notifications]);
    firePushNotification('Identity Verified!', `${approvedUserName} ka account approve ho chuka hai.`);
    triggerToast(`${approvedUserName} ki verification approve ho gayi! Blue Badge lag gaya.`);
  };

  const handleAdminRejectVerification = async (userId: string) => {
    let rejectedUserName = '';
    const updated = profiles.map((p) => {
      if (p.id === userId) {
        rejectedUserName = p.name;
        return {
          ...p,
          verificationStatus: 'rejected' as const,
        };
      }
      return p;
    });
    saveProfilesState(updated);

    await updateCloudProfile(userId, {
      verificationStatus: 'rejected',
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        verificationStatus: 'rejected' as const,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('hamsafar_current_user', JSON.stringify(updatedUser));
    }

    // Send Rejection notification to user
    const rejectNotif: AppNotification = {
      id: `notif-rej-${Date.now()}`,
      recipientId: userId,
      senderName: 'Verification Officer',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      type: 'safety_alert',
      title: 'Verification Resubmission Needed',
      message: 'Aapke CNIC ya selfie ki tasweer wazeh nahi thi. Bara-e-meherbani wazeh tasweer dobara upload karein.',
      timestamp: 'Just now',
      read: false,
    };
    saveNotifications([rejectNotif, ...notifications]);
    triggerToast(`${rejectedUserName} ki verification reject kar di gayi hai.`);
  };

  const handleAdminBanUser = async (userId: string) => {
    const updated = profiles.map((p) => {
      if (p.id === userId) {
        return {
          ...p,
          badges: {
            ...p.badges,
            noActiveRestrictions: false,
          },
        };
      }
      return p;
    });
    saveProfilesState(updated);
    await updateCloudProfile(userId, {
      badges: {
        mobileVerified: true,
        identityVerified: false,
        photoVerified: false,
        familyVerified: false,
        noActiveRestrictions: false,
      },
    });
    triggerToast('User safety restrictions applied.');
  };

  const handleAdminDeleteUser = async (userId: string) => {
    const updated = profiles.filter((p) => p.id !== userId);
    saveProfilesState(updated);
    await deleteCloudProfile(userId);
    triggerToast('User permanently removed from platform.');
  };

  const handleClearDemoData = async () => {
    const onlyRealUsers = profiles.filter((p) => !p.isDemo);
    saveProfilesState(onlyRealUsers);
    await clearCloudDemoProfiles();
    triggerToast('Demo data saaf kar diya gaya hai! Tamam devices par live sync ho gaya.');
  };

  // Mark notification read
  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  // Filter profiles (Exclude current logged-in user so you never see yourself)
  const filteredProfiles = profiles.filter((p) => {
    // 1. Never show your own profile in matching/discovery
    if (currentUser && (p.id === currentUser.id || p.name === currentUser.name)) {
      return false;
    }
    if (searchCity && !p.city.toLowerCase().includes(searchCity.toLowerCase())) {
      return false;
    }
    if (purposeFilter !== 'all' && !p.purpose.includes(purposeFilter)) {
      return false;
    }
    if (verifiedOnly && !p.badges.identityVerified) {
      return false;
    }
    return true;
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const pendingRequestsCount = connectionRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation - Luxury Dark Glassmorphism */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20 text-white shadow-xl shadow-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/30">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  Hamsafar <Sparkles size={14} className="text-amber-400 animate-pulse" />
                </span>
                <span className="text-sm font-bold text-amber-400 font-serif">
                  (ہمسفر)
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium hidden sm:block">
                رابطے جو اعتماد سے بنیں • Trusted Matrimonial & Halal Rishta
              </p>
            </div>
          </div>

          {/* User Status / Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 relative">
            
            {/* NOTIFICATION BELL BUTTON */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);
                  setShowRequestsModal(false);
                }}
                className={`p-2 rounded-xl border transition-all ${
                  showNotificationDropdown
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
                }`}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* In-app Notification Dropdown */}
              <NotificationDropdown
                isOpen={showNotificationDropdown}
                onClose={() => setShowNotificationDropdown(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onRequestClick={() => {
                  setShowNotificationDropdown(false);
                  setShowRequestsModal(true);
                }}
                onOpenInbox={() => {
                  setShowNotificationDropdown(false);
                  setShowInboxModal(true);
                }}
                onRequestBrowserPermission={requestBrowserPermission}
                browserPermissionGranted={browserPushAllowed}
              />
            </div>

            {/* Connection Requests notification button */}
            <button
              onClick={() => {
                setShowRequestsModal(true);
                setShowNotificationDropdown(false);
                setShowInboxModal(false);
              }}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
              title="Connection Requests"
            >
              <UserCheck size={18} />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Inbox / Messages Button */}
            <button
              onClick={() => {
                setShowInboxModal(true);
                setShowNotificationDropdown(false);
                setShowRequestsModal(false);
              }}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
              title="Inbox & Paighamat"
            >
              <MessageSquare size={18} className="text-teal-400" />
              <span className="hidden xl:inline text-xs font-bold text-slate-200">Inbox</span>
              {notifications.some((n) => n.type === 'chat_message' && !n.read) && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {notifications.filter((n) => n.type === 'chat_message' && !n.read).length}
                </span>
              )}
            </button>

            {/* Mehram Mode Button */}
            <button
              onClick={() => setShowMehramModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 transition-all shadow-xs"
            >
              <Users size={14} className="text-amber-400" />
              <span>Mehram Mode</span>
            </button>

            {/* Official ID Verification Button */}
            <button
              onClick={() => setShowVerifyModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 transition-all shadow-xs"
            >
              <BadgeCheck size={14} className="text-blue-400" />
              <span>Verify CNIC</span>
            </button>

            {/* Representative Console */}
            <button
              onClick={() => setShowRepDashboard(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
            >
              <Headphones size={13} className="text-emerald-400" />
              <span>Rep</span>
            </button>

            {/* Install / Download App CTA */}
            <button
              onClick={async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    setDeferredPrompt(null);
                    triggerToast('Mubarak ho! Hamsafar App aapke phone par install ho rahi hai.');
                  }
                } else {
                  triggerToast('App install karne ke liye Chrome menu (3 dots) par "Install app" tap karein.');
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 transition-all shadow-xs"
            >
              <Download size={13} className="text-emerald-400" />
              <span className="hidden lg:inline">Install App</span>
              <span className="lg:hidden text-[11px]">Install</span>
            </button>

            {/* Join / Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                <button
                  onClick={() => setShowDetailedProfile(true)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-colors border border-emerald-500/30 bg-emerald-950/40"
                  title="Edit My Profile & Partner Requirements"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
                  />
                  <span className="text-xs font-bold text-white hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <UserPen size={13} className="text-amber-400 hidden sm:inline" />
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('hamsafar_current_user');
                    triggerToast('Aapka account logout ho gaya hai.');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20 border border-amber-300"
                >
                  Join Free
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Hero Section - Luxury Emerald Ambient Glow */}
      <section className="bg-gradient-to-b from-slate-950 via-[#07241e] to-slate-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b border-emerald-500/15">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-lg">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Pakistan&apos;s Trusted Halal Rishta & Matrimonial Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            رابطے جو اعتماد اور وقار سے بنیں
            <span className="block text-xl sm:text-2xl font-light text-slate-300 mt-2 font-sans">
              Verified Connections • Mehram Guardianship • Zero Fake Profiles
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Hamsafar is designed for serious families and sincere individuals seeking life partners with dignity, mutual respect, and real identity verification.
          </p>

          {/* Quick Action Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowNotificationDropdown(true)}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Bell size={14} className="text-emerald-400" />
              Notifications ({unreadNotificationsCount} Unread)
            </button>
            <button
              onClick={() => setShowRequestsModal(true)}
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <UserCheck size={14} className="text-rose-400" />
              Requests ({pendingRequestsCount} Pending)
            </button>
          </div>
        </div>
      </section>

      {/* Discovery & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* City Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by city (e.g. Lahore)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Purpose Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPurposeFilter('all')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                purposeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setPurposeFilter('rishta')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                purposeFilter === 'rishta'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💍 Rishta
            </button>
            <button
              onClick={() => setPurposeFilter('friendship')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                purposeFilter === 'friendship'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🤝 Friendship
            </button>
          </div>

          {/* Verified Only & Demo Chat */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Verified Members Only
              </span>
            </label>

            {/* Test Chat demo button */}
            <button
              onClick={() => setChatPartner(profiles[0] || INITIAL_PROFILES[0])}
              className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
              title="Open test chat to test live anti-scam AI warnings"
            >
              <MessageSquare size={14} />
              <span>Test Chat Live</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Profiles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Verified Profiles Available ({filteredProfiles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Connect button dabane par samne walay ko instant notification jayega.
            </p>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Notifications Center Synced
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <AlertCircle size={36} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-slate-800 text-base">No matches found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your city filter or purpose option to see more verified members.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onRequestConnect={handleConnectRequest}
                onViewDetails={(p) => setSelectedProfile(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer / Safety Highlights */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-600">
          <div>
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="text-emerald-600" size={18} />
              Hamsafar Safety Center
            </div>
            <p className="leading-relaxed">
              Never send money, OTPs, or financial details to anyone online. Official Hamsafar representatives never ask for your account password.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-sm">Official Verification Policy</h4>
            <p className="leading-relaxed">
              Verification confirms the factual government-issued documents checked by Hamsafar. It does not guarantee a person's future intentions or conduct.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-sm">Offline Meeting Safety</h4>
            <p className="leading-relaxed">
              If meeting in person, always choose a public venue in daylight, inform your family or trusted contact, and arrange your own transport.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span>© 2026 Hamsafar (ہمسفر) Platform. All rights reserved.</span>
            <button
              onClick={() => setShowAdminDashboard(true)}
              className="text-slate-400 hover:text-slate-600 underline text-[11px] flex items-center gap-1 font-mono transition-colors"
            >
              <ShieldAlert size={12} />
              <span>Admin Access</span>
            </button>
          </div>
          <span className="font-medium text-slate-500">Strictly 18+ Adults Only Platform</span>
        </div>
      </footer>

      {/* Modals Workflow */}
      <ProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onConnect={handleConnectRequest}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleNewUserRegistered}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('hamsafar_current_user', JSON.stringify(user));
          triggerToast(`Welcome back, ${user.name}!`);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      {currentUser && (
        <DetailedProfileModal
          isOpen={showDetailedProfile}
          onClose={() => setShowDetailedProfile(false)}
          currentUser={currentUser}
          onSaveProfile={async (updated) => {
            setCurrentUser(updated);
            localStorage.setItem('hamsafar_current_user', JSON.stringify(updated));
            const updatedList = profiles.map(p => p.id === updated.id ? updated : p);
            saveProfilesState(updatedList);
            await updateCloudProfile(updated.id, updated);
            triggerToast('Profile & Partner Requirements kamyabi se save ho gayi hain!');
          }}
        />
      )}

      <ChatModal
        partner={chatPartner}
        currentUser={currentUser}
        onClose={() => setChatPartner(null)}
      />

      <InboxModal
        isOpen={showInboxModal}
        onClose={() => setShowInboxModal(false)}
        currentUser={currentUser}
        allProfiles={profiles}
        onOpenChatWith={(partner) => {
          setShowInboxModal(false);
          setChatPartner(partner);
        }}
        onOpenRequests={() => {
          setShowInboxModal(false);
          setShowRequestsModal(true);
        }}
      />

      {showRepDashboard && (
        <RepresentativeDashboard
          onClose={() => setShowRepDashboard(false)}
        />
      )}

      <AdminDashboardModal
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        profiles={profiles}
        onApproveVerification={handleAdminApproveVerification}
        onRejectVerification={handleAdminRejectVerification}
        onBanUser={handleAdminBanUser}
        onDeleteUser={handleAdminDeleteUser}
        onClearDemoData={handleClearDemoData}
      />

      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerificationSubmitted={handleVerificationSubmitted}
      />

      <MehramModal
        isOpen={showMehramModal}
        onClose={() => setShowMehramModal(false)}
        onSuccess={handleMehramInvited}
      />

      <ConnectionRequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        requests={connectionRequests}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        onStartChat={(partner) => setChatPartner(partner)}
      />

    </div>
  );
}
