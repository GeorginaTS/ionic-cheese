import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, collection, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private toastController: ToastController
  ) {}

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/my-cheeses']);
  }

  async register(
    name: string, email: string, password: string, birthDate: string, country: string, province: string, city: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('Registering user:', user);
      await updateProfile(user, { displayName: name });

      const usersCol = collection(this.firestore, 'users');
      const userRef = doc(usersCol, user.uid);

      const appUser: AppUser = {
        uid: user.uid,
        name,
        email,
        birthDate,
        country,
        province,
        city,
        createdAt: serverTimestamp()
      };
      console.log('AppUser object:', appUser);
  
      await setDoc(userRef, appUser);
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

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    this.router.navigate(['/my-cheeses']);
  }

  // async appleLogin() {
  //   const provider = new OAuthProvider('apple.com');
  //   await signInWithPopup(this.auth, provider);
  //   this.router.navigate(['/my-cheeses']);
  // }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }

  get currentUser() {
    console.log('Current user:', this.auth.currentUser);
    return this.auth.currentUser;
  }

    private async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
