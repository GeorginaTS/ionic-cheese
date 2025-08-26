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
import { auth } from 'firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Router } from '@angular/router';

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
  db = getFirestore();


  constructor(
    private authService: AuthAlternativeService,
    private fb: FormBuilder,
    private router: Router
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
  const { name, lastname, birth, email, password } = this.registerForm.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      // Guarda los datos extra en Firestore
      return setDoc(doc(this.db, "usuarios", uid), {
        name,
        lastname,
        birth,
        email
      });
    })
    .then(() => {
      // Registro y guardado exitoso
      this.errorMessage = '';
      alert('Registration successful!');
      this.router.navigate(['/login']);
    })
    .catch(error => {
      this.errorMessage = error.message;
    });
}
}
