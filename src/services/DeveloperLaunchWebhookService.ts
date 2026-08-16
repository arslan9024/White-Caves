export interface DeveloperLaunchEvent {
  developer: 'EMAAR' | 'DAMAC' | 'NAKHEEL' | 'SOBHA';
  projectName: string;
  totalUnits: number;
  startingPriceAed: number;
  launchDate: string;
}

export class DeveloperLaunchWebhookService {
  private static events: DeveloperLaunchEvent[] = [
    {
      developer: 'EMAAR',
      projectName: 'The Oasis Residences',
      totalUnits: 450,
      startingPriceAed: 8500000,
      launchDate: '2026-09-01',
    },
    {
      developer: 'DAMAC',
      projectName: 'DAMAC Islands Mansion',
      totalUnits: 280,
      startingPriceAed: 12000000,
      launchDate: '2026-08-25',
    },
  ];

  public static getActiveLaunches(): DeveloperLaunchEvent[] {
    return this.events;
  }

  public static processInboundWebhook(payload: DeveloperLaunchEvent): boolean {
    this.events.unshift(payload);
    return true;
  }
}
