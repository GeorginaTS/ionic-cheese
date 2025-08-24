import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const AuthGuard: CanActivateFn = () => {
  console.log('AuthGuard canActivate called');
  const router = inject(Router);
  const auth = inject(Auth); // Utilitzem la injecció estàndard en lloc de getAuth()
  
  try {
    // Comprovem si l'usuari està autenticat
    const currentUser = auth.currentUser;
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

export const NoAuthGuard: CanActivateFn = () => {
  console.log('NoAuthGuard canActivate called');
  const router = inject(Router);
  const auth = inject(Auth); // Utilitzem la injecció estàndard en lloc de getAuth()
  
  try {
    // Comprovem si l'usuari està autenticat
    const currentUser = auth.currentUser;
    const isAuthenticated = !!currentUser;
    
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to my-cheeses');
      router.navigate(['/my-cheeses']);
      return false;
    }
    
    console.log('User not authenticated, allowing access to login page');
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return true; // En cas d'error, permetem l'accés a pàgines no protegides
  }
};