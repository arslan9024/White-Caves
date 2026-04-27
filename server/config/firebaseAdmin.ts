import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import logger from '../utils/logger.js';

let firebaseAdminApp: App | null = null;

const getFirebaseAdminApp = (): App | null => {
  if (firebaseAdminApp) return firebaseAdminApp;
  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0]!;
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  try {
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
    throw new Error(
      'Firebase Admin is not initialized. Configure Firebase service credentials on the server.'
    );
  }
  return getAuth(app).verifyIdToken(idToken);
}
