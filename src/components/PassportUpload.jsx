
import React, { useState } from 'react';
import './PassportUpload.css';
import Loading from './Loading';

export default function PassportUpload({ userId, onUploadComplete }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [passportData, setPassportData] = useState({
    documentNumber: '',
    expiryDate: '',
    file: null
  });

  const handleFileChange = (e) => {
    setPassportData({
      ...passportData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    const formData = new FormData();
    formData.append('documentNumber', passportData.documentNumber);
    formData.append('expiryDate', passportData.expiryDate);
    formData.append('file', passportData.file);

    try {
      const response = await fetch(`/api/users/${userId}/passport`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        onUploadComplete && onUploadComplete();
        setStatusMsg('Passport uploaded successfully!');
      } else {
        setStatusMsg('Failed to upload passport');
      }
    } catch (error) {
      setStatusMsg('Error uploading passport');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="passport-upload">
      <h3>Upload Passport</h3>
      <p>Please upload your passport to verify your profile</p>
      {statusMsg && <div className="status-msg">{statusMsg}</div>}
      
      <form onSubmit={handleSubmit} className="passport-form">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          required
        />
        
        <input
          type="text"
          placeholder="Passport Number"
          value={passportData.documentNumber}
          onChange={(e) => setPassportData({...passportData, documentNumber: e.target.value})}
          required
        />
        
        <input
          type="date"
          placeholder="Expiry Date"
          value={passportData.expiryDate}
          onChange={(e) => setPassportData({...passportData, expiryDate: e.target.value})}
          required
        />
        
        <button type="submit">Upload Passport</button>
      </form>
    </div>
  );
}
