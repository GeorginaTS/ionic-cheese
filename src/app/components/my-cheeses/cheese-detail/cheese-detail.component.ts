import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
  IonSpinner,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createOutline, shareOutline, trashOutline } from 'ionicons/icons';
import { IonDatetime, IonModal } from '@ionic/angular/standalone';

import { Cheese } from 'src/app/interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { IcoCheeseStatusComponent } from '../ico-cheese-status/ico-cheese-status.component';
import { IcoMilkTypeComponent } from '../ico-milk-type/ico-milk-type.component';
import { addIcons } from 'ionicons';

import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { Share } from '@capacitor/share';
import { environment } from 'src/environments/environment.template';
import { CheeseDetailImagesComponent } from '../cheese-detail-images/cheese-detail-images.component';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

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
    IonSpinner,
    FormsModule,
    IonIcon,
    CheeseDetailImagesComponent,
  ],
})
export class CheeseDetailComponent implements OnInit {
  @Input() item!: Cheese;
  statusModalOpen = false;
  descriptionModalOpen = false;
  photo1: string | '' = '';
  isLoading: boolean = true;

  constructor(
    private cheeseService: CheeseService,
    private firebaseStorage: FirebaseStorageService,
    private focusManager: FocusManagerService,
    private elementRef: ElementRef
  ) {
    addIcons({ createOutline, trashOutline, shareOutline });
  }

  ngOnInit() {
    this.loadPhoto();
  }
  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }

  async loadPhoto() {
    if (!this.item) {
      console.error('Cheese object is null');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    try {
      // Primer intentem carregar des de Firebase Storage
      const storageFilePath = `cheeses/${this.item._id}/${this.item._id}-1.jpeg`;

      try {
        // Obtenir la URL de la foto des de Firebase Storage
        const downloadUrl = await this.firebaseStorage.getImageUrl(
          storageFilePath
        );
        this.photo1 = downloadUrl;
        console.log('Imatge carregada des de Firebase:', downloadUrl);
        this.isLoading = false;
        return;
      } catch (error: any) {
        // Si la foto no existeix a Firebase, intentem carregar-la localment com a fallback
        console.log(
          'No hem trobat la foto a Firebase, intentant localment...',
          error.message
        );
      }

      // Si no hem pogut carregar la foto ni de Firebase ni localment, deixem la foto1 buida
      this.photo1 = '';
    } catch (error) {
      console.error('Error carregant la foto:', error);
      this.photo1 = '';
    } finally {
      this.isLoading = false;
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

  onDateModalDismiss() {
    // Netegem el focus quan es tanca el modal de data per evitar warnings d'accessibilitat
    this.focusManager.clearFocus(this.elementRef);
  }
}
