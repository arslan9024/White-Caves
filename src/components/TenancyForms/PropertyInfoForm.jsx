import React from 'react';
import '../Styles/TenancyForms.css';

const PropertyInfoForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value
    });
  };

  return (
    <div className="form-section">
      <h2>📍 Property Information</h2>

      <div className="form-group">
        <label>Property Description *</label>
        <input
          type="text"
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="e.g., 2BR Apartment, 3BR Villa"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Street Address *</label>
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="e.g., Al Manara Street"
            required
          />
        </div>
        <div className="form-group">
          <label>City *</label>
          <select name="city" value={data.city} onChange={handleChange} required>
            <option value="">Select City</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Emirate *</label>
          <select name="emirate" value={data.emirate} onChange={handleChange} required>
            <option value="">Select Emirate</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
          </select>
        </div>
        <div className="form-group">
          <label>Property Type *</label>
          <select name="propertyType" value={data.propertyType} onChange={handleChange} required>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Studio">Studio</option>
            <option value="Office">Office</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Building Number</label>
          <input
            type="text"
            name="buildingNumber"
            value={data.buildingNumber}
            onChange={handleChange}
            placeholder="e.g., B-2"
          />
        </div>
        <div className="form-group">
          <label>Plot/Building Plot Number</label>
          <input
            type="text"
            name="plotNumber"
            value={data.plotNumber}
            onChange={handleChange}
            placeholder="e.g., 1234"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Floor Number</label>
          <input
            type="text"
            name="floorNumber"
            value={data.floorNumber}
            onChange={handleChange}
            placeholder="e.g., 5th"
          />
        </div>
        <div className="form-group">
          <label>Unit/Apartment Number</label>
          <input
            type="text"
            name="unitNumber"
            value={data.unitNumber}
            onChange={handleChange}
            placeholder="e.g., 501"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Unit Area (sq.ft) *</label>
          <input
            type="number"
            name="unitArea"
            value={data.unitArea}
            onChange={handleChange}
            placeholder="e.g., 1500"
            required
          />
        </div>
        <div className="form-group">
          <label>Furnished Status *</label>
          <select name="furnished" value={data.furnished} onChange={handleChange} required>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Furnished">Furnished</option>
            <option value="Semifurnished">Semi-furnished</option>
          </select>
        </div>
      </div>

      <div className="form-help">
        <p>💡 Tip: All marked with * are required fields. Ensure accurate property details as per EJARI registration.</p>
      </div>
    </div>
  );
};

export default PropertyInfoForm;
