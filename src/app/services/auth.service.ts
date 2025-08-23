import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
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
      // Espera a que l'usuari autenticat estigui disponible
      const userId = uid || this.auth.currentUser?.uid;
      if (!userId) return null;

      // Primer esperem l'usuari d'Auth (sense cridar getAuth())
      const firebaseUser = this.auth.currentUser;

      // Després fem crida al servei Firestore injectat
      const userData = await firstValueFrom(
        this.firestoreService.getDocument$('users', userId)
      );
      return {
        ...userData,
        uid: userId,
        displayName:
          userData?.displayName ||
          firebaseUser?.displayName ||
          'NO name - User',
        email: userData?.email || firebaseUser?.email || '',
        photoURL: userData?.photoURL || firebaseUser?.photoURL || null,
      } as AppUser;
    } catch (error) {
      console.error('getUserProfile failed:', error);
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
