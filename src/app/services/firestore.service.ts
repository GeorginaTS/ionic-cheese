import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc, updateDoc, serverTimestamp, FirestoreDataConverter } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  }
};

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /** Obté un document com a observable tipat (offline-ready) */
  getDocument$(collectionPath: string, docId: string): Observable<AppUser | undefined> {
    const ref = doc(this.firestore, `${collectionPath}/${docId}`).withConverter(appUserConverter);
    return docData(ref, { idField: 'uid' });
  }

  /** Guarda un document amb timestamps */
  async setDocument(collectionPath: string, docId: string, data: AppUser) {
    const ref = doc(this.firestore, `${collectionPath}/${docId}`).withConverter(appUserConverter);
    await setDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt ?? serverTimestamp(),
    }, { merge: true });
  }

  /** Actualitza un document existent amb timestamps */
  async updateDocument(collectionPath: string, docId: string, data: Partial<AppUser>) {
    const ref = doc(this.firestore, `${collectionPath}/${docId}`).withConverter(appUserConverter);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
}
