import axios from 'axios';
import crypto from 'crypto';

// Token response interface from UAE Pass
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// User info response interface from UAE Pass
interface UaePassUserData {
  idn: string;
  firstname_en?: string;
  firstnameEN?: string;
  lastname_en?: string;
  lastnameEN?: string;
  firstname_ar?: string;
  firstnameAR?: string;
  lastname_ar?: string;
  lastnameAR?: string;
  name_en?: string;
  fullnameEN?: string;
  name_ar?: string;
  fullnameAR?: string;
  email: string;
  mobile: string;
  nationality_en?: string;
  nationalityEN?: string;
  nationality_ar?: string;
  nationalityAR?: string;
  gender: string;
  dateofbirth?: string;
  dob?: string;
  photo: string;
}

// Normalized user object interface
interface NormalizedUaePassUser {
  emiratesId: string;
  firstNameEN: string;
  lastNameEN: string;
  firstNameAR: string;
  lastNameAR: string;
  fullNameEN: string;
  fullNameAR: string;
  email: string;
  mobile: string;
  nationalityEN: string;
  nationalityAR: string;
  gender: string;
  dateOfBirth: string;
  photo: string;
  verified: boolean;
}

// Token exchange result interface
interface TokenExchangeResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  error?: string;
}

// User info result interface
interface UserInfoResult {
  success: boolean;
  user?: NormalizedUaePassUser;
  error?: string;
}

class UaePassService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private redirectUri: string;
  private authUrl: string;
  private tokenUrl: string;
  private userInfoUrl: string;

  constructor() {
    this.clientId = process.env.UAEPASS_CLIENT_ID;
    this.clientSecret = process.env.UAEPASS_CLIENT_SECRET;
    this.redirectUri =
      process.env.UAEPASS_REDIRECT_URI ||
      `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/auth/uaepass/callback`;
    this.authUrl = process.env.UAEPASS_AUTH_URL || 'https://stg-id.uaepass.ae/idshub/authorize';
    this.tokenUrl = process.env.UAEPASS_TOKEN_URL || 'https://stg-id.uaepass.ae/idshub/token';
    this.userInfoUrl =
      process.env.UAEPASS_USERINFO_URL || 'https://stg-id.uaepass.ae/idshub/userinfo';
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  getAuthorizationUrl(state: string, nonce: string, isMobile: boolean = false): string {
    const params = new URLSearchParams({
      client_id: this.clientId || '',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'urn:uae:digitalid:profile:general',
      state,
      nonce,
      acr_values: isMobile
        ? 'urn:digitalid:authentication:flow:mobile'
        : 'urn:digitalid:authentication:flow:web',
      ui_locales: 'en'
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  getMobileDeepLink(state: string, nonce: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId || '',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'urn:uae:digitalid:profile:general',
      state,
      nonce,
      acr_values: 'urn:digitalid:authentication:flow:mobile'
    });

    return `uaepass://authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<TokenExchangeResult> {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId || '',
      client_secret: this.clientSecret || ''
    });

    try {
      const response = await axios.post<TokenResponse>(this.tokenUrl, data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        }
      });

      return {
        success: true,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            error_description?: string;
          };
        };
        message?: string;
      };
      console.error(
        'UAE Pass token exchange error:',
        axiosError.response?.data || axiosError.message
      );
      return {
        success: false,
        error:
          axiosError.response?.data?.error_description || 'Failed to exchange code for tokens'
      };
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfoResult> {
    try {
      const response = await axios.get<UaePassUserData>(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      });

      const data = response.data;

      return {
        success: true,
        user: {
          emiratesId: data.idn,
          firstNameEN: data.firstname_en || data.firstnameEN || '',
          lastNameEN: data.lastname_en || data.lastnameEN || '',
          firstNameAR: data.firstname_ar || data.firstnameAR || '',
          lastNameAR: data.lastname_ar || data.lastnameAR || '',
          fullNameEN:
            data.name_en ||
            data.fullnameEN ||
            `${data.firstname_en || ''} ${data.lastname_en || ''}`.trim(),
          fullNameAR: data.name_ar || data.fullnameAR || '',
          email: data.email,
          mobile: data.mobile,
          nationalityEN: data.nationality_en || data.nationalityEN || '',
          nationalityAR: data.nationality_ar || data.nationalityAR || '',
          gender: data.gender,
          dateOfBirth: data.dateofbirth || data.dob || '',
          photo: data.photo,
          verified: true
        }
      };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            error_description?: string;
          };
        };
        message?: string;
      };
      console.error(
        'UAE Pass user info error:',
        axiosError.response?.data || axiosError.message
      );
      return {
        success: false,
        error: axiosError.response?.data?.error_description || 'Failed to fetch user information'
      };
    }
  }

  validateEmiratesId(emiratesId: string): boolean {
    if (!emiratesId) return false;
    const cleaned = emiratesId.replace(/[-\s]/g, '');
    return /^784\d{12}$/.test(cleaned);
  }
}

export default UaePassService;
