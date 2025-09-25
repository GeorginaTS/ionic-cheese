import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, shareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-discover-tab',
  templateUrl: './discover-tab.component.html',
  styleUrls: ['./discover-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton,
    IonIcon,
  ],
})
export class DiscoverTabComponent {
  @Output() shareCheeseEvent = new EventEmitter<{
    name: string;
    description: string;
  }>();

  constructor() {
    addIcons({ heartOutline, shareOutline });
  }

  onShareCheese(name: string, description: string) {
    this.shareCheeseEvent.emit({ name, description });
  }
}
