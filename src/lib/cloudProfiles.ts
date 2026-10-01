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
    mobileNumber: row.mobile_number || meta.mobileNumber,
    password: meta.password,
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
    additionalPhotos: meta.additionalPhotos,
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
    verificationStatus: meta.verificationStatus || (row.identity_verified ? 'verified' : 'unsubmitted'),
    submittedDocuments: meta.submittedDocuments || undefined,
    badges: {
      mobileVerified: row.mobile_verified ?? true,
      identityVerified: row.identity_verified ?? false,
      photoVerified: row.photo_verified ?? false,
      familyVerified: row.family_verified ?? false,
      noActiveRestrictions: row.no_active_restrictions ?? true,
    },
    isDemo: meta.isDemo ?? false,
  };
};

// Convert UserProfile to Supabase DB Row format (Strictly valid columns only)
export const mapProfileToDbRow = (p: UserProfile) => {
  const meta = {
    dob: p.dob,
    password: p.password,
    mobileNumber: p.mobileNumber,
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
    additionalPhotos: p.additionalPhotos,
    verificationStatus: p.verificationStatus || 'unsubmitted',
    submittedDocuments: p.submittedDocuments || null,
    isDemo: p.isDemo ?? false,
  };

  const serializedAbout = `${p.about || ''}\n\n---HSDATA---${JSON.stringify(meta)}`;

  return {
    name: p.name,
    age: p.age,
    gender: p.gender,
    city: p.city,
    country: p.country || 'Pakistan',
    mobile_number: p.mobileNumber || undefined,
    profession: p.profession,
    education: p.education,
    languages: p.languages || ['Urdu', 'English'],
    purpose: p.purpose || ['rishta'],
    avatar_url: p.avatar,
    about: serializedAbout,
    marital_status: p.maritalStatus || 'Never Married',
    family_involvement: p.familyInvolvementPreference || 'Preferred',
    religious_practice: p.religiousCommitment || 'Practicing',
    mobile_verified: p.badges?.mobileVerified ?? true,
    identity_verified: p.badges?.identityVerified ?? false,
    photo_verified: p.badges?.photoVerified ?? false,
    family_verified: p.badges?.familyVerified ?? false,
    no_active_restrictions: p.badges?.noActiveRestrictions ?? true,
  };
};

// Authenticate user by Mobile Number + Password
export const authenticateCloudUser = async (
  mobileNumber: string,
  pass: string
): Promise<{ user: UserProfile | null; error?: string }> => {
  const cleanMobile = mobileNumber.replace(/[\s-]/g, '').trim();
  const allProfiles = await fetchCloudProfiles();

  const found = allProfiles.find((p) => {
    const pMobile = (p.mobileNumber || '').replace(/[\s-]/g, '').trim();
    return pMobile === cleanMobile;
  });

  if (!found) {
    return { user: null, error: 'Yeh mobile number registered nahi hai. Naya account banayein.' };
  }

  if (found.password && found.password !== pass) {
    return { user: null, error: 'Password ghalat hai. Dobara check karein.' };
  }

  return { user: found };
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

// Get locally stored deleted IDs
const getLocalDeletedIds = (): Set<string> => {
  const set = new Set<string>();
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('hamsafar_deleted_ids') || '[]');
      stored.forEach((id: string) => set.add(id));
    } catch (e) {}
  }
  return set;
};

