import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    console.log('AuthGuard canActivate called');
    
    // Utilitzem directament currentUser en lloc de l'observable user()
    const currentUser = this.auth.currentUser;
    const isAuthenticated = !!currentUser;
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      this.router.navigate(['/']);
    } else {
      console.log('User authenticated, allowing access');
    }
    
    return of(isAuthenticated);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    console.log('NoAuthGuard canActivate called');
    
    // Utilitzem directament currentUser en lloc de l'observable user()
    const currentUser = this.auth.currentUser;
    const isAuthenticated = !!currentUser;
    
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to my-cheeses');
      this.router.navigate(['/my-cheeses']);
    } else {
      console.log('User not authenticated, allowing access to login page');
    }
    
    return of(!isAuthenticated);
  }
}