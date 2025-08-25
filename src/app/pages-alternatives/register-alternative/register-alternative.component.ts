import { Component } from '@angular/core';
import { AuthAlternativeService } from 'src/app/services-alternatives/auth-alternative.service';
import {
  IonIcon,
  IonItem,
  IonInput,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterNavComponent } from 'src/app/components-alternatives/footer-nav/footer-nav.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-alternative',
  templateUrl: './register-alternative.component.html',
  styleUrls: ['./register-alternative.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
    FormsModule,
    CommonModule,
    IonContent,
    FooterNavComponent,
    ReactiveFormsModule,
  ],
})
export class RegisterAlternativeComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  fields = [
  { name: 'name', type: 'text' },
  { name: 'lastname', type: 'text' },
  { name: 'birth', type: 'date' },
  { name: 'email', type: 'email' },
  { name: 'password' },
  { name: 'confirmPassword' }
];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthAlternativeService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.register();
  }
  register() {
    const formValues = this.registerForm.value;
    const validation = this.authService.validateRegistration(
      formValues.name,
      formValues.lastname,
      formValues.birth,
      formValues.email,
      formValues.password,
      formValues.confirmPassword
    );
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }
    this.authService.register(
      formValues.name,
      formValues.lastname,
      formValues.birth,
      formValues.email,
      formValues.password
    );
  }
}
