/**
 * REPropertyEditDrawer.tsx
 * 7-Category Architecture: View Layer (Property Inventory Add/Edit Drawer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import type { REPropertyNode, REPropertyType, REPropertyPurpose } from './REPropertyManager.types';
import { PROPERTY_TYPES, PROPERTY_LOCATIONS } from './REPropertyManager.data';

interface REPropertyEditDrawerProps {
  isOpen: boolean;
  property: REPropertyNode | null;
  onClose: () => void;
  onSave: (payload: Omit<REPropertyNode, '_id' | 'repropertyId' | 'createdAt'>) => void;
  onUpdate?: (id: string, patch: Partial<REPropertyNode>) => void;
}

export const REPropertyEditDrawer: FC<REPropertyEditDrawerProps> = ({
  isOpen,
  property,
  onClose,
  onSave,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'VILLA' as REPropertyType,
    purpose: 'BUY' as REPropertyPurpose,
    status: 'AVAILABLE' as const,
    location: 'Palm Jumeirah',
    subLocation: 'Beachfront',
    priceAED: 25000000,
    areaSqft: 6500,
    bedrooms: 5,
    bathrooms: 6,
    developer: 'Emaar Properties',
    completionStatus: 'READY' as const,
    trakheesiPermit: 'TRAK-8810294-A',
    dldTitleDeedNumber: 'TD-991024',
    assignedBroker: 'Layla Mansoori',
    supervisorCode: 'SUP-01',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Luxury turnkey Dubai residence with premium architectural finishes.',
    features: ['Private Pool', 'Smart Home', 'Balcony', 'Covered Parking'],
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        propertyType: property.propertyType,
        purpose: property.purpose,
        status: property.status as any,
        location: property.location,
        subLocation: property.subLocation,
        priceAED: property.priceAED,
        areaSqft: property.areaSqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        developer: property.developer,
        completionStatus: property.completionStatus,
        trakheesiPermit: property.trakheesiPermit,
        dldTitleDeedNumber: property.dldTitleDeedNumber,
        assignedBroker: property.assignedBroker,
        supervisorCode: property.supervisorCode,
        featured: property.featured,
        images: property.images,
        description: property.description,
        features: property.features,
      });
    } else {
      setFormData({
        title: '',
        propertyType: 'VILLA',
        purpose: 'BUY',
        status: 'AVAILABLE',
        location: 'Palm Jumeirah',
        subLocation: 'Beachfront Frond',
        priceAED: 25000000,
        areaSqft: 6500,
        bedrooms: 5,
        bathrooms: 6,
        developer: 'Emaar Properties',
        completionStatus: 'READY',
        trakheesiPermit: `TRAK-${Date.now().toString().slice(-7)}-A`,
        dldTitleDeedNumber: `TD-${Date.now().toString().slice(-6)}`,
        assignedBroker: 'Layla Mansoori',
        supervisorCode: 'SUP-01',
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
        description: 'Luxury turnkey Dubai residence with premium architectural finishes.',
        features: ['Private Pool', 'Smart Home', 'Balcony', 'Covered Parking'],
      });
    }
  }, [property]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (property && onUpdate) {
      onUpdate(property.repropertyId, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end"
      data-testid="property-edit-drawer"
    >
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              {property ? <Save size={18} /> : <Plus size={18} />}
            </span>
            <h2 className="text-base font-bold text-white">
              {property ? `Edit Property (${property.repropertyId})` : 'Register New Property Unit'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Property Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Palm Jumeirah Ultra-Luxury Frond Villa"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              data-testid="input-property-title"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Purpose</label>
              <select
                value={formData.purpose}
                onChange={e =>
                  setFormData({ ...formData, purpose: e.target.value as REPropertyPurpose })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="BUY">BUY (For Sale)</option>
                <option value="RENT">RENT (For Lease)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Property Type
              </label>
              <select
                value={formData.propertyType}
                onChange={e =>
                  setFormData({ ...formData, propertyType: e.target.value as REPropertyType })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {PROPERTY_TYPES.filter(t => t !== 'All Types').map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Price (AED)</label>
              <input
                type="number"
                required
                value={formData.priceAED}
                onChange={e =>
                  setFormData({ ...formData, priceAED: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                data-testid="input-property-price"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Area (Sqft)</label>
              <input
                type="number"
                required
                value={formData.areaSqft}
                onChange={e =>
                  setFormData({ ...formData, areaSqft: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Location Community
              </label>
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {PROPERTY_LOCATIONS.filter(l => l !== 'All Locations').map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Sub-Location</label>
              <input
                type="text"
                value={formData.subLocation}
                onChange={e => setFormData({ ...formData, subLocation: e.target.value })}
                placeholder="e.g. Frond N Beachfront"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={e =>
                  setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={e =>
                  setFormData({ ...formData, bathrooms: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Trakheesi Permit #
              </label>
              <input
                type="text"
                value={formData.trakheesiPermit}
                onChange={e => setFormData({ ...formData, trakheesiPermit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Title Deed #</label>
              <input
                type="text"
                value={formData.dldTitleDeedNumber}
                onChange={e => setFormData({ ...formData, dldTitleDeedNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            data-testid="submit-property-btn"
          >
            <Save size={14} />
            <span>{property ? 'Save Property Changes' : 'Confirm & Register Property'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
