
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

export const environment = {
  production: false,
  apiUrl: process.env['API_URL'] || 'https://ionic-cheese-back.onrender.com/api',
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    projectId: process.env['FIREBASE_PROJECT_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
    appId: process.env['FIREBASE_APP_ID'],
    measurementId: process.env['FIREBASE_MEASUREMENT_ID']
  }
};