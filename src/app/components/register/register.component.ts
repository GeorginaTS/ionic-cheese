import { Component, inject, ElementRef } from '@angular/core';
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
import { FocusManagerService } from '../../services/focus-manager.service';
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
  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);
  registerForm: FormGroup;
  constructor() {
    this.registerForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: [this.maxBirthDate()],
      country: ['', [Validators.required]],
      province: [''],
      city: [''],
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString();
  }

  maxBirthDate(): string {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString();
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

  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }

  onDateModalDismiss() {
    // Netegem el focus quan es tanca el modal de data per evitar warnings d'accessibilitat
    this.focusManager.clearFocus(this.elementRef);
  }
}
