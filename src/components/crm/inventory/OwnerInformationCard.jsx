import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import './OwnerInformationCard.css';

const OwnerInformationCard = ({ owner, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: owner?.name || '',
    nationality: owner?.nationality || '',
    country: owner?.country || '',
    emails: owner?.emails || [],
    phones: owner?.phones || [],
    notes: owner?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const countries = [
    'UAE',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'India',
    'Pakistan',
    'Philippines',
    'Other',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.emails.length === 0) newErrors.emails = 'At least one email is required';
    if (formData.phones.length === 0) newErrors.phones = 'At least one phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?[\d\s\-()]{7,}$/;
    return regex.test(phone.replace(/\s/g, ''));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    if (!validateEmail(newEmail)) {
      setErrors((prev) => ({
        ...prev,
        newEmail: 'Invalid email format',
      }));
      return;
    }
    if (formData.emails.includes(newEmail)) {
      setErrors((prev) => ({
        ...prev,
        newEmail: 'Email already added',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, newEmail],
    }));
    setNewEmail('');
    setErrors((prev) => ({
      ...prev,
      newEmail: '',
    }));
  };

  const handleRemoveEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.filter((e) => e !== email),
    }));
  };

  const handleAddPhone = () => {
    if (!newPhone.trim()) return;
    if (!validatePhone(newPhone)) {
      setErrors((prev) => ({
        ...prev,
        newPhone: 'Invalid phone format',
      }));
      return;
    }
    if (formData.phones.includes(newPhone)) {
      setErrors((prev) => ({
        ...prev,
        newPhone: 'Phone already added',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, newPhone],
    }));
    setNewPhone('');
    setErrors((prev) => ({
      ...prev,
      newPhone: '',
    }));
  };

  const handleRemovePhone = (phone) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((p) => p !== phone),
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update owner' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: owner?.name || '',
      nationality: owner?.nationality || '',
      country: owner?.country || '',
      emails: owner?.emails || [],
      phones: owner?.phones || [],
      notes: owner?.notes || '',
    });
    setNewEmail('');
    setNewPhone('');
    setErrors({});
    setIsEditing(false);
  };

  if (!owner) {
    return (
      <div className="owner-information-card empty">
        <div className="empty-state">
          <User size={48} />
          <p>No owner selected</p>
        </div>
      </div>
    );
  }

  const isVerified = owner?.isVerified || false;

  return (
    <div className="owner-information-card">
      <div className="card-header">
        <div className="header-title">
          <User size={24} />
          <div>
            <h2>Owner Information</h2>
            {isVerified && (
              <div className="verification-badge">
                <CheckCircle size={14} />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            className="btn-edit"
            onClick={() => setIsEditing(true)}
            title="Edit owner"
          >
            <Edit size={18} />
          </button>
        )}
      </div>

      {errors.submit && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{errors.submit}</span>
        </div>
      )}

      {isEditing ? (
        <div className="form-section">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              <User size={16} /> Full Name
              {errors.name && <span className="error-text">{errors.name}</span>}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Owner name"
              className={errors.name ? 'input-error' : ''}
            />
          </div>

          {/* Nationality & Country */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nationality">
                <Shield size={16} /> Nationality
              </label>
              <input
                id="nationality"
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="e.g., Emirati"
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">
                <MapPin size={16} /> Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emails */}
          <div className="form-group">
            <label>
              <Mail size={16} /> Email Addresses
              {errors.emails && <span className="error-text">{errors.emails}</span>}
            </label>
            <div className="contact-input-group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Add email address"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                className={errors.newEmail ? 'input-error' : ''}
              />
              <button
                type="button"
                className="btn-add"
                onClick={handleAddEmail}
                title="Add email"
              >
                <Plus size={18} />
              </button>
            </div>
            {errors.newEmail && <span className="error-text">{errors.newEmail}</span>}
            <div className="contact-list">
              {formData.emails.map((email) => (
                <div key={email} className="contact-item">
                  <Mail size={14} />
                  <span>{email}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveEmail(email)}
                    title="Remove email"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phones */}
          <div className="form-group">
            <label>
              <Phone size={16} /> Phone Numbers
              {errors.phones && <span className="error-text">{errors.phones}</span>}
            </label>
            <div className="contact-input-group">
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Add phone number"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
                className={errors.newPhone ? 'input-error' : ''}
              />
              <button
                type="button"
                className="btn-add"
                onClick={handleAddPhone}
                title="Add phone"
              >
                <Plus size={18} />
              </button>
            </div>
            {errors.newPhone && <span className="error-text">{errors.newPhone}</span>}
            <div className="contact-list">
              {formData.phones.map((phone) => (
                <div key={phone} className="contact-item">
                  <Phone size={14} />
                  <span>{phone}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemovePhone(phone)}
                    title="Remove phone"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional owner information..."
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="info-section">
          {/* Name */}
          <div className="info-item">
            <span className="info-label">
              <User size={16} /> Name
            </span>
            <span className="info-value">{owner.name || 'Not specified'}</span>
          </div>

          {/* Nationality & Country */}
          {(owner.nationality || owner.country) && (
            <div className="info-row">
              {owner.nationality && (
                <div className="info-item">
                  <span className="info-label">
                    <Shield size={16} /> Nationality
                  </span>
                  <span className="info-value">{owner.nationality}</span>
                </div>
              )}
              {owner.country && (
                <div className="info-item">
                  <span className="info-label">
                    <MapPin size={16} /> Country
                  </span>
                  <span className="info-value">{owner.country}</span>
                </div>
              )}
            </div>
          )}

          {/* Emails */}
          {owner.emails && owner.emails.length > 0 && (
            <div className="info-item full-width">
              <span className="info-label">
                <Mail size={16} /> Emails
              </span>
              <div className="contact-list">
                {owner.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="contact-link">
                    <Mail size={14} />
                    <span>{email}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Phones */}
          {owner.phones && owner.phones.length > 0 && (
            <div className="info-item full-width">
              <span className="info-label">
                <Phone size={16} /> Phones
              </span>
              <div className="contact-list">
                {owner.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="contact-link">
                    <Phone size={14} />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {owner.notes && (
            <div className="info-item full-width">
              <span className="info-label">Notes</span>
              <p className="info-description">{owner.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerInformationCard;
