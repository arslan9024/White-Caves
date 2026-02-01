import { http, HttpResponse } from 'msw';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const handlers = [
  // Property Inventory Endpoints
  http.get(`${API_BASE}/api/property-inventory/properties`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: '1',
          location: 'Dubai Marina',
          propertyType: 'Apartment',
          bedrooms: 2,
          bathrooms: 2,
          area: 1500,
          price: 1500000,
          currency: 'AED',
          status: 'Available',
          owner: 'Owner1',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.post(`${API_BASE}/api/property-inventory/properties`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Property created successfully',
      data: { _id: '2', ...body },
    }, { status: 201 });
  }),

  // Smart Import Endpoints
  http.post(`${API_BASE}/api/smartImport/validate-file`, () => {
    return HttpResponse.json({
      success: true,
      message: 'File validation successful',
      data: {
        validRows: 100,
        invalidRows: 5,
        issues: [],
      },
    });
  }),

  http.post(`${API_BASE}/api/smartImport/create-session`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: 'session-123',
        fileName: 'import.xlsx',
        status: 'mapping',
        createdAt: new Date().toISOString(),
      },
    }, { status: 201 });
  }),

  http.post(`${API_BASE}/api/smartImport/execute-import`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Import executed successfully',
      data: {
        sessionId: 'session-123',
        importedCount: 100,
        failedCount: 0,
        results: [],
      },
    });
  }),

  // Import History Endpoints
  http.get(`${API_BASE}/api/importHistory/sessions`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'session-1',
          fileName: 'import-1.xlsx',
          status: 'completed',
          importedCount: 50,
          failedCount: 2,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.get(`${API_BASE}/api/importHistory/sessions/:sessionId`, ({ params }) => {
    const { sessionId } = params;
    return HttpResponse.json({
      success: true,
      data: {
        _id: sessionId,
        fileName: 'import.xlsx',
        status: 'completed',
        importedCount: 100,
        failedCount: 0,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Admin Dashboard Endpoints
  http.get(`${API_BASE}/api/admin/statistics`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalProperties: 500,
        totalOwners: 100,
        totalImports: 25,
        failedImports: 2,
        importedThisMonth: 150,
      },
    });
  }),

  http.get(`${API_BASE}/api/admin/recent-activity`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: '1',
          type: 'import',
          status: 'completed',
          count: 50,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }),
];
