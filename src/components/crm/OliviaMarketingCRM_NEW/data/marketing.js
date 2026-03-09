export const CAMPAIGNS = [
  { id: 1, name: 'Summer Property Showcase', platform: 'facebook', status: 'active', budget: 25000, spent: 18500, reach: 125000, leads: 48, cpl: 385 },
  { id: 2, name: 'Luxury Villas Launch', platform: 'instagram', status: 'active', budget: 15000, spent: 12000, reach: 89000, leads: 32, cpl: 375 },
  { id: 3, name: 'DAMAC Hills 2 Promo', platform: 'google', status: 'paused', budget: 20000, spent: 8000, reach: 45000, leads: 18, cpl: 444 },
  { id: 4, name: 'Email Newsletter Q1', platform: 'email', status: 'completed', budget: 5000, spent: 5000, reach: 25000, leads: 85, cpl: 59 }
];

export const SOCIAL_STATS = [
  { platform: 'Instagram', followers: 45200, growth: 12.5, engagement: 4.8, posts: 156 },
  { platform: 'Facebook', followers: 32100, growth: 8.2, engagement: 2.1, posts: 89 },
  { platform: 'LinkedIn', followers: 12400, growth: 15.3, engagement: 3.2, posts: 45 },
  { platform: 'YouTube', followers: 8900, growth: 22.1, engagement: 5.5, posts: 28 }
];

export const LISTINGS = [
  { id: 1, property: 'Villa 348 - DAMAC Hills 2', views: 2450, inquiries: 28, quality: 92, available: 12 },
  { id: 2, property: 'Penthouse 2501 - Downtown', views: 1890, inquiries: 15, quality: 88, available: 3 },
  { id: 3, property: 'Apartment 1205 - Marina', views: 1560, inquiries: 22, quality: 85, available: 0 },
  { id: 4, property: 'Townhouse - DAMAC Lagoons', views: 1420, inquiries: 18, quality: 90, available: 8 },
  { id: 5, property: 'Villa 125 - Emirates Hills', views: 980, inquiries: 12, quality: 95, available: 1 }
];

export const MONITORED_SITES = [
  { name: 'Bayut', status: 'healthy', lastCheck: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), dataPoints: 1250 },
  { name: 'Property Finder', status: 'healthy', lastCheck: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), dataPoints: 980 },
  { name: 'Dubizzle', status: 'degraded', lastCheck: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), dataPoints: 650 }
];

export const MARKET_INSIGHTS = {
  priceIndex: 152.3,
  priceChange: 2.4,
  avgRentalYield: 6.8,
  supplyDemandRatio: 0.78,
  hotspots: [
    { area: 'Dubai Hills Estate', priceChange: 8.5, avgPrice: 2850000, demand: 'high' },
    { area: 'DAMAC Hills 2', priceChange: 12.3, avgPrice: 1450000, demand: 'very high' },
    { area: 'Palm Jumeirah', priceChange: 5.2, avgPrice: 8500000, demand: 'stable' },
    { area: 'Downtown Dubai', priceChange: 3.8, avgPrice: 3200000, demand: 'high' },
    { area: 'JVC', priceChange: 15.1, avgPrice: 850000, demand: 'very high' }
  ],
  trends: [
    { month: 'Aug', sales: 2450, rentals: 3200, priceIndex: 148 },
    { month: 'Sep', sales: 2680, rentals: 3350, priceIndex: 149 },
    { month: 'Oct', sales: 2890, rentals: 3100, priceIndex: 150 },
    { month: 'Nov', sales: 3100, rentals: 2950, priceIndex: 151 },
    { month: 'Dec', sales: 3250, rentals: 3400, priceIndex: 152 },
    { month: 'Jan', sales: 3420, rentals: 3580, priceIndex: 152.3 }
  ]
};
