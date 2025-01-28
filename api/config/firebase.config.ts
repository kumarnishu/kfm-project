import * as admin from 'firebase-admin';
// Use require to load the service account JSON file
import serviceAccount from "../firebase.json";

// Initialize Firebase Admin SDK
admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
