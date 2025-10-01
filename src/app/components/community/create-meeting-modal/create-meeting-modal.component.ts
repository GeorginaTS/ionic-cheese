import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  calendarOutline,
  locationOutline,
  timeOutline,
  peopleOutline,
  documentTextOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-create-meeting-modal',
  templateUrl: './create-meeting-modal.component.html',
  styleUrls: ['./create-meeting-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
  ],
})
export class CreateMeetingModalComponent {
  private modalController = inject(ModalController);
  private formBuilder = inject(FormBuilder);

  meetingForm: FormGroup;

  constructor() {
    addIcons({
      closeOutline,
      calendarOutline,
      locationOutline,
      timeOutline,
      peopleOutline,
      documentTextOutline,
    });

    this.meetingForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      type: ['tasting', Validators.required],
      maxParticipants: [
        10,
        [Validators.required, Validators.min(2), Validators.max(50)],
      ],
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.meetingForm.valid) {
      const meetingData = this.meetingForm.value;
      console.log('Creating meeting:', meetingData);

      // Aquí integraries amb el servei per crear l'event
      // await this.meetingService.createMeeting(meetingData);

      await this.modalController.dismiss(meetingData, 'created');
    } else {
      // Marcar tots els camps com a touched per mostrar errors
      Object.keys(this.meetingForm.controls).forEach((key) => {
        this.meetingForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.meetingForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `Minimum value is ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Maximum value is ${control.errors['max'].max}`;
      }
    }
    return '';
  }
}
