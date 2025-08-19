import { Component, OnInit } from '@angular/core';
import { IonButton, IonItem, IonInput, IonIcon, IonLabel, IonNote } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonButton, IonItem, IonInput, IonIcon, IonLabel, IonNote, ReactiveFormsModule],
})
export class LoginComponent  implements OnInit {
  authForm!: FormGroup;
  constructor( private authService: AuthService, private fb: FormBuilder) {
    
   addIcons({ logoGoogle });
   }

  ngOnInit() {
      this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

async login(): Promise<void> {
    if (this.authForm.invalid) {
      console.log('Form invalid');
      return;
    }
    const email: string = this.authForm.get('email')?.value;
    const password: string = this.authForm.get('password')?.value;

    try {
      await this.authService.login(email, password);
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login failed', error.message || error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleLogin();
    } catch (error: any) {
      console.error('Google login failed', error.message || error);
    }
  }
}
