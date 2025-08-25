import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // <- Solo Validators
import { CommonModule } from '@angular/common';
import { IonInput, IonIcon, IonItem, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-alternative',
  templateUrl: './login-alternative.component.html',
  styleUrls: ['./login-alternative.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonIcon, IonInput, ReactiveFormsModule, CommonModule]
})
export class LoginAlternativeComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login attempt with:', { email, password: '***' });
    } else {
      console.log('Please fill in both email and password');
    }
  }
}
