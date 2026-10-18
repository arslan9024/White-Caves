import type { Model } from 'mongoose';

interface TransactionRecord {
  transactionNumber: string;
  instanceDate: Date;
  group: 'Sales' | 'Mortgage' | 'Gift' | 'Other';
  procedure: string;
  isOffplan: 'Off-Plan' | 'Ready';
  isFreehold: 'Free Hold' | 'Leasehold';
  usage: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed';
  area: string;
  propType: 'Unit' | 'Building' | 'Land';
  propSubType: 'Flat' | 'Villa' | 'Townhouse' | 'Penthouse' | 'Studio' | 'Office' | 'Shop' | 'Warehouse' | 'Hotel Rooms' | 'Plot' | 'Other';
  transValue: number;
  procedureArea: number;
  actualArea: number;
  rooms: string;
  parking: string;
  nearestMetro: string;
  nearestMall: string;
  nearestLandmark: string;
  totalBuyer: number;
  totalSeller: number;
  masterProject: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
}

declare const Transaction: Model<TransactionRecord>;
export default Transaction;
