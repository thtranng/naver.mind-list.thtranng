import { AppState } from '@/types';

// Google Drive API configuration
const GOOGLE_DRIVE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || '',
  API_KEY: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || '',
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  SCOPES: 'https://www.googleapis.com/auth/drive.file'
};

interface CloudStorageResult {
  success: boolean;
  message: string;
  data?: any;
}

interface GoogleAuthInstance {
  isSignedIn: {
    get(): boolean;
    listen(callback: (isSignedIn: boolean) => void): void;
  };
  signIn(): Promise<any>;
  signOut(): Promise<any>;
  currentUser: {
    get(): any;
  };
}

interface GoogleAPI {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (config: any) => Promise<void>;
    drive: {
      files: {
        create: (params: any) => Promise<any>;
        get: (params: any) => Promise<any>;
        list: (params: any) => Promise<any>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<any>;
      };
    };
  };
  auth2: {
    getAuthInstance(): GoogleAuthInstance;
  };
}

declare global {
  interface Window {
    gapi: GoogleAPI;
  }
}

class CloudStorageService {
  private isInitialized = false;
  private authInstance: GoogleAuthInstance | null = null;
  private readonly APP_DATA_FOLDER = 'MindListApp';
  private readonly DATA_FILE_NAME = 'user_data.json';

  /**
   * Initialize Google Drive API
   */
  async initialize(): Promise<CloudStorageResult> {
    try {
      if (this.isInitialized) {
        return { success: true, message: 'Already initialized' };
      }

      // Load Google API script if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPIScript();
      }

      // Initialize the API client
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
              clientId: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
              discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_DOC],
              scope: GOOGLE_DRIVE_CONFIG.SCOPES
            });
            
            this.authInstance = window.gapi.auth2.getAuthInstance();
            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      return { success: true, message: 'Google Drive API initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      return {
        success: false,
        message: `Failed to initialize: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Load Google API script dynamically
   */
  private loadGoogleAPIScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Authenticate user with Google
   */
  async authenticate(): Promise<CloudStorageResult> {
    try {
      if (!this.isInitialized) {
        const initResult = await this.initialize();
        if (!initResult.success) {
          return initResult;
        }
      }

      if (!this.authInstance) {
        return { success: false, message: 'Authentication instance not available' };
      }

      if (this.authInstance.isSignedIn.get()) {
        return { success: true, message: 'Already authenticated' };
      }

      await this.authInstance.signIn();
      return { success: true, message: 'Authentication successful' };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Sign out from Google
   */
  async signOut(): Promise<CloudStorageResult> {
    try {
      if (!this.authInstance) {
        return { success: false, message: 'Not authenticated' };
      }

      await this.authInstance.signOut();
      return { success: true, message: 'Signed out successfully' };
    } catch (error) {
      console.error('Sign out failed:', error);
      return {
        success: false,
        message: `Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authInstance?.isSignedIn.get() || false;
  }

  /**
   * Upload user data to Google Drive
   */
  async uploadUserData(userData: AppState): Promise<CloudStorageResult> {
    try {
      if (!this.isAuthenticated()) {
        const authResult = await this.authenticate();
        if (!authResult.success) {
          return authResult;
        }
      }

      // Convert user data to JSON
      const dataToUpload = {
        ...userData,
        lastSyncTime: new Date().toISOString(),
        version: '1.0'
      };

      const fileContent = JSON.stringify(dataToUpload, null, 2);
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      // Check if file already exists
      const existingFile = await this.findDataFile();
      
      let response;
      if (existingFile) {
        // Update existing file
        const metadata = {
          name: this.DATA_FILE_NAME,
          parents: [await this.getOrCreateAppFolder()]
        };

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          close_delim;

        response = await window.gapi.client.drive.files.update({
          fileId: existingFile.id,
          uploadType: 'multipart',
          body: multipartRequestBody
        });
      } else {
        // Create new file
        const metadata = {
          name: this.DATA_FILE_NAME,
          parents: [await this.getOrCreateAppFolder()]
        };

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          close_delim;

        response = await window.gapi.client.drive.files.create({
          uploadType: 'multipart',
          body: multipartRequestBody
        });
      }

      return {
        success: true,
        message: 'Data uploaded successfully',
        data: response.result
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Download user data from Google Drive
   */
  async downloadUserData(): Promise<CloudStorageResult> {
    try {
      if (!this.isAuthenticated()) {
        const authResult = await this.authenticate();
        if (!authResult.success) {
          return authResult;
        }
      }

      const dataFile = await this.findDataFile();
      if (!dataFile) {
        return {
          success: false,
          message: 'No data file found in Google Drive'
        };
      }

      const response = await window.gapi.client.drive.files.get({
        fileId: dataFile.id,
        alt: 'media'
      });

      const userData = JSON.parse(response.body);
      return {
        success: true,
        message: 'Data downloaded successfully',
        data: userData
      };
    } catch (error) {
      console.error('Download failed:', error);
      return {
        success: false,
        message: `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Find the app's data file in Google Drive
   */
  private async findDataFile(): Promise<any> {
    try {
      const appFolderId = await this.getOrCreateAppFolder();
      const response = await window.gapi.client.drive.files.list({
        q: `name='${this.DATA_FILE_NAME}' and parents in '${appFolderId}' and trashed=false`,
        spaces: 'drive'
      });

      return response.result.files && response.result.files.length > 0 
        ? response.result.files[0] 
        : null;
    } catch (error) {
      console.error('Error finding data file:', error);
      return null;
    }
  }

  /**
   * Get or create the app folder in Google Drive
   */
  private async getOrCreateAppFolder(): Promise<string> {
    try {
      // Search for existing folder
      const response = await window.gapi.client.drive.files.list({
        q: `name='${this.APP_DATA_FOLDER}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        spaces: 'drive'
      });

      if (response.result.files && response.result.files.length > 0) {
        return response.result.files[0].id;
      }

      // Create new folder
      const createResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.APP_DATA_FOLDER,
          mimeType: 'application/vnd.google-apps.folder'
        }
      });

      return createResponse.result.id;
    } catch (error) {
      console.error('Error managing app folder:', error);
      throw error;
    }
  }

  /**
   * Delete user data from Google Drive
   */
  async deleteUserData(): Promise<CloudStorageResult> {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' };
      }

      const dataFile = await this.findDataFile();
      if (!dataFile) {
        return { success: true, message: 'No data file to delete' };
      }

      await window.gapi.client.drive.files.delete({
        fileId: dataFile.id
      });

      return { success: true, message: 'Data deleted successfully' };
    } catch (error) {
      console.error('Delete failed:', error);
      return {
        success: false,
        message: `Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get sync status and last sync time
   */
  async getSyncStatus(): Promise<CloudStorageResult> {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: true,
          message: 'Not authenticated',
          data: { isAuthenticated: false, lastSyncTime: null }
        };
      }

      const dataFile = await this.findDataFile();
      if (!dataFile) {
        return {
          success: true,
          message: 'No data file found',
          data: { isAuthenticated: true, lastSyncTime: null }
        };
      }

      return {
        success: true,
        message: 'Sync status retrieved',
        data: {
          isAuthenticated: true,
          lastSyncTime: dataFile.modifiedTime,
          fileSize: dataFile.size
        }
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        success: false,
        message: `Error getting sync status: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Export singleton instance
export const cloudStorageService = new CloudStorageService();
export type { CloudStorageResult };