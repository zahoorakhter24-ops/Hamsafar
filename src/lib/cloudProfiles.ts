import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, INITIAL_PROFILES } from '@/data/profiles';

// Convert Supabase DB Row to UserProfile interface
export const mapDbRowToProfile = (row: any): UserProfile => {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    city: row.city,
    country: row.country || 'Pakistan',
    profession: row.profession,
    education: row.education,
    languages: row.languages || ['Urdu', 'English'],
    purpose: row.purpose || ['rishta'],
    avatar: row.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    about: row.about || '',
    maritalStatus: row.marital_status || 'Single',
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
    about: p.about,
    marital_status: p.maritalStatus || 'Single',
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

// Fetch all profiles from Supabase cloud (with fallback)
export const fetchCloudProfiles = async (): Promise<UserProfile[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_PROFILES;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase profiles empty or error, using initial defaults:', error);
      return INITIAL_PROFILES;
    }

    return data.map(mapDbRowToProfile);
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

// Delete all demo profiles in cloud
export const clearCloudDemoProfiles = async () => {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('profiles').delete().eq('is_demo', true);
  } catch (err) {
    console.error('Clear cloud demo error:', err);
  }
};
