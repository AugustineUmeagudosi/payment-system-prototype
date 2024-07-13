import admin from 'firebase-admin';
import serviceAccount from '../../firebase-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const createUser = async ({ email, password, name: displayName }) => {
    return admin.auth().createUser({ email, password, displayName });
}
