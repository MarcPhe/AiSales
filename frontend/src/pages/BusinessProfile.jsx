import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BusinessProfile.css';

export default function BusinessProfile({ user, onBack }) {
  const [profile, setProfile] = useState({
    company_name: '',
    industry: '',
    website: '',
    phone: '',
    address: '',
    description: '',
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  const fetchBusinessProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/business-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.profile) {
        setProfile(response.data.profile);
      } else {
        // Pre-fill with company name from user
        setProfile(prev => ({ ...prev, company_name: user.company_name || '' }));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load business profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/business-profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data.profile);
      setSuccess('Business profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save business profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="business-profile">
        <div className="profile-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>Business Profile</h1>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="business-profile">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Business Profile</h1>
      </div>

      <div className="profile-container">
        <form onSubmit={handleSubmit} className="profile-form">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h2>Company Information</h2>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={profile.company_name || ''}
                onChange={handleChange}
                required
                placeholder="Your company name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={profile.industry || ''}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={profile.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address || ''}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="url"
                name="logo_url"
                value={profile.logo_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              {profile.logo_url && (
                <div className="logo-preview">
                  <img src={profile.logo_url} alt="Company Logo" />
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Description</h2>

            <div className="form-group">
              <label>Company Description</label>
              <textarea
                name="description"
                value={profile.description || ''}
                onChange={handleChange}
                placeholder="Tell us about your company, products, or services..."
                rows="6"
              />
              <p className="char-count">{(profile.description || '').length} characters</p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Business Profile'}
            </button>
          </div>
        </form>

        <div className="profile-preview">
          <h2>Preview</h2>
          <div className="preview-card">
            {profile.logo_url && (
              <div className="preview-logo">
                <img src={profile.logo_url} alt="Company Logo" />
              </div>
            )}
            <h3>{profile.company_name || 'Company Name'}</h3>
            {profile.industry && <p className="preview-industry">{profile.industry}</p>}
            {profile.description && (
              <p className="preview-description">{profile.description}</p>
            )}
            <div className="preview-contact">
              {profile.website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                </p>
              )}
              {profile.phone && (
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
              )}
              {profile.address && (
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
