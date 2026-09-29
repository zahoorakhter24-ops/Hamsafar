import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, INITIAL_PROFILES } from '@/data/profiles';

// Convert Supabase DB Row to UserProfile interface
export const mapDbRowToProfile = (row: any): UserProfile => {
  let displayAbout = row.about || '';
  let meta: any = {};
  if (row.about && row.about.includes('---HSDATA---')) {
    const parts = row.about.split('---HSDATA---');
    displayAbout = parts[0].trim();
    try {
      meta = JSON.parse(parts[1]);
    } catch (e) {}
  }

  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    dob: meta.dob,
    city: row.city,
    country: row.country || 'Pakistan',
    nativeCity: meta.nativeCity,
    profession: row.profession,
    education: row.education,
    degreeField: meta.degreeField,
    institution: meta.institution,
    jobType: meta.jobType,
    incomeRange: meta.incomeRange,
    languages: row.languages || ['Urdu', 'English'],
    purpose: row.purpose || ['rishta'],
    seriousnessLevel: meta.seriousnessLevel,
    avatar: row.avatar_url || (row.gender === 'female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'),
    about: displayAbout,
    maritalStatus: row.marital_status || 'Never Married',
    hasChildren: meta.hasChildren,
    childrenCount: meta.childrenCount,
    familyType: meta.familyType,
    parentsStatus: meta.parentsStatus,
    brothersCount: meta.brothersCount,
    sistersCount: meta.sistersCount,
    livingArrangementPreference: meta.livingArrangementPreference,
    requirements: meta.requirements,
    familyInvolvementPreference: row.family_involvement || 'Preferred',
    religiousCommitment: row.religious_practice || 'Practicing',
    verificationStatus: row.verification_status || (row.identity_verified ? 'verified' : 'unsubmitted'),
    submittedDocuments: row.submitted_documents || undefined,
    badges: {
      mobileVerified: row.mobile_verified ?? true,
      identityVerified: row.identity_verified ?? false,
      photoVerified: row.photo_verified ?? false,
      familyVerified: row.family_verified ?? false,
      noActiveRestrictions: row.no_active_restrictions ?? true,
    },
    isDemo: row.is_demo ?? false,
  };
};

// Convert UserProfile to Supabase DB Row format
export const mapProfileToDbRow = (p: UserProfile) => {
  const meta = {
    dob: p.dob,
    nativeCity: p.nativeCity,
    degreeField: p.degreeField,
    institution: p.institution,
    jobType: p.jobType,
    incomeRange: p.incomeRange,
    seriousnessLevel: p.seriousnessLevel,
    hasChildren: p.hasChildren,
    childrenCount: p.childrenCount,
    familyType: p.familyType,
    parentsStatus: p.parentsStatus,
    brothersCount: p.brothersCount,
    sistersCount: p.sistersCount,
    livingArrangementPreference: p.livingArrangementPreference,
    requirements: p.requirements,
  };

  const serializedAbout = `${p.about || ''}\n\n---HSDATA---${JSON.stringify(meta)}`;

  return {
    id: p.id.startsWith('user-') ? undefined : p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    city: p.city,
    country: p.country,
    profession: p.profession,
    education: p.education,
    languages: p.languages,
    purpose: p.purpose,
    avatar_url: p.avatar,
    about: serializedAbout,
    marital_status: p.maritalStatus || 'Never Married',
    family_involvement: p.familyInvolvementPreference || 'Preferred',
    religious_practice: p.religiousCommitment || 'Practicing',
    verification_status: p.verificationStatus || 'unsubmitted',
    submitted_documents: p.submittedDocuments || null,
    mobile_verified: p.badges.mobileVerified,
    identity_verified: p.badges.identityVerified,
    photo_verified: p.badges.photoVerified,
    family_verified: p.badges.familyVerified,
    no_active_restrictions: p.badges.noActiveRestrictions,
    is_demo: p.isDemo ?? false,
  };
};

// Check if demo data was globally cleared in Supabase
export const isDemoGloballyCleared = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', 'SYSTEM_FLAG_DEMO_CLEARED')
      .limit(1);
    return Boolean(data && data.length > 0);
  } catch (err) {
    return false;
  }
};

// Fetch all profiles from Supabase cloud (with fallback)
export const fetchCloudProfiles = async (): Promise<UserProfile[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_PROFILES;
  }

  try {
    // 1. Check if admin has permanently cleared demo data
    const demoCleared = await isDemoGloballyCleared();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('name', 'SYSTEM_FLAG_DEMO_CLEARED')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, fallback:', error);
      return demoCleared ? [] : INITIAL_PROFILES;
    }

    if (!data || data.length === 0) {
      // If demo was cleared, don't show demo profiles
      if (demoCleared) {
        return [];
      }
      // If table is totally new and demo not cleared, populate demo data into cloud once
      return INITIAL_PROFILES;
    }

    const loaded = data.map(mapDbRowToProfile);
    if (demoCleared) {
      return loaded.filter((p) => !p.isDemo);
    }
    return loaded;
  } catch (err) {
    console.error('Failed to fetch from cloud:', err);
    return INITIAL_PROFILES;
  }
};

// Save / Insert new profile to Supabase
export const insertCloudProfile = async (profile: UserProfile): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const row = mapProfileToDbRow(profile);
    const { data, error } = await supabase
      .from('profiles')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return null;
    }
    return mapDbRowToProfile(data);
  } catch (err) {
    console.error('Insert error:', err);
    return null;
  }
};

// Update profile in cloud
export const updateCloudProfile = async (id: string, updates: Partial<UserProfile>) => {
  if (!isSupabaseConfigured()) return;

  try {
    const rowUpdates: any = {};
    if (updates.verificationStatus) rowUpdates.verification_status = updates.verificationStatus;
    if (updates.submittedDocuments) rowUpdates.submitted_documents = updates.submittedDocuments;
    if (updates.badges) {
      if (updates.badges.identityVerified !== undefined) rowUpdates.identity_verified = updates.badges.identityVerified;
      if (updates.badges.photoVerified !== undefined) rowUpdates.photo_verified = updates.badges.photoVerified;
      if (updates.badges.familyVerified !== undefined) rowUpdates.family_verified = updates.badges.familyVerified;
      if (updates.badges.noActiveRestrictions !== undefined) rowUpdates.no_active_restrictions = updates.badges.noActiveRestrictions;
    }

    await supabase.from('profiles').update(rowUpdates).eq('id', id);
  } catch (err) {
    console.error('Update cloud error:', err);
  }
};

// Delete profile in cloud
export const deleteCloudProfile = async (id: string) => {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('profiles').delete().eq('id', id);
  } catch (err) {
    console.error('Delete cloud error:', err);
  }
};

// Delete all demo profiles in cloud & set global flag
export const clearCloudDemoProfiles = async () => {
  if (!isSupabaseConfigured()) return;
  try {
    // 1. Delete all demo rows
    await supabase.from('profiles').delete().eq('is_demo', true);
    
    // 2. Set permanent flag in profiles table so no device ever restores demo profiles
    await supabase.from('profiles').upsert([
      {
        name: 'SYSTEM_FLAG_DEMO_CLEARED',
        age: 99,
        gender: 'male',
        city: 'System',
        profession: 'System',
        education: 'System',
        purpose: ['rishta'],
        is_demo: false,
      }
    ]);
  } catch (err) {
    console.error('Clear cloud demo error:', err);
  }
};
