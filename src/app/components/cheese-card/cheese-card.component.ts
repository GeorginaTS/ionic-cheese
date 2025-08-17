import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonTitle,
  IonButton,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { Cheese } from 'src/app/interfaces/cheese';
import { RouterLink } from '@angular/router';
import { IcoMilkTypeComponent } from '../ico-milk-type/ico-milk-type.component';
import { IonIcon } from '@ionic/angular/standalone';
import { calendarOutline, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-cheese-card',
  templateUrl: './cheese-card.component.html',
  styleUrls: ['./cheese-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    DatePipe,
    RouterLink,
    IcoMilkTypeComponent,
    IonIcon,
  ],
})
export class CheeseCardComponent implements OnInit {
  @Input() cheese!: Cheese;
  photo1: string | '' = '';

  constructor() {
    addIcons({ createOutline, trashOutline, calendarOutline });
  }

  ngOnInit() {
    this.loadPhoto();
  }

  async loadPhoto() {
    if (!this.cheese) {
      console.error('Cheese object is null');
      return;
    }
    const fileName = `${this.cheese._id}-1.jpeg`;
    try {
      const file = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });
      this.photo1 = `data:image/jpeg;base64,${file.data}`;
    } catch {
      this.photo1 = '';
    }
  }
}