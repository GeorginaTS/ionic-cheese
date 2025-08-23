import { Component } from '@angular/core';
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
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: [new Date().toISOString(), [Validators.required]],
      country: ['', Validators.required],
      province: [''],
      city: [''],
    });
  }

  async register() {
    if (this.registerForm.valid) {
      const { displayName, email, password, birthDate, country, province, city } =
        this.registerForm.value;

      try {
        await this.authService.register(
          displayName,
          email,
          password,
          birthDate,
          country,
          province,
          city
        );
      } catch (error) {
        console.error('Error en el registre:', error);
      }
    }
  }
}
