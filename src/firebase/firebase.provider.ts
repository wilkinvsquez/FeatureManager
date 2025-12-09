import { Provider } from "@nestjs/common";
import * as admin from "firebase-admin";
import * as path from "path";

export const FIREBASE_CONNECTION = 'FIREBASE_CONNECTION';

/**
 * Firebase Provider
 */
export const FirebaseProvider: Provider[] = [
    {
        provide: FIREBASE_CONNECTION,
        useFactory: () => {
            const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
            }

            return admin.firestore();
        },
    },
];  