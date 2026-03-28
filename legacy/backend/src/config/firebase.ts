import * as admin from 'firebase-admin';
import { config } from './index';

// .env'den gelen değeri düzeltiyoruz
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;


// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey,
      clientEmail: config.firebase.clientEmail,
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

// Collection referansları
export const collections = {
  users: db.collection('users'),
  chatSessions: db.collection('chatSessions'),
  plans: db.collection('plans'),
};

export default admin;
