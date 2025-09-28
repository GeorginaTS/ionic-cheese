import { Injectable, inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Firestore,
  doc,
  getDoc,
  FirestoreDataConverter,
} from '@angular/fire/firestore';
import { AppUser as User } from '../interfaces/user';

// Converter per a AppUser amb Firestore
const appUserConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User) {
    return { ...user };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data()!;
    return {
      uid: data['uid'],
      displayName: data['displayName'],
      email: data['email'],
      photoURL: data['photoURL'],
      birthDate: data['birthDate'],
      country: data['country'],
      province: data['province'],
      city: data['city'],
      createdAt: data['createdAt'],
      updatedAt: data['updatedAt'],
    } as User;
  },
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  /**
   * Obtenir un usuari per el seu ID des de Firestore
   * @param userId - L'ID de l'usuari a obtenir
   * @returns Observable amb les dades de l'usuari
   */
  getUserById(userId: string): Observable<User | null> {
    if (!userId) {
      console.warn('UserService: getUserById called with empty userId');
      return of(null);
    }

    const userDocRef = doc(this.firestore, `users/${userId}`).withConverter(
      appUserConverter
    );

    return from(getDoc(userDocRef)).pipe(
      map((docSnapshot) => {
        console.log('🔍 UserService Debug - Buscant usuari:', userId);
        console.log('🔍 Document trobat:', docSnapshot.exists());

        if (docSnapshot.exists()) {
          console.log('🔍 Dades RAW del document:', docSnapshot.data());

          const userData = docSnapshot.data();
          console.log('🔍 UserData després del converter:', userData);

          // Assegurar que l'usuari té l'uid correcte
          const finalUser = { ...userData, uid: userId };
          console.log('🔍 Usuario final que es retorna:', finalUser);

          return finalUser;
        } else {
          console.warn(`User not found: ${userId}`);
          return null;
        }
      }),
      catchError((error) => {
        console.error(`Error fetching user ${userId}:`, error);

        // En cas d'error, retornar un usuari mínim amb l'ID
        const fallbackUser: User = {
          uid: userId,
          displayName: 'Unknown User',
          email: 'unknown@example.com',
          photoURL: undefined,
        };

        return of(fallbackUser);
      })
    );
  }
}
