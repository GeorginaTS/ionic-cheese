import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const AuthGuard: CanActivateFn = async () => {
  console.log('AuthGuard canActivate called');
  const router = inject(Router);
  const auth = inject(Auth);
  const injector = inject(Injector);

  try {
    // Comprovem si l'usuari està autenticat utilitzant l'Observable user() amb injection context
    const currentUser = await runInInjectionContext(injector, async () => {
      return await firstValueFrom(user(auth));
    });
    const isAuthenticated = !!currentUser;

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      router.navigate(['/']);
      return false;
    }

    console.log('User authenticated, allowing access');
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    router.navigate(['/']);
    return false;
  }
};

export const NoAuthGuard: CanActivateFn = async () => {
  console.log('NoAuthGuard canActivate called');
  const router = inject(Router);
  const auth = inject(Auth);
  const injector = inject(Injector);

  try {
    // Comprovem si l'usuari està autenticat utilitzant l'Observable user() amb injection context
    const currentUser = await runInInjectionContext(injector, async () => {
      return await firstValueFrom(user(auth));
    });
    const isAuthenticated = !!currentUser;

    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to my-cheeses');
      router.navigate(['/my-cheeses']);
      return false;
    }
    console.log('User not authenticated, allowing access to login page');
    return true; // Permetem l'accés sense redirigir
  } catch (error) {
    console.error('Error checking authentication:', error);
    return true; // En cas d'error, permetem l'accés a pàgines no protegides
  }
};
