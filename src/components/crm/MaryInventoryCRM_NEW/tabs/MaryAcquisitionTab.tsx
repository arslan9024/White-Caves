import React, { useState } from 'react';
import {
  Home,
  FileText,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Building2,
  Layers,
  PercentCircle,
} from 'lucide-react';
import '../MaryInventoryCRM.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AcquisitionFormData {
  // Property details
  title: string;
  type: string;
  unitNumber: string;
  floorPlan: string;
  area: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;

  // Pricing
  rentalPrice: string;
  commissionPercent: string;
  currency: string;
  availabilityDate: string;

  // Landlord contact
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;

  // Documents
  hasTitleDeed: boolean;
  hasLandlordPassport: boolean;
  hasEjari: boolean;

  // Notes
  notes: string;
}

const PROPERTY_TYPES = [
  'apartment',
  'villa',
  'penthouse',
  'townhouse',
  'commercial',
  'land',
  'studio',
  'duplex',
];

const CURRENCIES = ['AED', 'USD', 'EUR', 'GBP'];

const initialForm: AcquisitionFormData = {
  title: '',
  type: 'apartment',
  unitNumber: '',
  floorPlan: '',
  area: '',
  location: '',
  bedrooms: '1',
  bathrooms: '1',
  sqft: '',
  rentalPrice: '',
  commissionPercent: '5',
  currency: 'AED',
  availabilityDate: '',
  landlordName: '',
  landlordPhone: '',
  landlordEmail: '',
  hasTitleDeed: false,
  hasLandlordPassport: false,
  hasEjari: false,
  notes: '',
};

// ─── Document Flag Banner ─────────────────────────────────────────────────────

