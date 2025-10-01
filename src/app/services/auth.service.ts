import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { firstValueFrom, from, Observable, take, switchMap } from 'rxjs';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  user,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { serverTimestamp } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from './firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {}

  async register(newUser: Partial<AppUser> & { password: string }) {
    try {
      const { email, password, displayName, ...extraData } = newUser;
      // console.log('Registering user:', newUser);
      if (!email || !password) throw new Error('Email i contrasenya requerits');

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: displayName || '' });

      const appUser: AppUser = {
        uid: user.uid,
        displayName,
        email,
        ...extraData,
        createdAt: serverTimestamp(),
      };

      //console.log('AppUser object:', appUser);

      // Use firestore service to save user data
      await this.firestoreService.setDocument('users', user.uid, appUser);

      this.showToast('✅ User registered', 'success');
      this.router.navigate(['/my-cheeses']);
    } catch (error: any) {
      const message = this.mapAuthError(error);
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
      //console.log('Login successful, user:', userCredential.user);
      this.router.navigate(['/my-cheeses']);
      return userCredential;
    } catch (error: any) {
      const errorMessage = this.mapAuthError(error, 'login');
      this.showToast(errorMessage, 'danger');
      this.router.navigate(['/home']);
      throw error;
    }
  }

  get currentUser() {
    return runInInjectionContext(this.injector, () => {
      return this.auth.currentUser;
    });
  }

  /** Get current user using the Observable approach (recommended) */
  async getCurrentUserAsync() {
    try {
      return await runInInjectionContext(this.injector, async () => {
        return await firstValueFrom(user(this.auth));
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;

      // Prepara objecte AppUser amb dades de Google
      const appUser: AppUser = {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        createdAt: serverTimestamp(),
      };

      // Desa (merge) a Firestore perquè no sobreescrigui si ja existia
      await this.firestoreService.setDocument('users', user.uid, appUser);

      this.router.navigate(['/my-cheeses']);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      this.router.navigate(['/']);
    }
  }
  getIdToken$(): Observable<string> {
    return runInInjectionContext(this.injector, () => {
      return from(user(this.auth)).pipe(
        switchMap((currentUser: User | null) => {
          if (!currentUser) throw new Error('Usuari no autenticat');
          return from(currentUser.getIdToken());
        })
      );
    });
  }
  async getUserProfile(uid?: string): Promise<AppUser | null> {
    try {
      // Utilizar el método recomendado con user() Observable
      const firebaseUser = await this.getCurrentUserAsync();

      // Obtenir l'ID d'usuari del paràmetre o de l'usuari autenticat
      const userId = uid || firebaseUser?.uid;

      if (!userId) {
        console.log('No authenticated user found');
        this.router.navigate(['/home']);
        return null;
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
          displayName:
            firebaseUser?.displayName ||
            userData?.displayName ||
            'NO name - User',
          email: firebaseUser?.email || userData?.email || '',
          photoURL: firebaseUser?.photoURL || userData?.photoURL || null,
          // Dades extra de Firestore
          birthDate: userData?.birthDate,
          country: userData?.country,
          province: userData?.province,
          city: userData?.city,
          createdAt: userData?.createdAt,
          // Qualsevol altra dada de userData
          ...userData,
        } as AppUser;

        //console.log('User profile loaded successfully:', appUser);
        return appUser;
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

          //console.log('Returning basic user profile:', basicUser);
          return basicUser;
        } else {
          console.log('No user data available');
          this.router.navigate(['/home']);
          return null;
        }
      }
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

  async updateUserProfile(userData: Partial<AppUser>) {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');

      // Update Firebase Auth profile if displayName is provided
      if (userData.displayName !== undefined) {
        await updateProfile(currentUser, { displayName: userData.displayName });
      }

      // Update Firestore user document
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp(),
      };
      await this.firestoreService.updateDocument(
        'users',
        currentUser.uid,
        updateData
      );

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updateDisplayName(displayName: string) {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');

      await updateProfile(currentUser, { displayName });
      return true;
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  }

  private mapAuthError(
    error: any,
    context: 'register' | 'login' = 'register'
  ): string {
    const codes: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Weak password.',
      'auth/user-not-found': 'No user found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Try again later',
      'auth/network-request-failed': 'Network error. Check your connection',
    };
    return codes[error.code] || `Unexpected ${context} error`;
  }
}
