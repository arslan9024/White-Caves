/**
 * FeaturedCommunityCarousel.data.ts — Content & Data Variables
 */

export interface CommunityItem {
  name: string;
  type: string;
  listings: number;
  avgSqft: string;
  icon: string;
}

export const FEATURED_COMMUNITIES: CommunityItem[] = [
  { name: 'Palm Jumeirah', type: 'Iconic Beachfront Living', listings: 42, avgSqft: 'AED 3,450/sqft', icon: '🏝️' },
  { name: 'Downtown Dubai', type: 'Urban Luxury & Burj Views', listings: 68, avgSqft: 'AED 2,850/sqft', icon: '🏙️' },
  { name: 'Dubai Hills Estate', type: 'Golf Course Mansions', listings: 35, avgSqft: 'AED 2,150/sqft', icon: '⛳' },
  { name: 'DAMAC Hills 2', type: 'Master Community & Water Town', listings: 85, avgSqft: 'AED 1,120/sqft', icon: '🌊' },
];

export const CAROUSEL_TEXT = {
  headerTitle: '💎 Prime Master Communities',
  badge: 'DLD Q3 Verified',
  activeListingsLabel: 'Active Listings',
  avgPriceLabel: 'Avg Price/SqFt',
};
