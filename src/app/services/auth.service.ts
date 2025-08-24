import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable, take } from 'rxjs';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  getAuth,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { serverTimestamp } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from './firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) {}

  async register(
    displayName: string,
    email: string,
    password: string,
    birthDate: string,
    country: string,
    province: string,
    city: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('Registering user:', user);
      await updateProfile(user, { displayName: displayName });

      const appUser: AppUser = {
        uid: user.uid,
        displayName,
        email,
        birthDate,
        country,
        province,
        city,
        createdAt: serverTimestamp(),
      };
      console.log('AppUser object:', appUser);

      // Use firestore service to save user data
      await this.firestoreService.setDocument('users', user.uid, appUser);

      this.showToast('✅ User registered', 'success');
      this.router.navigate(['/my-cheeses']);
    } catch (error: any) {
      let message = 'ERROR:';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          message = 'Weak password.';
          break;
      }

      this.showToast(message, 'danger');
      console.error('Error registering user:', message, error);
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('Attempting to login with:', { email, password: '***' });
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('Login successful, user:', userCredential.user);
      this.router.navigate(['/my-cheeses']);
      return userCredential;
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
      }

      this.showToast(errorMessage, 'danger');
      this.router.navigate(['/home']);
      throw error;
    }
  }
  async googleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    this.router.navigate(['/my-cheeses']);
  }
  get currentUser() {
    return this.auth.currentUser;
  }
  getIdToken$(): Observable<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuari no autenticat');
    return from(user.getIdToken());
  }
  async getUserProfile(uid?: string): Promise<AppUser | null> {
  try {
    // Utilitzem l'observable user() per accedir a l'usuari actual dins del context d'injecció
    return new Promise<AppUser | null>((resolve) => {
      user(this.auth).pipe(take(1)).subscribe(async (firebaseUser) => {
        // Obtenir l'ID d'usuari del paràmetre o de l'usuari autenticat
        const userId = uid || firebaseUser?.uid;
        
        if (!userId) {
          console.log('No authenticated user found');
          resolve(null);
          this.router.navigate(['/home']);
          return;
        }
        
        try {
          // Obtenir dades extra del perfil des de Firestore
          const userData = await firstValueFrom(
            this.firestoreService.getDocument$('users', userId)
          );
          
          // Crear objecte d'usuari combinant dades principals de currentUser i extra de Firestore
          const appUser: AppUser = {
            uid: userId,
            // Dades principals de l'usuari autenticat
            displayName: firebaseUser?.displayName || userData?.displayName || 'NO name - User',
            email: firebaseUser?.email || userData?.email || '',
            photoURL: firebaseUser?.photoURL || userData?.photoURL || null,
            // Dades extra de Firestore
            birthDate: userData?.birthDate,
            country: userData?.country,
            province: userData?.province,
            city: userData?.city,
            createdAt: userData?.createdAt,
            // Qualsevol altra dada de userData
            ...userData
          } as AppUser;
          
          console.log('User profile loaded successfully:', appUser);
          resolve(appUser);
        } catch (error) {
          console.error('Error loading Firestore user data:', error);
          
          // Si falla l'accés a Firestore, retornem les dades bàsiques de l'usuari autenticat
          if (firebaseUser) {
            const basicUser: AppUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'NO name - User',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || null,
            } as AppUser;
            
            console.log('Returning basic user profile:', basicUser);
            resolve(basicUser);
          } else {
            console.log('No user data available');
            resolve(null);
            this.router.navigate(['/home']);
          }
        }
      }, (error) => {
        console.error('Error getting authentication state:', error);
        resolve(null);
        this.router.navigate(['/home']);
      });
    });
  } catch (error) {
    console.error('getUserProfile failed:', error);
    this.router.navigate(['/home']);
    return null;
  }
}

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }
  private async showToast(
    message: string,
    color: 'success' | 'danger' = 'success'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
