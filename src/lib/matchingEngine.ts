import { UserProfile } from '@/data/profiles';

export interface MatchAnalysis {
  matchCategory: 'Strong Match' | 'Potential Match' | 'Explore';
  whyYouMayMatch: string[];
  thingsToDiscuss: string[];
}

export const analyzeCompatibility = (
  userA: UserProfile,
  userB: UserProfile
): MatchAnalysis => {
  const whyYouMayMatch: string[] = [];
  const thingsToDiscuss: string[] = [];

  // 1. City / Location match
  if (userA.city.toLowerCase() === userB.city.toLowerCase()) {
    whyYouMayMatch.push(`Same City (${userA.city})`);
  } else if (userA.requirements?.preferredCities.some(c => c.toLowerCase() === userB.city.toLowerCase())) {
    whyYouMayMatch.push(`City matches preferred location (${userB.city})`);
  } else if (userA.requirements && userB.requirements && userA.requirements.relocationWillingness !== 'No' && userB.requirements.relocationWillingness !== 'No') {
    whyYouMayMatch.push('Both flexible regarding relocation');
  } else {
    thingsToDiscuss.push(`Different cities (${userA.city} vs ${userB.city}) - discuss relocation plans`);
  }

  // 2. Purpose Match
  const commonPurpose = userA.purpose.filter(p => userB.purpose.includes(p));
  if (commonPurpose.includes('rishta')) {
    whyYouMayMatch.push('Both looking for Serious Rishta / Marriage');
  }
  if (commonPurpose.includes('friendship')) {
    whyYouMayMatch.push('Both open to Verified Intellectual Friendship');
  }

  // 3. Age Preference Check
  if (userA.requirements?.ageRange) {
    const [min, max] = userA.requirements.ageRange;
    if (userB.age >= min && userB.age <= max) {
      whyYouMayMatch.push(`Age fits preferred range (${min}-${max} yrs)`);
    } else if (userA.requirements.flexibleAge) {
      whyYouMayMatch.push('Age close to preferred range (Flexible)');
    } else {
      thingsToDiscuss.push(`Age (${userB.age} yrs) outside primary range (${min}-${max} yrs)`);
    }
  }

  // 4. Family Orientation & Involvement
  if (
    userA.familyInvolvementPreference === userB.familyInvolvementPreference ||
    (userA.familyInvolvementPreference === 'Preferred' && userB.familyInvolvementPreference === 'Required')
  ) {
    whyYouMayMatch.push('Both prioritize family guardian involvement');
  }

  // 5. Living Arrangement Compatibility
  if (userA.livingArrangementPreference && userB.livingArrangementPreference) {
    if (userA.livingArrangementPreference === userB.livingArrangementPreference) {
      whyYouMayMatch.push(`Both prefer ${userA.livingArrangementPreference} arrangement`);
    } else if (userA.livingArrangementPreference === 'Flexible' || userB.livingArrangementPreference === 'Flexible') {
      whyYouMayMatch.push('Living arrangement expectations are flexible');
    } else {
      thingsToDiscuss.push(`Living arrangement difference (${userA.livingArrangementPreference} vs ${userB.livingArrangementPreference})`);
    }
  }

  // 6. Shared Interests
  if (userA.interests && userB.interests) {
    const commonInterests = userA.interests.filter(i => userB.interests?.includes(i));
    if (commonInterests.length > 0) {
      whyYouMayMatch.push(`Shared interests: ${commonInterests.slice(0, 3).join(', ')}`);
    }
  }

  // 7. Education Level
  if (userA.education && userB.education) {
    whyYouMayMatch.push(`Both well-educated (${userA.education} & ${userB.education})`);
  }

  // Determine Category based on actual alignments
  let matchCategory: 'Strong Match' | 'Potential Match' | 'Explore' = 'Explore';
  if (whyYouMayMatch.length >= 4 && thingsToDiscuss.length <= 1) {
    matchCategory = 'Strong Match';
  } else if (whyYouMayMatch.length >= 2) {
    matchCategory = 'Potential Match';
  }

  return {
    matchCategory,
    whyYouMayMatch,
    thingsToDiscuss,
  };
};