// Fetch all profiles from Supabase cloud (with fallback)
export const fetchCloudProfiles = async (): Promise<UserProfile[]> => {
  const localDeleted = getLocalDeletedIds();

  if (!isSupabaseConfigured()) {
    return INITIAL_PROFILES.filter((p) => !localDeleted.has(p.id));
  }

  try {
    // 1. Check if admin has permanently cleared demo data
    const demoCleared = await isDemoGloballyCleared();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch error, fallback:', error);
      const fallback = demoCleared ? [] : INITIAL_PROFILES;
      return fallback.filter((p) => !localDeleted.has(p.id));
    }

    // 2. Extract all globally deleted IDs marked with SYSTEM_DELETED_
    const globallyDeletedIds = new Set<string>();
    data.forEach((r) => {
      if (r.name && r.name.startsWith('SYSTEM_DELETED_')) {
        globallyDeletedIds.add(r.name.replace('SYSTEM_DELETED_', ''));
      }
    });

    // Also merge locally deleted IDs
    localDeleted.forEach((id) => globallyDeletedIds.add(id));

    // 3. Filter out system flags and any deleted user IDs
    const activeRows = data.filter(
      (r) =>
        !r.name.startsWith('SYSTEM_') &&
        !r.name.startsWith('SYSTEM_FLAG_') &&
        !globallyDeletedIds.has(r.id)
    );

    const loaded = activeRows.map(mapDbRowToProfile);

    let finalProfiles = loaded;
    if (demoCleared) {
      finalProfiles = loaded.filter((p) => !p.isDemo && !globallyDeletedIds.has(p.id));
    } else {
      const initialRemaining = INITIAL_PROFILES.filter((p) => !globallyDeletedIds.has(p.id));
      const existingIds = new Set(loaded.map((p) => p.id));
      const notInDb = initialRemaining.filter((p) => !existingIds.has(p.id));
      finalProfiles = [...loaded, ...notInDb];
    }

    return finalProfiles.filter((p) => !globallyDeletedIds.has(p.id));
  } catch (err) {
    console.error('Failed to fetch from cloud:', err);
    return INITIAL_PROFILES.filter((p) => !localDeleted.has(p.id));
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
    if (updates.avatar) rowUpdates.avatar_url = updates.avatar;
    if (updates.badges) {
      if (updates.badges.identityVerified !== undefined) rowUpdates.identity_verified = updates.badges.identityVerified;
      if (updates.badges.photoVerified !== undefined) rowUpdates.photo_verified = updates.badges.photoVerified;
      if (updates.badges.familyVerified !== undefined) rowUpdates.family_verified = updates.badges.familyVerified;
      if (updates.badges.noActiveRestrictions !== undefined) rowUpdates.no_active_restrictions = updates.badges.noActiveRestrictions;
    }

    if (updates.verificationStatus || updates.submittedDocuments || updates.about) {
      const { data: existing } = await supabase.from('profiles').select('about').eq('id', id).single();
      if (existing) {
        let displayAbout = existing.about || '';
        let meta: any = {};
        if (existing.about && existing.about.includes('---HSDATA---')) {
          const parts = existing.about.split('---HSDATA---');
          displayAbout = parts[0].trim();
          try { meta = JSON.parse(parts[1]); } catch (e) {}
        }
        if (updates.verificationStatus) meta.verificationStatus = updates.verificationStatus;
        if (updates.submittedDocuments) meta.submittedDocuments = updates.submittedDocuments;
        if (updates.about) displayAbout = updates.about;
        rowUpdates.about = `${displayAbout}\n\n---HSDATA---${JSON.stringify(meta)}`;
      }
    }

    await supabase.from('profiles').update(rowUpdates).eq('id', id);
  } catch (err) {
    console.error('Update cloud error:', err);
  }
};

// Delete profile in cloud permanently
export const deleteCloudProfile = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !id) return false;

  try {
    const isUuid = !id.startsWith('user-');

    // 1. Delete associated foreign key relations (connection requests, messages, notifications)
    if (isUuid) {
      await supabase.from('connection_requests').delete().or(`sender_id.eq.${id},receiver_id.eq.${id}`);
      await supabase.from('messages').delete().or(`sender_id.eq.${id},receiver_id.eq.${id}`);
      await supabase.from('notifications').delete().eq('user_id', id);
    }

    // 2. Insert permanent SYSTEM_DELETED marker into profiles table so all devices filter it out permanently
    await supabase.from('profiles').insert([
      {
        name: `SYSTEM_DELETED_${id}`,
        age: 99,
        gender: 'male',
        city: 'System',
        profession: 'System',
        education: 'System',
        purpose: ['rishta'],
      },
    ]);

    // 3. Also attempt direct table row deletion
    if (isUuid) {
      await supabase.from('profiles').delete().eq('id', id);
    }

    // 4. Save to local storage deleted set
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('hamsafar_deleted_ids') || '[]');
        if (!stored.includes(id)) {
          localStorage.setItem('hamsafar_deleted_ids', JSON.stringify([...stored, id]));
        }
      } catch (e) {}
    }

    return true;
  } catch (err) {
    console.error('Delete cloud error:', err);
    return false;
  }
};

// Delete all demo profiles in cloud & set global flag
export const clearCloudDemoProfiles = async () => {
  if (!isSupabaseConfigured()) return;
  try {
    // 1. Delete all demo rows by name
    const demoNames = INITIAL_PROFILES.map((p) => p.name);
    await supabase.from('profiles').delete().in('name', demoNames);
    
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
      }
    ]);
  } catch (err) {
    console.error('Clear cloud demo error:', err);
  }
};
