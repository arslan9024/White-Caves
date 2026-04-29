import { google } from 'googleapis';

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheetsApi = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return true;
    
    try {
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n');
      
      if (!clientEmail || !privateKey) {
        console.log('GoogleSheetsService: Credentials not configured - running in mock mode');
        return false;
      }

      this.auth = new google.auth.JWT(
        clientEmail,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      
      await this.auth.authorize();
      this.sheetsApi = google.sheets({ version: 'v4', auth: this.auth });
      this.initialized = true;
      console.log('GoogleSheetsService: Connected successfully');
      return true;
    } catch (error) {
      console.error('GoogleSheetsService: Authorization failed', error.message);
      return false;
    }
  }

  isInitialized() {
    return this.initialized;
  }

  async getSheetData(spreadsheetId, range = 'Sheet1') {
    try {
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range
      });
      return {
        success: true,
        data: response.data.values || [],
        rowCount: response.data.values?.length || 0
      };
    } catch (error) {
      console.error('GoogleSheetsService: Failed to get sheet data', error.message);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getRow(spreadsheetId, rowIndex, range = 'Sheet1') {
    try {
      const fullRange = `${range}!${rowIndex}:${rowIndex}`;
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: fullRange
      });
      return {
        success: true,
        data: response.data.values?.[0] || []
      };
    } catch (error) {
      console.error('GoogleSheetsService: Failed to get row', error.message);
      return { success: false, error: error.message, data: [] };
    }
  }

  async appendRow(spreadsheetId, values, range = 'Sheet1!A:Z') {
    try {
      const response = await this.sheetsApi.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        }
      });
      return {
        success: true,
        updatedRange: response.data.updates?.updatedRange
      };
    } catch (error) {
      console.error('GoogleSheetsService: Failed to append row', error.message);
      return { success: false, error: error.message };
    }
  }

  async updateRow(spreadsheetId, rowIndex, values, range = 'Sheet1') {
    try {
      const fullRange = `${range}!A${rowIndex}:Z${rowIndex}`;
      const response = await this.sheetsApi.spreadsheets.values.update({
        spreadsheetId,
        range: fullRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        }
      });
      return {
        success: true,
        updatedCells: response.data.updatedCells
      };
    } catch (error) {
      console.error('GoogleSheetsService: Failed to update row', error.message);
      return { success: false, error: error.message };
    }
  }

  async searchInSheet(spreadsheetId, searchTerm, columnIndex = null) {
    try {
      const result = await this.getSheetData(spreadsheetId);
      if (!result.success) return result;

      const matches = result.data.filter((row, idx) => {
        if (idx === 0) return false;
        if (columnIndex !== null) {
          return row[columnIndex]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        return row.some(cell => cell?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      });

      return {
        success: true,
        matches,
        matchCount: matches.length
      };
    } catch (error) {
      console.error('GoogleSheetsService: Search failed', error.message);
      return { success: false, error: error.message, matches: [] };
    }
  }

  async getColumnData(spreadsheetId, columnIndex, range = 'Sheet1') {
    try {
      const result = await this.getSheetData(spreadsheetId, range);
      if (!result.success) return result;

      const columnData = result.data
        .slice(1)
        .map(row => row[columnIndex])
        .filter(val => val !== undefined && val !== null && val !== '');

      return {
        success: true,
        data: columnData,
        count: columnData.length
      };
    } catch (error) {
      console.error('GoogleSheetsService: Failed to get column data', error.message);
      return { success: false, error: error.message, data: [] };
    }
  }
}

export default new GoogleSheetsService();
