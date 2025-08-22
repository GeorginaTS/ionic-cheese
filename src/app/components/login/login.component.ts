import { Component, OnInit } from '@angular/core';
import { IonButton, IonItem, IonInput, IonIcon, IonLabel, IonNote } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonButton, IonItem, IonInput, IonIcon, IonLabel, IonNote, ReactiveFormsModule],
})
export class LoginComponent  implements OnInit {
  authForm!: FormGroup;

  constructor( private authService: AuthService, private fb: FormBuilder, private toastCtrl: ToastController) {
    
   addIcons({ logoGoogle });
   }

  ngOnInit() {
      this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

async login(): Promise<void> {
    if (this.authForm.invalid) {
      console.log('Form validation failed:', this.authForm.errors);
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.authForm.controls).forEach(key => {
        const control = this.authForm.get(key);
        control?.markAsTouched();
      });
      
      return;
    }
    
    const email: string = this.authForm.get('email')?.value;
    const password: string = this.authForm.get('password')?.value;
    
    console.log('Attempting login with email:', email);

    try {
      await this.authService.login(email, password);
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login error in component:', error);
      // The toast is already shown in the service
    }
  }


  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleLogin();
    } catch (error: any) {
      console.error('Google login failed', error.message || error);
    }
  }
    private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}
