/**
 * REPropertyDetailModal.tsx
 * 7-Category Architecture: View Layer (Property Unit Inspection Modal)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  X,
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';
import type { REPropertyNode, REPropertyStatus } from './REPropertyManager.types';

interface REPropertyDetailModalProps {
  property: REPropertyNode | null;
  onClose: () => void;
  onAdvanceStatus: (id: string, newStatus: REPropertyStatus) => void;
  onOpenEdit?: (property: REPropertyNode) => void;
}

export const REPropertyDetailModal: FC<REPropertyDetailModalProps> = ({
  property,
  onClose,
  onAdvanceStatus,
  onOpenEdit,
}) => {
  if (!property) return null;

  const formatPrice = (price: number) => `AED ${price.toLocaleString()}`;
  const pricePerSqft = Math.round(property.priceAED / property.areaSqft);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      data-testid="property-detail-modal"
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {property.repropertyId}
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {property.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin size={12} className="text-amber-400" />
                <span>
                  {property.location} • {property.subLocation}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            data-testid="close-property-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hero Banner with Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-64 rounded-xl overflow-hidden relative bg-slate-950 border border-slate-800">
              <img
                src={
                  property.images[0] ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                }
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-xs font-bold text-white">
                  {property.purpose === 'BUY' ? 'FOR SALE' : 'FOR LEASE'}
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/80 text-slate-950 text-xs font-bold">
                  {property.propertyType}
                </span>
              </div>
            </div>

            {/* Quick Financial Deck */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Listing Valuation
                </span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {formatPrice(property.priceAED)}
                  {property.purpose === 'RENT' && (
                    <span className="text-xs font-normal text-slate-400"> / year</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated AED {pricePerSqft.toLocaleString()} / sqft
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Built-up Area:</span>
                  <span className="text-white font-mono">
                    {property.areaSqft.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bedrooms:</span>
                  <span className="text-white font-mono">{property.bedrooms} Beds</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bathrooms:</span>
                  <span className="text-white font-mono">{property.bathrooms} Baths</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Developer:</span>
                  <span className="text-white font-semibold">{property.developer}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="pt-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Inventory State
                </label>
                <select
                  value={property.status}
                  onChange={e =>
                    onAdvanceStatus(property.repropertyId, e.target.value as REPropertyStatus)
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-400 font-bold focus:outline-none"
                  data-testid="property-status-select"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNDER_OFFER">UNDER OFFER</option>
                  <option value="SOLD">SOLD</option>
                  <option value="LEASED">LEASED</option>
                  <option value="OFF_MARKET">OFF MARKET</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statutory & Regulatory Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                RERA Trakheesi Permit
              </span>
              <p className="text-xs font-mono font-bold text-emerald-400">
                {property.trakheesiPermit}
              </p>
              <span className="text-[10px] text-slate-500">Government Ad Permit Active</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <FileText size={12} className="text-blue-400" />
                DLD Title Deed / Oqood
              </span>
              <p className="text-xs font-mono font-bold text-blue-400">
                {property.dldTitleDeedNumber}
              </p>
              <span className="text-[10px] text-slate-500">Verified Blockchain Registry</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <UserCheck size={12} className="text-amber-400" />
                Assigned Executive Broker
              </span>
              <p className="text-xs font-bold text-slate-200">
                {property.assignedBroker} ({property.supervisorCode})
              </p>
              <span className="text-[10px] text-slate-500">Pillar IV / Luxury Sales</span>
            </div>
          </div>

          {/* Description & Features */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Property Description & Architectural Overview
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{property.description}</p>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Luxury Amenities & Specifications
              </span>
              <div className="flex flex-wrap gap-2">
                {property.features.map(feat => (
                  <span
                    key={feat}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Created: {property.createdAt} • White Caves Sovereign Inventory
          </div>
          <div className="flex gap-2">
            {onOpenEdit && (
              <button
                onClick={() => onOpenEdit(property)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Edit Specs
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
