import { describe, it, expect, beforeEach } from 'vitest';
import { MobileOfflineVaultService, OfflineVaultListing, OfflineVaultDeal } from '../mobileOfflineVaultService';

describe('Mobile PWA Encrypted Offline Vault & Biometric Unlock Service', () => {
  let vault: MobileOfflineVaultService;

  beforeEach(() => {
    vault = MobileOfflineVaultService.getInstance();
    vault.clearVault();
  });

  it('starts locked and shields cached listings and deals from unauthenticated access', () => {
    expect(vault.isVaultLocked()).toBe(true);
    expect(vault.getCachedListings()).toEqual([]);
    expect(vault.getCachedDeals()).toEqual([]);
  });

  it('allows caching and reveals listings upon biometric quick-unlock', async () => {
    const sampleListing: OfflineVaultListing = {
      id: 'vault-prop-101',
      referenceNumber: 'WC-PALM-99',
      title: 'Palm Jumeirah Signature Villa',
      community: 'Palm Jumeirah',
      priceAed: 45_000_000,
      bedrooms: 5,
      bathrooms: 6,
      areaSqft: 8200,
      cachedAt: Date.now()
    };

    vault.cacheListings([sampleListing]);

    // When locked: shielded
    expect(vault.getCachedListings()).toEqual([]);

    // Unlock via biometric authentication
    const unlocked = await vault.unlockWithBiometrics(true);
    expect(unlocked).toBe(true);
    expect(vault.isVaultLocked()).toBe(false);

    // Revealed
    const cached = vault.getCachedListings();
    expect(cached).toHaveLength(1);
    expect(cached[0].title).toBe('Palm Jumeirah Signature Villa');
    expect(cached[0].priceAed).toBe(45_000_000);
  });

  it('caches confidential deal pipelines with verified document count', async () => {
    const sampleDeal: OfflineVaultDeal = {
      dealId: 'DEAL-OFFLINE-77',
      clientName: 'Lord Sterling',
      clientPhone: '+971501112233',
      propertyTitle: 'Downtown Penthouse',
      dealStage: 'CONTRACT',
      agreedPriceAed: 18_500_000,
      escrowVerified: true,
      documentsVerifiedCount: 4,
      totalDocumentsCount: 4,
      lastUpdated: Date.now()
    };

    vault.cacheDeals([sampleDeal]);
    await vault.unlockWithBiometrics(true);

    const deals = vault.getCachedDeals();
    expect(deals).toHaveLength(1);
    expect(deals[0].clientName).toBe('Lord Sterling');
    expect(deals[0].escrowVerified).toBe(true);
  });

  it('relocks immediately on lockVault() call', async () => {
    await vault.unlockWithBiometrics(true);
    expect(vault.isVaultLocked()).toBe(false);

    vault.lockVault();
    expect(vault.isVaultLocked()).toBe(true);
    expect(vault.getCachedListings()).toEqual([]);
  });
});
