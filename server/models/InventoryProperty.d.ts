import type { HydratedDocument, Model } from 'mongoose';

type InventoryRecord = Record<string, unknown>;

interface InventoryStatics {
  queryProperties(filters?: Record<string, unknown>): Promise<{
    success: boolean;
    data: InventoryRecord[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }>;
  findByPNumber(pNumber: string): PromiseLike<HydratedDocument<InventoryRecord> | null>;
  getAreaStats(): Promise<InventoryRecord[]>;
  getStatusBreakdown(): Promise<InventoryRecord[]>;
  updateStatus(
    propertyId: string,
    statusUpdate: Record<string, unknown>,
    reason?: string
  ): Promise<InventoryRecord>;
}

declare const InventoryProperty: Model<InventoryRecord> & InventoryStatics;
export default InventoryProperty;
