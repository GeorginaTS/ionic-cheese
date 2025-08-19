import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/my-cheeses']);
  }

  async register(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
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

