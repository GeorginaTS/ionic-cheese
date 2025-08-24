import {
  Injectable,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  FirestoreDataConverter,
} from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppUser } from '../interfaces/user';

const appUserConverter: FirestoreDataConverter<AppUser> = {
  toFirestore(user: AppUser) {
    return { ...user };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data()!;
    return {
      uid: data['uid'],
      name: data['name'],
      email: data['email'],
      birthDate: data['birthDate'],
      country: data['country'],
      province: data['province'],
      city: data['city'],
      createdAt: data['createdAt'],
      updatedAt: data['updatedAt'],
    } as AppUser;
  },
};

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  constructor() {
    // La persistència s'ha configurat a main.ts mitjançant FirestoreSettings.cache
    // No necessitem habilitar-la aquí
  }

  /** Obté un document com a observable tipat (offline-ready) */
  getDocument$(collectionPath: string, docId: string): Observable<any> {
    // Creem l'observable manualment, sense dependre de les APIs de Firebase
    return new Observable((observer) => {
      // Executem el codi dins del context d'injecció
      runInInjectionContext(this.injector, () => {
        try {
          const docRef = doc(this.firestore, collectionPath, docId);

          // Fem la crida a getDoc dins del context d'injecció
          getDoc(docRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                observer.next({ id: docSnap.id, ...docSnap.data() });
              } else {
                observer.next(undefined);
              }
              observer.complete();
            })
            .catch((error) => {
              console.error('Error fetching document:', error);
              observer.error(error);
              observer.complete();
            });
        } catch (error) {
          console.error('Error creating document reference:', error);
          observer.next(undefined);
          observer.complete();
        }
      });
    });
  }

  /** Guarda un document amb timestamps */
  async setDocument(collectionPath: string, docId: string, data: any) {
    return runInInjectionContext(this.injector, async () => {
      try {
        const docRef = doc(this.firestore, collectionPath, docId);
        const docData = {
          ...data,
          updatedAt: serverTimestamp(),
          createdAt: data.createdAt ?? serverTimestamp(),
        };

        // Eliminem les propietats undefined que poden causar problemes
        Object.keys(docData).forEach(
          (key) => docData[key] === undefined && delete docData[key]
        );

        await setDoc(docRef, docData, { merge: true });
        return true;
      } catch (error) {
        console.error('Error setting document:', error);
        return false;
      }
    });
  }

  /** Actualitza un document existent amb timestamps */
  async updateDocument(collectionPath: string, docId: string, data: any) {
    return runInInjectionContext(this.injector, async () => {
      try {
        const docRef = doc(this.firestore, collectionPath, docId);
        const updateData = {
          ...data,
          updatedAt: serverTimestamp(),
        };

        // Eliminem les propietats undefined que poden causar problemes
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key]
        );

        await updateDoc(docRef, updateData);
        return true;
      } catch (error) {
        console.error('Error updating document:', error);
        return false;
      }
    });
  }
}
