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
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, collection, doc, serverTimestamp, setDoc, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
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
    try {
      console.log('Attempting to login with:', { email, password: '***' });
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful, user:', userCredential.user);
      this.router.navigate(['/my-cheeses']);
      return userCredential;
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      switch(error.code) {
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
  
  async getUserProfile(uid?: string) {
    const userId = uid || this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No authenticated user');
    }
    
    const userDoc = doc(this.firestore, `users/${userId}`);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log('User document not found. Returning basic profile.');
      // Return basic user info from auth if firestore document doesn't exist
      return {
        email: this.auth.currentUser?.email,
        name: this.auth.currentUser?.displayName,
        uid: userId,
      };
    }
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
