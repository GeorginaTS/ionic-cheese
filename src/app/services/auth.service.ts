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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {}

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/my-cheeses']);
  }

  async register(
    name: string,
    email: string,
    password: string,
    birthDate: string,
    country: string,
    province: string,
    city: string
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const appUser: AppUser = {
      uid: user.uid,
      name,
      email,
      birthDate,
      country,
      province,
      city,
      createdAt: new Date(),
    };

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, appUser);

    this.router.navigate(['/my-cheeses']);
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
}
