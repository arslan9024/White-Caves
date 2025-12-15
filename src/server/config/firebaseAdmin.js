import admin from 'firebase-admin';

let firebaseAdmin = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('✓ Firebase Admin SDK initialized');
  } catch (error) {
    console.error('✗ Firebase Admin SDK initialization failed:', error.message);
  }
} else {
  console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT not set. Firebase Admin features will not work.');
}

export const verifyIdToken = async (idToken) => {
  if (!firebaseAdmin) throw new Error('Firebase Admin not initialized');
  return await admin.auth().verifyIdToken(idToken);
};

export const getUser = async (uid) => {
  if (!firebaseAdmin) throw new Error('Firebase Admin not initialized');
  return await admin.auth().getUser(uid);
};

export const createCustomToken = async (uid, claims = {}) => {
  if (!firebaseAdmin) throw new Error('Firebase Admin not initialized');
  return await admin.auth().createCustomToken(uid, claims);
};

export default firebaseAdmin;