function DocumentFlags({ form }: { form: AcquisitionFormData }) {
  const missing = [
    !form.hasTitleDeed && 'Title Deed',
    !form.hasLandlordPassport && 'Landlord Passport',
    !form.hasEjari && 'Ejari',
  ].filter(Boolean) as string[];

  if (missing.length === 0) {
    return (
      <div className="doc-flags-banner doc-flags-ok">
        <CheckCircle size={16} />
        <span>All required documents confirmed.</span>
      </div>
    );
  }

  return (
    <div className="doc-flags-banner doc-flags-warn">
      <AlertTriangle size={16} />
      <span>
        <strong>Missing Documents:</strong> {missing.join(', ')} — property will be
        flagged as incomplete.
      </span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const MaryAcquisitionTab: React.FC = () => {
  const [form, setForm] = useState<AcquisitionFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        type: form.type,
        unitNumber: form.unitNumber || undefined,
        floorPlan: form.floorPlan || undefined,
        area: form.area || undefined,
        location: form.location,
        bedrooms: parseInt(form.bedrooms, 10) || 0,
        bathrooms: parseInt(form.bathrooms, 10) || 0,
        sqft: parseInt(form.sqft, 10) || 0,
        price: parseFloat(form.rentalPrice) || 0,
        rentalPrice: parseFloat(form.rentalPrice) || undefined,
        commissionPercent: parseFloat(form.commissionPercent) || 5,
        currency: form.currency,
        availabilityDate: form.availabilityDate || undefined,
        agentName: form.landlordName || undefined,
        inventoryStage: 'draft_collected',
        titleDeedMissing: !form.hasTitleDeed,
        landlordPassportMissing: !form.hasLandlordPassport,
        ejariMissing: !form.hasEjari,
        description: form.notes || undefined,
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error: ${res.status}`);
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mary-acquisition-tab">
        <div className="acquisition-success">
          <CheckCircle size={48} color="#10b981" />
          <h3>Property Acquired!</h3>
          <p>
            The property has been added to inventory as{' '}
            <strong>Draft / Collected</strong>. @Mary will process it for
            verification.
          </p>
          <button
            className="action-btn primary"
            onClick={() => setSubmitted(false)}
          >
            Add Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mary-acquisition-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Property Acquisition Form</h3>
          <p className="header-subtitle">
            Collect landlord property details and add to pending inventory
          </p>
        </div>
      </div>

      <form className="acquisition-form" onSubmit={handleSubmit} noValidate>
        {/* Document Flags Banner */}
        <DocumentFlags form={form} />

        {/* ── Property Details ── */}
        <section className="form-section">
          <h4 className="form-section-title">
            <Building2 size={16} /> Property Details
          </h4>

          <div className="form-row form-row-2">
            <label className="form-label">
              Property Title *
              <input
                className="form-input"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 2BR Apartment in Downtown Dubai"
                required
              />
            </label>
            <label className="form-label">
              Property Type *
              <select
                className="form-input"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row form-row-3">
            <label className="form-label">
              <Home size={14} /> Unit Number
              <input
                className="form-input"
                type="text"
                name="unitNumber"
                value={form.unitNumber}
                onChange={handleChange}
                placeholder="e.g. A-1204"
              />
            </label>
            <label className="form-label">
              <Layers size={14} /> Floor Plan
              <input
                className="form-input"
                type="text"
                name="floorPlan"
                value={form.floorPlan}
                onChange={handleChange}
                placeholder="e.g. 2BR-TypeA"
              />
            </label>
            <label className="form-label">
              Size (sqft)
              <input
                className="form-input"
                type="number"
                name="sqft"
                value={form.sqft}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </label>
          </div>

          <div className="form-row form-row-2">
            <label className="form-label">
              Area / Community
              <input
                className="form-input"
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="e.g. Dubai Marina"
              />
            </label>
            <label className="form-label">
              Full Location *
              <input
                className="form-input"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Marina Gate Tower 1, Dubai Marina"
                required
              />
            </label>
          </div>

          <div className="form-row form-row-2">
            <label className="form-label">
              Bedrooms
              <input
                className="form-input"
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                min="0"
              />
            </label>
            <label className="form-label">
              Bathrooms
              <input
                className="form-input"
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                min="0"
              />
            </label>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="form-section">
          <h4 className="form-section-title">
            <DollarSign size={16} /> Pricing & Availability
          </h4>

          <div className="form-row form-row-3">
            <label className="form-label">
              Rental Price (Annual) *
              <input
                className="form-input"
                type="number"
                name="rentalPrice"
                value={form.rentalPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </label>
            <label className="form-label">
              Currency
              <select
                className="form-input"
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="form-label">
              <PercentCircle size={14} /> Commission %
              <input
                className="form-input"
                type="number"
                name="commissionPercent"
                value={form.commissionPercent}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
              />
            </label>
          </div>

          <div className="form-row form-row-2">
            <label className="form-label">
              <Calendar size={14} /> Availability Date
              <input
                className="form-input"
                type="date"
                name="availabilityDate"
                value={form.availabilityDate}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        {/* ── Landlord Contact ── */}
        <section className="form-section">
          <h4 className="form-section-title">
            <User size={16} /> Landlord Contact
          </h4>

          <div className="form-row form-row-3">
            <label className="form-label">
              <User size={14} /> Landlord Name
              <input
                className="form-input"
                type="text"
                name="landlordName"
                value={form.landlordName}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </label>
            <label className="form-label">
              <Phone size={14} /> Phone
              <input
                className="form-input"
                type="tel"
                name="landlordPhone"
                value={form.landlordPhone}
                onChange={handleChange}
                placeholder="+971 50 000 0000"
              />
            </label>
            <label className="form-label">
              <Mail size={14} /> Email
              <input
                className="form-input"
                type="email"
                name="landlordEmail"
                value={form.landlordEmail}
                onChange={handleChange}
                placeholder="landlord@email.com"
              />
            </label>
          </div>
        </section>

        {/* ── Document Checklist ── */}
        <section className="form-section">
          <h4 className="form-section-title">
            <FileText size={16} /> Document Checklist
          </h4>
          <p className="form-section-hint">
            Tick only documents already received. Missing items will be flagged.
          </p>

          <div className="doc-checklist">
            <label className="doc-check-item">
              <input
                type="checkbox"
                name="hasTitleDeed"
                checked={form.hasTitleDeed}
                onChange={handleChange}
              />
              <span>Title Deed</span>
            </label>
            <label className="doc-check-item">
              <input
                type="checkbox"
                name="hasLandlordPassport"
                checked={form.hasLandlordPassport}
                onChange={handleChange}
              />
              <span>Landlord Passport / Emirates ID</span>
            </label>
            <label className="doc-check-item">
              <input
                type="checkbox"
                name="hasEjari"
                checked={form.hasEjari}
                onChange={handleChange}
              />
              <span>Ejari</span>
            </label>
          </div>
        </section>

        {/* ── Notes ── */}
        <section className="form-section">
          <h4 className="form-section-title">Additional Notes</h4>
          <textarea
            className="form-input form-textarea"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional information about the property or landlord..."
          />
        </section>

        {error && (
          <div className="acquisition-error">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="action-btn"
            onClick={() => setForm(initialForm)}
            disabled={submitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="action-btn primary"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : '+ Add to Inventory'}
          </button>
        </div>
      </form>
    </div>
  );
};

MaryAcquisitionTab.displayName = 'MaryAcquisitionTab';

export default MaryAcquisitionTab;
