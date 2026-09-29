export interface PartnerRequirements {
  gender: 'male' | 'female' | 'any';
  ageRange: [number, number];
  flexibleAge: boolean;
  preferredCities: string[];
  relocationWillingness: 'Yes' | 'No' | 'Maybe' | 'Depends';
  maritalStatusPreference: string[]; // ['Never Married', 'Divorced', 'Widowed', 'Any']
  childrenPreference: 'No preference' | 'Prefer no children' | 'Comfortable with children';
  minEducation: string;
  preferredFields: string[];
  preferredProfessions: string[];
  financialLifestyle: 'Simple' | 'Moderate' | 'Comfortable' | 'No preference';
  familyTypePreference: 'Joint' | 'Nuclear' | 'Either' | 'No preference';
  livingArrangementAfterMarriage: 'With parents' | 'Separate home' | 'Flexible' | 'Depends';
  religiousImportance: 'Very important' | 'Important' | 'Moderate' | 'Flexible' | 'No preference';
  personalityTraits: string[];
  lifestylePreferences: string[];
  smokingPreference: 'Must not smoke' | 'Prefer non-smoker' | 'Flexible' | 'No preference';
  careerAfterMarriage: 'Career strongly preferred' | 'Strongly preferred' | 'Optional' | 'Homemaker preferred' | 'Flexible';
  futureChildrenPreference: 'Want children' | 'Do not want children' | 'Discuss later' | 'No preference';
  marriageTimeline: 'Immediately / Soon' | 'Within 6 months' | 'Within 1 year' | '1-2 years' | 'No fixed timeline';
  seriousnessLevel: string;
  friendshipBeforeMarriage: 'Prefer friendship first' | 'Prefer direct serious rishta' | 'Either';
  dealBreakers: string[];
  importantQualities: string[];
  flexibleIn: string[];
  mustHaves: string[];
  idealPartnerSummary?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  dob?: string;
  city: string;
  country: string;
  nativeCity?: string;
  languages: string[];
  profession: string;
  education: string;
  degreeField?: string;
  institution?: string;
  purpose: ('rishta' | 'friendship')[];
  seriousnessLevel?: string;
  avatar: string;
  additionalPhotos?: string[];
  photosOnlyAccepted?: boolean;
  about: string;
  personalityTraits?: string[];
  
  // Work & Financial
  jobType?: 'Job' | 'Business' | 'Self-employed' | 'Homemaker';
  industry?: string;
  incomeRange?: string; // 'Prefer not to say', 'Under 100k', '100k-250k', '250k-500k', '500k+'

  // Family Background
  familyType?: 'Joint Family' | 'Nuclear Family' | 'Extended Family' | 'Prefer not to say';
  parentsStatus?: string;
  brothersCount?: number;
  sistersCount?: number;
  familyValues?: string;

  // Marital & Lifestyle
  maritalStatus?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  dailyLifeStyle?: string;
  interests?: string[];
  hobbies?: string[];
  lifeGoals?: string[];
  futureGoalText?: string;

  // Marriage Mindset (Rishta users)
  livingArrangementPreference?: 'With parents' | 'Separate home' | 'Flexible';
  relocationWillingness?: 'Yes' | 'No' | 'Maybe' | 'Depends' | 'Depends on circumstances';
  careerAfterMarriage?: string;
  familyInvolvementPreference?: 'Required' | 'Preferred' | 'Later' | 'Only after serious interest';
  religiousCommitment?: string;

  // Communication & Status
  communicationStyle?: string;
  communicationFrequency?: 'Frequent' | 'Frequent communication' | 'Occasional' | 'Occasional communication' | 'Slow and gradual';
  profileStatus?: 'active' | 'taking_a_break' | 'found_my_hamsafar';
  profileCompletionPercentage?: number;

  // Part 2: Partner Requirements (Rishta only)
  requirements?: PartnerRequirements;

  // Verification Badges & Status
  verificationStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  submittedDocuments?: {
    cnicNumber: string;
    cnicFrontName?: string;
    selfieName?: string;
    submittedAt: string;
  };
  badges: {
    mobileVerified: boolean;
    identityVerified: boolean;
    photoVerified: boolean;
    familyVerified: boolean;
    noActiveRestrictions: boolean;
  };
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
    education: 'Master\'s',
    degreeField: 'Computer Science',
    institution: 'FAST-NUCES Lahore',
    jobType: 'Job',
    incomeRange: '250k - 500k PKR',
    languages: ['Urdu', 'English', 'Punjabi'],
    purpose: ['rishta'],
    seriousnessLevel: 'Marriage کے لیے serious',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    about: 'Sincere, family-oriented individual looking for a life partner with mutual respect, shared values, and a positive mindset toward life.',
    personalityTraits: ['Family-oriented', 'Ambitious', 'Calm', 'Balanced'],
    familyType: 'Nuclear Family',
    parentsStatus: 'Both Parents Alive',
    brothersCount: 1,
    sistersCount: 2,
    familyValues: 'Traditional yet progressive education values',
    maritalStatus: 'Never Married',
    hasChildren: false,
    dailyLifeStyle: 'Balanced work & family routine',
    interests: ['Technology', 'Travelling', 'Books', 'Cricket'],
    hobbies: ['Badminton', 'Tech Podcasts', 'Weekend Cooking'],
    lifeGoals: ['Family', 'Career', 'Financial stability', 'Personal development'],
    livingArrangementPreference: 'Flexible',
    relocationWillingness: 'Maybe',
    careerAfterMarriage: 'Career strongly preferred / supported',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Preferred',
    communicationStyle: 'Texting & Voice calls after mutual consent',
    communicationFrequency: 'Frequent communication',
    profileStatus: 'active',
    profileCompletionPercentage: 90,
    requirements: {
      gender: 'female',
      ageRange: [23, 27],
      flexibleAge: true,
      preferredCities: ['Lahore', 'Islamabad'],
      relocationWillingness: 'Maybe',
      maritalStatusPreference: ['Never Married'],
      childrenPreference: 'Prefer no children',
      minEducation: 'Bachelor\'s',
      preferredFields: ['Medical', 'IT', 'Education', 'Business'],
      preferredProfessions: ['Doctor', 'Engineer', 'Teacher', 'IT'],
      financialLifestyle: 'Moderate',
      familyTypePreference: 'Either',
      livingArrangementAfterMarriage: 'Flexible',
      religiousImportance: 'Important',
      personalityTraits: ['Kind', 'Respectful', 'Educated', 'Family-oriented'],
      lifestylePreferences: ['Balanced', 'Family-oriented'],
      smokingPreference: 'Must not smoke',
      careerAfterMarriage: 'Career strongly preferred',
      futureChildrenPreference: 'Want children',
      marriageTimeline: 'Within 1 year',
      seriousnessLevel: 'Serious marriage',
      friendshipBeforeMarriage: 'Prefer direct serious rishta',
      dealBreakers: ['Smoking', 'Financial dishonesty'],
      importantQualities: ['Respect', 'Honesty', 'Family values'],
      flexibleIn: ['City', 'Income range'],
      mustHaves: ['Educated Bachelor\'s degree', 'Family-oriented'],
      idealPartnerSummary: 'Talash hai aik parhi likhi, khush ikhlaq aur ba-waqar shareek-e-hayat ki jo family values aur career dono mein tawazun rakhay.',
    },
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    verificationStatus: 'verified',
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
    education: 'Bachelor\'s',
    degreeField: 'Medicine & Surgery (MBBS)',
    institution: 'Shifa College of Medicine',
    jobType: 'Job',
    incomeRange: '100k - 250k PKR',
    languages: ['Urdu', 'English'],
    purpose: ['rishta'],
    seriousnessLevel: 'Family involvement کے لیے تیار',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    about: 'Compassionate healthcare professional. Values honesty, simple lifestyle, and strong family ties. Looking for a well-educated partner with good moral character.',
    personalityTraits: ['Empathetic', 'Quiet lifestyle', 'Responsible', 'Caring'],
    familyType: 'Joint Family',
    parentsStatus: 'Father Retired Officer, Mother Homemaker',
    brothersCount: 2,
    sistersCount: 1,
    maritalStatus: 'Never Married',
    hasChildren: false,
    interests: ['Healthcare', 'Reading', 'Volunteering', 'Gardening'],
    hobbies: ['Calligraphy', 'Baking', 'Book Clubs'],
    lifeGoals: ['Family', 'Religious growth', 'Personal development'],
    livingArrangementPreference: 'With parents',
    relocationWillingness: 'Depends on circumstances',
    careerAfterMarriage: 'Career strongly preferred',
    religiousCommitment: 'Practicing Muslim',
    familyInvolvementPreference: 'Required',
    communicationStyle: 'Family involvement from beginning',
    communicationFrequency: 'Occasional communication',
    profileStatus: 'active',
    profileCompletionPercentage: 95,
    requirements: {
      gender: 'male',
      ageRange: [27, 32],
      flexibleAge: true,
      preferredCities: ['Islamabad', 'Rawalpindi', 'Lahore'],
      relocationWillingness: 'Maybe',
      maritalStatusPreference: ['Never Married'],
      childrenPreference: 'Prefer no children',
      minEducation: 'Master\'s',
      preferredFields: ['Medical', 'Engineering', 'IT', 'Business'],
      preferredProfessions: ['Doctor', 'Engineer', 'IT', 'Civil Services'],
      financialLifestyle: 'Comfortable',
      familyTypePreference: 'Either',
      livingArrangementAfterMarriage: 'Flexible',
      religiousImportance: 'Very important',
      personalityTraits: ['Honest', 'Responsible', 'Respectful', 'Educated'],
      lifestylePreferences: ['Simple', 'Family-oriented'],
      smokingPreference: 'Must not smoke',
      careerAfterMarriage: 'Career strongly preferred',
      futureChildrenPreference: 'Want children',
      marriageTimeline: 'Within 6 months',
      seriousnessLevel: 'Family-assisted matchmaking',
      friendshipBeforeMarriage: 'Prefer direct serious rishta',
      dealBreakers: ['Smoking', 'Dishonesty', 'Bad temper'],
      importantQualities: ['Respect for elders', 'Honesty', 'Humility'],
      flexibleIn: ['City (Islamabad/Lahore)'],
      mustHaves: ['Non-smoker', 'Practicing Muslim', 'Professional Degree'],
      idealPartnerSummary: 'Talash hai aik deendar, taleem-yafta aur shareef shakhs ki jo biwi ke career aur izzat ka khyal rakhay aur family orientation rakhta ho.',
    },
    badges: {
      mobileVerified: true,
      identityVerified: true,
      photoVerified: true,
      familyVerified: true,
      noActiveRestrictions: true,
    },
    verificationStatus: 'verified',
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
    education: 'Bachelor\'s',
    degreeField: 'Communication Design',
    institution: 'Indus Valley School of Art',
    jobType: 'Self-employed',
    incomeRange: '100k - 250k PKR',
    languages: ['Urdu', 'English', 'Sindhi'],
    purpose: ['friendship', 'rishta'],
    seriousnessLevel: 'ایک دوسرے کو سمجھنا',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    about: 'Creative thinker looking for verified, meaningful friendships and potential serious life partners. Big on respectful conversations and art galleries.',
    personalityTraits: ['Friendly', 'Creative', 'Introvert', 'Balanced'],
    familyType: 'Nuclear Family',
    maritalStatus: 'Never Married',
    hasChildren: false,
    interests: ['Design', 'Coffee Culture', 'Art & Exhibitions', 'Photography'],
    hobbies: ['Painting', 'Podcasts', 'Museum Visits'],
    lifeGoals: ['Career', 'Personal development', 'Travel'],
    livingArrangementPreference: 'Separate home',
    relocationWillingness: 'Yes',
    careerAfterMarriage: 'Career strongly preferred',
    religiousCommitment: 'Moderate',
    familyInvolvementPreference: 'Later',
    communicationStyle: 'Texting first, voice calls later',
    communicationFrequency: 'Frequent communication',
    profileStatus: 'active',
    profileCompletionPercentage: 85,
    badges: {
      mobileVerified: true,
      identityVerified: false,
      photoVerified: false,
      familyVerified: false,
      noActiveRestrictions: true,
    },
    verificationStatus: 'unsubmitted',
    isDemo: true,
  },
];
