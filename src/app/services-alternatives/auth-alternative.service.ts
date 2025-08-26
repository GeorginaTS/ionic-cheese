import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthAlternativeService {
  constructor() {}
  //Validaciones rápidas en el frontend
  validateRegistration(
    name: string,
    lastname: string,
    birth: string,
    email: string,
    password: string,
    confirmPassword: string
  ): { valid: boolean; message: string } {
    if (
      !name ||
      !lastname ||
      !birth ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return { valid: false, message: 'All fields are required.' };
    }
    if (!this.validateEmail(email)) {
      return { valid: false, message: 'Invalid email address.' };
    }
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match.' };
    }
    if (password.length < 6) {
      return {
        valid: false,
        message: 'Password must be at least 6 characters long.',
      };
    }
    return { valid: true, message: '' };
  }

  register(
    name: string,
    lastname: string,
    birth: string,
    email: string,
    password: string
  ) {
    // Obtener Iniciales
    const initials = `${name.charAt(0).toUpperCase()}.${lastname
      .charAt(0)
      .toUpperCase()}.`;
    // Obtener dominio de correo electrónico
    const emailDomain = email.substring(email.indexOf('@'));
    alert(
      `User registered successfully!\nUser: ${initials}\nEmail domain: ${emailDomain}`
    );
  }
  private validateEmail(email: string): boolean {
    // Validación simple de correo electrónico
    // Que haya texto antes de la @ (sin espacios ni @).
    // Que haya una @.
    // Que haya texto después de la @ y antes del punto.
    // Que haya un punto y texto después (el dominio).
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
