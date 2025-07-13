import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
  authBaseUrl: string;
  apiBaseUrl: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scope: string;
}

export class EGWAuthManager {
  private config: OAuthConfig;
  private tokenFile: string;
  private currentToken: TokenInfo | null = null;

  constructor(config: OAuthConfig, tokenFile?: string) {
    this.config = config;
    this.tokenFile = tokenFile || path.join(process.cwd(), 'data', 'tokens.json');
  }

  /**
   * Generate OAuth authorization URL for interactive auth
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      ...(state && { state })
    });

    return `${this.config.authBaseUrl}/connect/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TokenInfo> {
    try {
      const response = await axios.post<TokenResponse>(`${this.config.authBaseUrl}/connect/token`, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          code: code
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'EGW-Research-Tool/1.0.0'
          }
        });

      const tokenInfo: TokenInfo = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + (response.data.expires_in * 1000),
        scope: response.data.scope
      };

      await this.saveToken(tokenInfo);
      this.currentToken = tokenInfo;

      return tokenInfo;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error}`);
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidToken(): Promise<string> {
    // Load token if not in memory
    if (!this.currentToken) {
      await this.loadToken();
    }

    // Check if token exists and is valid
    if (!this.currentToken) {
      // Try client credentials auth automatically
      console.log('🔐 No token found, attempting client credentials authentication...');
      await this.clientCredentialsAuth();
    }

    // Check if token is expired (with 5-minute buffer)
    if (this.currentToken && Date.now() >= (this.currentToken.expiresAt - 300000)) {
      if (this.currentToken.refreshToken) {
        console.log('🔄 Token expired, refreshing...');
        await this.refreshToken();
      } else {
        console.log('🔐 Token expired, re-authenticating with client credentials...');
        await this.clientCredentialsAuth();
      }
    }

    if (!this.currentToken) {
      throw new Error('Failed to obtain valid authentication token');
    }

    return this.currentToken.accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<TokenInfo> {
    if (!this.currentToken?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<TokenResponse>(`${this.config.authBaseUrl}/connect/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.currentToken.refreshToken
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'EGW-Research-Tool/1.0.0'
          }
        });

      const tokenInfo: TokenInfo = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || this.currentToken.refreshToken,
        expiresAt: Date.now() + (response.data.expires_in * 1000),
        scope: response.data.scope
      };

      await this.saveToken(tokenInfo);
      this.currentToken = tokenInfo;

      return tokenInfo;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error}`);
    }
  }

  /**
   * Authenticate using client credentials flow
   */
  async clientCredentialsAuth(): Promise<TokenInfo> {
    try {
      console.log('🔐 Authenticating with client credentials...');
      
      const response = await axios.post<TokenResponse>(`${this.config.authBaseUrl}/connect/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: this.config.scope
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'EGW-Research-Tool/1.0.0'
          }
        });

      const tokenInfo: TokenInfo = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + (response.data.expires_in * 1000),
        scope: response.data.scope
      };

      await this.saveToken(tokenInfo);
      this.currentToken = tokenInfo;

      console.log('✅ Client credentials authentication successful');
      console.log(`🕒 Token expires: ${new Date(tokenInfo.expiresAt).toISOString()}`);
      console.log(`🔑 Scopes: ${tokenInfo.scope}`);

      return tokenInfo;
    } catch (error) {
      throw new Error(`Failed to authenticate with client credentials: ${error}`);
    }
  }

  /**
   * Save token to file
   */
  private async saveToken(token: TokenInfo): Promise<void> {
    await fs.ensureDir(path.dirname(this.tokenFile));
    await fs.writeJson(this.tokenFile, token, { spaces: 2 });
  }

  /**
   * Load token from file
   */
  private async loadToken(): Promise<void> {
    try {
      if (await fs.pathExists(this.tokenFile)) {
        const savedToken = await fs.readJson(this.tokenFile);
        
        // Check if token is still valid (with 5-minute buffer)
        if (savedToken.expiresAt && Date.now() < (savedToken.expiresAt - 300000)) {
          this.currentToken = savedToken;
          console.log('✅ Loaded valid token from file');
        } else {
          console.log('⚠️  Saved token is expired');
        }
      }
    } catch (error) {
      console.warn('Failed to load saved token:', error);
      this.currentToken = null;
    }
  }

  /**
   * Clear saved token
   */
  async clearToken(): Promise<void> {
    this.currentToken = null;
    if (await fs.pathExists(this.tokenFile)) {
      await fs.remove(this.tokenFile);
    }
  }

  /**
   * Check if authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getValidToken();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get token info for debugging
   */
  getTokenInfo(): TokenInfo | null {
    return this.currentToken;
  }
}

// Create default auth manager instance
export const createAuthManager = (): EGWAuthManager => {
  const config: OAuthConfig = {
    clientId: 'LmuOHIVpIdTXi0qnrtsUtxuUaBqLyvZjgSY91qbC',
    clientSecret: 'JBD8FwEOn6AN4F769gprjujZrZNkSC07HxKlvJvByJlXzS0sDXPBkm2zRChGYXwv9GZq8aux2gDmLQfzaVvcmDsZgYkp6yZ41tN1oIpbclYH8ARACEzFeaNlm835vnCi',
    redirectUri: 'egw://egwwritings.oauthresponse',
    scope: 'writings search studycenter subscriptions user_info',
    authBaseUrl: 'https://cpanel.egwwritings.org',
    apiBaseUrl: 'https://a.egwwritings.org'
  };

  return new EGWAuthManager(config);
};