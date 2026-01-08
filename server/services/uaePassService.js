import axios from 'axios';
import crypto from 'crypto';

class UaePassService {
  constructor() {
    this.clientId = process.env.UAEPASS_CLIENT_ID;
    this.clientSecret = process.env.UAEPASS_CLIENT_SECRET;
    this.redirectUri = process.env.UAEPASS_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/auth/uaepass/callback`;
    this.authUrl = process.env.UAEPASS_AUTH_URL || 'https://stg-id.uaepass.ae/idshub/authorize';
    this.tokenUrl = process.env.UAEPASS_TOKEN_URL || 'https://stg-id.uaepass.ae/idshub/token';
    this.userInfoUrl = process.env.UAEPASS_USERINFO_URL || 'https://stg-id.uaepass.ae/idshub/userinfo';
  }

  isConfigured() {
    return !!(this.clientId && this.clientSecret);
  }

  generateState() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateNonce() {
    return crypto.randomBytes(16).toString('hex');
  }

  getAuthorizationUrl(state, nonce, isMobile = false) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'urn:uae:digitalid:profile:general',
      state: state,
      nonce: nonce,
      acr_values: isMobile 
        ? 'urn:digitalid:authentication:flow:mobile'
        : 'urn:digitalid:authentication:flow:web',
      ui_locales: 'en'
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  getMobileDeepLink(state, nonce) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'urn:uae:digitalid:profile:general',
      state: state,
      nonce: nonce,
      acr_values: 'urn:digitalid:authentication:flow:mobile'
    });

    return `uaepass://authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code) {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret
    });

    try {
      const response = await axios.post(this.tokenUrl, data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      
      return {
        success: true,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('UAE Pass token exchange error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error_description || 'Failed to exchange code for tokens'
      };
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(this.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      const data = response.data;
      
      return {
        success: true,
        user: {
          emiratesId: data.idn,
          firstNameEN: data.firstname_en || data.firstnameEN,
          lastNameEN: data.lastname_en || data.lastnameEN,
          firstNameAR: data.firstname_ar || data.firstnameAR,
          lastNameAR: data.lastname_ar || data.lastnameAR,
          fullNameEN: data.name_en || data.fullnameEN || `${data.firstname_en} ${data.lastname_en}`,
          fullNameAR: data.name_ar || data.fullnameAR,
          email: data.email,
          mobile: data.mobile,
          nationalityEN: data.nationality_en || data.nationalityEN,
          nationalityAR: data.nationality_ar || data.nationalityAR,
          gender: data.gender,
          dateOfBirth: data.dateofbirth || data.dob,
          photo: data.photo,
          verified: true
        }
      };
    } catch (error) {
      console.error('UAE Pass user info error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error_description || 'Failed to fetch user information'
      };
    }
  }

  validateEmiratesId(emiratesId) {
    if (!emiratesId) return false;
    const cleaned = emiratesId.replace(/[-\s]/g, '');
    return /^784\d{12}$/.test(cleaned);
  }
}

export default UaePassService;
