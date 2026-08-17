/**
 * InteractiveMapDrawer.data.ts — Content & Data Variables
 */

export interface MapPin {
  id: string;
  name: string;
  priceFormatted: string;
  community: string;
  type: string;
  beds: number;
  top: string;
  left: string;
  specs: string;
}

export const MAP_PINS: MapPin[] = [
  {
    id: 'PIN-1',
    name: 'Palm Jumeirah Signature Villa',
    priceFormatted: 'AED 120M',
    community: 'Palm Jumeirah',
    type: 'Beachfront Mansion',
    beds: 6,
    top: '35%',
    left: '40%',
    specs: 'Live DLD Verified Listing · Direct Private Beach Access · Infinity Pool',
  },
  {
    id: 'PIN-2',
    name: 'Downtown Dubai Sky Penthouse',
    priceFormatted: 'AED 45M',
    community: 'Downtown Dubai',
    type: 'Sky Penthouse',
    beds: 4,
    top: '65%',
    left: '65%',
    specs: 'Burj Khalifa View · Direct Mall Access · Private Elevator',
  },
  {
    id: 'PIN-3',
    name: 'DAMAC Hills 2 Luxury Cluster Villa',
    priceFormatted: 'AED 2.8M',
    community: 'DAMAC Hills 2',
    type: 'Master Cluster Villa',
    beds: 5,
    top: '55%',
    left: '80%',
    specs: 'Water Town Cluster · Private Garden · High Rental Yield (8.4%)',
  },
];

export const MAP_DRAWER_TEXT = {
  mapHeader: 'Monochrome Leaflet Map — Dubai Luxury Ledger',
  mapSubtext: 'Click red markers to view property specs and schedule instant private viewings.',
  drawerTitle: 'Property Quick View',
  ctaAction: 'Inquire Sovereign Broker',
  closeAria: 'Close Drawer',
};
