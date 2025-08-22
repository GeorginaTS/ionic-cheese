import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged, user } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    console.log('AuthGuard canActivate called');
    return user(this.auth).pipe(
      take(1), // Take only the first emission to complete the Observable
      map((user) => {
        const isAuthenticated = !!user;
        console.log('User authenticated?', isAuthenticated, user);

        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to home');
          this.router.navigate(['/home']);
          return false;
        }

        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    console.log('NoAuthGuard canActivate called');
    return user(this.auth).pipe(
      take(1), // Take only the first emission
      map((user) => {
        const isAuthenticated = !!user;
        console.log(
          'User authenticated in NoAuthGuard?',
          isAuthenticated,
          user
        );

        if (isAuthenticated) {
          console.log('Already authenticated, redirecting to my-cheeses');
          this.router.navigate(['/my-cheeses']);
          return false;
        }

        return true;
      })
    );
  }
}
