import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, shareOutline, addOutline } from 'ionicons/icons';
import { CreateMeetingModalComponent } from '../create-meeting-modal/create-meeting-modal.component';

@Component({
  selector: 'app-meetings-tab',
  templateUrl: './meetings-tab.component.html',
  styleUrls: ['./meetings-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class MeetingsTabComponent {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ locationOutline, shareOutline, addOutline });
  }

  async openCreateMeetingModal() {
    const modal = await this.modalController.create({
      component: CreateMeetingModalComponent,
      presentingElement: undefined,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      handle: true,
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'created' && result.data) {
        console.log('New meeting created:', result.data);
        // Aquí podrías actualizar la llista de meetings
        // this.loadMeetings();
      }
    });

    await modal.present();
  }
}
