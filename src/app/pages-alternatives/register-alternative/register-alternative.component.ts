import { Component } from '@angular/core';
import { AuthAlternativeService } from 'src/app/services-alternatives/auth-alternative.service';
import { IonIcon, IonItem, IonInput, IonContent, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterNavComponent } from "src/app/components-alternatives/footer-nav/footer-nav.component";


@Component({
  selector: 'app-register-alternative',
  templateUrl: './register-alternative.component.html',
  styleUrls: ['./register-alternative.component.scss'],
  imports: [IonButton, IonInput, IonItem, IonIcon, FormsModule, CommonModule, IonContent, FooterNavComponent],
})
export class RegisterAlternativeComponent {
  name = '';
  lastname = '';
  birth = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  showPassword = false;
showConfirmPassword = false;

  constructor(private authService: AuthAlternativeService) {}

  register() {
    const validation = this.authService.validateRegistration(
      this.name,
      this.lastname,
      this.birth,
      this.email,
      this.password,
      this.confirmPassword
    );
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }
    this.authService.register(this.name, this.lastname, this.birth, this.email, this.password);
  }

}

