import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import logger from '../utils/logger.js';

let firebaseAdminApp: App | null = null;

export class FirebaseAdminInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAdminInitError';
  }
}

const getFirebaseAdminApp = (): App | null => {
  if (firebaseAdminApp) return firebaseAdminApp;
  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0]!;
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  try {
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };

      if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
        firebaseAdminApp = initializeApp({
          credential: cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
          }),
        });
        return firebaseAdminApp;
      }
    }

    if (projectId && clientEmail && privateKey) {
      firebaseAdminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return firebaseAdminApp;
    }

    // Fallback to ADC (GOOGLE_APPLICATION_CREDENTIALS / managed runtime identity)
    firebaseAdminApp = initializeApp();
    return firebaseAdminApp;
  } catch (error) {
    logger.error('Failed to initialize firebase-admin', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  const app = getFirebaseAdminApp();
  if (!app) {
    throw new FirebaseAdminInitError(
      'Firebase Admin is not initialized. Configure server credentials (FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY).'
    );
  }
  return getAuth(app).verifyIdToken(idToken);
}
