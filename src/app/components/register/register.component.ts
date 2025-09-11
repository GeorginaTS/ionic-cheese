import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonButton,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  registerForm: FormGroup;
  constructor() {
    this.registerForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: [new Date().toISOString()],
      country: ['', [Validators.required]],
      province: [''],
      city: [''],
    });
  }

  async register() {
    // Validar formulario y mostrar errores si es necesario
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;
    console.log('Form values:', formValue);

    const newUser: Partial<AppUser> & { password: string } = {
      displayName: formValue.displayName,
      email: formValue.email,
      password: formValue.password, // només per crear l’usuari
      birthDate: formValue.birthDate,
      country: formValue.country,
      province: formValue.province,
      city: formValue.city,
    };

    try {
      await this.authService.register(newUser);
    } catch (error) {
      console.error('Error en el registre:', error);
    }
  }
}
