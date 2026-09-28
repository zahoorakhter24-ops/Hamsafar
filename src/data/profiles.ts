export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  country: string;
  profession: string;
  education: string;
  languages: string[];
  purpose: ('rishta' | 'friendship')[];
  avatar: string;
  about: string;
  // Verification Badges
  badges: {
    mobileVerified: boolean;
    identityVerified: boolean;
    photoVerified: boolean;
    familyVerified: boolean;
    noActiveRestrictions: boolean;
  };
  // Rishta Specific
  maritalStatus?: string;
  religiousCommitment?: string;
  familyInvolvementPreference?: 'Required' | 'Preferred' | 'Later';
  preferredAgeRange?: [number, number];
  preferredCity?: string;
  // Friendship Specific
  interests?: string[];
  hobbies?: string[];
  // Safety flags
  isDemo?: boolean;
}

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Syed Hamza Ali',
    age: 28,
    gender: 'male',
    city: 'Lahore',
    country: 'Pakistan',
    profession: 'Senior Software Engineer',
    education: 'MS Computer Science (FAST-NUCES)',
    languages: ['Urdu', 'English', 'Punjabi'],
    purpose: ['rishta'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    about: 'Sincere, family-oriented individual looking for a life partner with mutual respect, shared values, and a positive mindset toward life.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    maritalStatus: 'Single / Never Married',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Preferred',
    preferredAgeRange: [23, 27],
    preferredCity: 'Lahore, Islamabad',
    interests: ['Tech Innovation', 'Literature', 'Travel', 'Badminton'],
    isDemo: true,
  },
  {
    id: 'user-2',
    name: 'Dr. Fatima Noor',
    age: 26,
    gender: 'female',
    city: 'Islamabad',
    country: 'Pakistan',
    profession: 'Medical Doctor (MBBS)',
    education: 'MBBS (Shifa College of Medicine)',
    languages: ['Urdu', 'English'],
    purpose: ['rishta'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    about: 'Compassionate healthcare professional. Values honesty, simple lifestyle, and strong family ties. Looking for a well-educated partner with good moral character.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    maritalStatus: 'Single / Never Married',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Required',
    preferredAgeRange: [27, 32],
    preferredCity: 'Islamabad, Rawalpindi, Lahore',
    interests: ['Healthcare', 'Reading', 'Volunteering', 'Gardening'],
    isDemo: true,
  },
  {
    id: 'user-3',
    name: 'Zainab Tariq',
    age: 24,
    gender: 'female',
    city: 'Karachi',
    country: 'Pakistan',
    profession: 'UX Designer & Visual Artist',
    education: 'Bachelors in Communication Design (IVS)',
    languages: ['Urdu', 'English', 'Sindhi'],
    purpose: ['friendship', 'rishta'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    about: 'Creative thinker looking for verified, meaningful friendships and potential serious life partners. Big on respectful conversations and art galleries.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: false,
      familyVerified: false,
      noActiveRestrictions: true,
    },
    maritalStatus: 'Single',
    religiousCommitment: 'Moderate',
    familyInvolvementPreference: 'Later',
    preferredAgeRange: [25, 30],
    preferredCity: 'Karachi, Islamabad',
    interests: ['Design', 'Coffee Culture', 'Art & Exhibitions', 'Photography'],
    hobbies: ['Painting', 'Podcasts', 'Book Clubs'],
    isDemo: true,
  },
  {
    id: 'user-4',
    name: 'Bilal Farooq',
    age: 31,
    gender: 'male',
    city: 'Faisalabad',
    country: 'Pakistan',
    profession: 'Chartered Accountant (FCA)',
    education: 'CA (ICAP Pakistan)',
    languages: ['Urdu', 'English', 'Punjabi'],
    purpose: ['rishta'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    about: 'Decent, grounded professional. Looking to settle down with someone who appreciates simplicity, family balance, and mutual kindness.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    maritalStatus: 'Single',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Required',
    preferredAgeRange: [24, 28],
    preferredCity: 'Faisalabad, Lahore',
    interests: ['Economics', 'Cricket', 'Historical Documentaries'],
    isDemo: true,
  },
  {
    id: 'user-5',
    name: 'Ayesha Mehmood',
    age: 23,
    gender: 'female',
    city: 'Rawalpindi',
    country: 'Pakistan',
    profession: 'Content Creator & Educator',
    education: 'BS English Literature (Kinnaird)',
    languages: ['Urdu', 'English'],
    purpose: ['friendship'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    about: 'Looking to connect with verified like-minded women and intellectual peers for study sessions, book exchanges, and respectful discussions.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: false,
      noActiveRestrictions: true,
    },
    interests: ['Literature', 'Academic Research', 'Poetry', 'Blogging'],
    hobbies: ['Creative Writing', 'Calligraphy'],
    isDemo: true,
  },
  {
    id: 'user-6',
    name: 'Usman Ghani',
    age: 29,
    gender: 'male',
    city: 'Peshawar',
    country: 'Pakistan',
    profession: 'Civil Engineer & Contractor',
    education: 'BSc Civil Engineering (UET Peshawar)',
    languages: ['Urdu', 'Pashto', 'English'],
    purpose: ['rishta'],
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    about: 'Down-to-earth person who believes in loyalty, respect, and mutual understanding. Family involvement from the very beginning is deeply preferred.',
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: false,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    maritalStatus: 'Single',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Required',
    preferredAgeRange: [22, 27],
    preferredCity: 'Peshawar, Islamabad',
    interests: ['Architecture', 'Trekking', 'Traditional Music'],
    isDemo: true,
  },
];
