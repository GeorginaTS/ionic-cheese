import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonItem,
  IonIcon,
  IonTitle,
  IonLabel,
  IonCardTitle,
  IonToolbar,
  IonDatetimeButton,
  IonList,
  IonTextarea,
} from '@ionic/angular/standalone';
import { Cheese } from 'src/app/interfaces/cheese';
import { DatePipe } from '@angular/common';
import { CheeseService } from 'src/app/services/cheese.service';
import { Router, RouterLink } from '@angular/router';
import { IcoCheeseStatusComponent } from '../ico-cheese-status/ico-cheese-status.component';
import { IcoMilkTypeComponent } from '../ico-milk-type/ico-milk-type.component';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { IonDatetime, IonModal } from '@ionic/angular/standalone';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-cheese-detail-component',
  templateUrl: './cheese-detail.component.html',
  styleUrls: ['./cheese-detail.component.scss'],
  imports: [
    IcoCheeseStatusComponent,
    IcoMilkTypeComponent,
    IonLabel,
    IonButton,
    IonDatetimeButton,
    IonItem,
    IonModal,
    IonDatetime,
    IonList,
    IonTextarea,
  ],
})
export class CheeseDetailComponent implements OnInit {
  @Input() item!: Cheese;
  statusModalOpen = false;
  descriptionModalOpen = false;
  photo1: string | '' = '';

  constructor(private cheeseService: CheeseService, private router: Router) {
    addIcons({ createOutline, trashOutline });
  }

  ngOnInit() {
    this.loadPhoto();
  }

  async loadPhoto() {
    if (!this.item) {
      console.error('Cheese object is null');
      return;
    }
    const fileName = `${this.item._id}-1.jpeg`;
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

  updateDate(newDate: string) {
    this.cheeseService
      .updateCheese(this.item._id, { date: newDate })
      .subscribe({
        next: (response) => {
          console.log('Data actualitzada:', response, newDate);
          this.item.date = newDate;
        },
        error: (error) => {
          console.error('Error actualitzant la data:', error);
        },
      });
  }
  setStatus(newStatus: string) {
    this.cheeseService
      .updateCheese(this.item._id, { status: newStatus })
      .subscribe({
        next: (response) => {
          console.log('Estat actualitzat:', response, newStatus);
          this.item.status = newStatus;
          this.statusModalOpen = false;
        },
        error: (error) => {
          console.error("Error actualitzant l'estat:", error);
        },
      });
  }
  saveDescription(newDescription: string) {
    console.log(newDescription);
    this.cheeseService
      .updateCheese(this.item._id, { description: newDescription })
      .subscribe({
        next: (response) => {
          console.log('Descripció actualitzada:', response, newDescription);
          this.item.description = newDescription;
        },
        error: (error) => {
          console.error('Error actualitzant la descripció:', error);
        },
      });
    this.descriptionModalOpen = false;
  }
}
