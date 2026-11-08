/**
 * MapIndexHash In-Memory Listing Cache Engine
 * Domain: High-Throughput Backend & Distributed Core Systems (Domain 6)
 * Protocol: TURING-LAW-000, Sub-10ms Lookup Guarantee
 */

export interface CachedPropertyListing {
  id: string;
  referenceNumber: string;
  title: string;
  community: string;
  priceAed: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: 'PENTHOUSE' | 'VILLA' | 'APARTMENT' | 'MANSION' | 'OFFICE';
  status: 'ACTIVE' | 'UNDER_OFFER' | 'SOLD';
  isBayutVerified: boolean;
  trakheesiPermitNumber: string;
}

export class ListingIndexCache {
  private static instance: ListingIndexCache;
  private idMap = new Map<string, CachedPropertyListing>();
  private communityIndex = new Map<string, Set<string>>();
  private referenceMap = new Map<string, string>();

  private constructor() {}

  public static getInstance(): ListingIndexCache {
    if (!ListingIndexCache.instance) {
      ListingIndexCache.instance = new ListingIndexCache();
    }
    return ListingIndexCache.instance;
  }

  public upsertListing(listing: CachedPropertyListing): void {
    this.idMap.set(listing.id, listing);
    this.referenceMap.set(listing.referenceNumber, listing.id);

    const commKey = listing.community.toLowerCase().trim();
    if (!this.communityIndex.has(commKey)) {
      this.communityIndex.set(commKey, new Set<string>());
    }
    this.communityIndex.get(commKey)!.add(listing.id);
  }

  public getById(id: string): CachedPropertyListing | undefined {
    return this.idMap.get(id);
  }

  public getByReference(referenceNumber: string): CachedPropertyListing | undefined {
    const id = this.referenceMap.get(referenceNumber);
    return id ? this.idMap.get(id) : undefined;
  }

  public getByCommunity(communityName: string): CachedPropertyListing[] {
    const commKey = communityName.toLowerCase().trim();
    const ids = this.communityIndex.get(commKey);
    if (!ids) return [];

    const results: CachedPropertyListing[] = [];
    ids.forEach(id => {
      const listing = this.idMap.get(id);
      if (listing) results.push(listing);
    });
    return results;
  }

  public size(): number {
    return this.idMap.size;
  }

  public clear(): void {
    this.idMap.clear();
    this.communityIndex.clear();
    this.referenceMap.clear();
  }
}
