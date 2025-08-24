import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonIcon, IonItem, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-alternative',
  templateUrl: './login-alternative.component.html',
  styleUrls: ['./login-alternative.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonIcon, IonInput, FormsModule, CommonModule]
})
export class LoginAlternativeComponent implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor() { }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.email && this.password) {
      console.log('Login attempt with:', { email: this.email, password: '***' });
      // Add your login logic here
    } else {
      console.log('Please fill in both email and password');
    }
  }
}
