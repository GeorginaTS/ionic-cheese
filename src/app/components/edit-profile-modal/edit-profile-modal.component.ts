import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonToast,
  IonIcon,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonDatetime,
    IonToast,
    IonSpinner
],
})
export class EditProfileModalComponent implements OnInit {
  @Input() currentUser: any;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);

  profileForm!: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';

  constructor() {
    addIcons({ closeOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      displayName: [
        this.currentUser?.displayName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        this.currentUser?.email || '',
        [Validators.required, Validators.email],
      ],
      birthDate: [this.currentUser?.birthDate || ''],
      city: [this.currentUser?.city || ''],
      province: [this.currentUser?.province || ''],
      country: [this.currentUser?.country || ''],
    });
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;

      try {
        const formData = this.profileForm.value;

        // Actualitzar el perfil a Firestore
        await this.authService.updateUserProfile(formData);

        // Actualitzar el displayName a Firebase Auth si ha canviat
        if (formData.displayName !== this.currentUser?.displayName) {
          await this.authService.updateDisplayName(formData.displayName);
        }

        this.showToastMessage('Profile updated successfully!', 'success');
        setTimeout(() => {
          this.modalCtrl.dismiss({ updated: true, userData: formData });
        }, 1500);
      } catch (error) {
        console.error('Error updating profile:', error);
        this.showToastMessage(
          'Error updating profile. Please try again.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.showToastMessage(
        'Please fill in all required fields correctly.',
        'danger'
      );
    }
  }

  private showToastMessage(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Getters per facilitar l'accés als controls del formulari
  get displayName() {
    return this.profileForm.get('displayName');
  }
  get email() {
    return this.profileForm.get('email');
  }
}
