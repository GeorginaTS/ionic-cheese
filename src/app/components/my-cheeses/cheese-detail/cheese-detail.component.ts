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
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonHeader,
  IonButtons,
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
import { CheeseDetailImagesComponent } from '../cheese-detail-images/cheese-detail-images.component';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-detail-component',
  templateUrl: './cheese-detail.component.html',
  styleUrls: ['./cheese-detail.component.scss'],
  imports: [
    IcoCheeseStatusComponent,
    IcoMilkTypeComponent,
    IonButton,
    IonDatetimeButton,
    IonItem,
    IonModal,
    IonDatetime,
    IonList,
    IonTextarea,
    IonSpinner,
    IonInput,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    FormsModule,
    CheeseDetailImagesComponent,
  ],
})
export class CheeseDetailComponent implements OnInit {
  @Input() item!: Cheese;
  statusModalOpen = false;
  descriptionModalOpen = false;
  milkQuantityModalOpen = false;
  milkTypeModalOpen = false;
  milkOriginModalOpen = false;
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

  saveMilkQuantity(newQuantity: string | number) {
    const quantityNumber =
      typeof newQuantity === 'string' ? parseFloat(newQuantity) : newQuantity;
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      console.error('Quantitat invàlida:', newQuantity);
      return;
    }

    this.cheeseService
      .updateCheese(this.item._id, { milkQuantity: quantityNumber })
      .subscribe({
        next: (response) => {
          console.log('Quantitat actualitzada:', response, quantityNumber);
          this.item.milkQuantity = quantityNumber;
        },
        error: (error) => {
          console.error('Error actualitzant la quantitat:', error);
        },
      });
    this.milkQuantityModalOpen = false;
  }

  saveMilkType(newType: string) {
    const validTypes = ['cow', 'sheep', 'goat', 'buffala', 'mixed'];
    if (!validTypes.includes(newType)) {
      console.error('Tipus de llet invàlid:', newType);
      return;
    }

    this.cheeseService
      .updateCheese(this.item._id, { milkType: newType })
      .subscribe({
        next: (response) => {
          console.log('Tipus de llet actualitzat:', response, newType);
          this.item.milkType = newType;
        },
        error: (error) => {
          console.error('Error actualitzant el tipus de llet:', error);
        },
      });
    this.milkTypeModalOpen = false;
  }

  saveMilkOrigin(newOrigin: string) {
    if (!newOrigin || newOrigin.trim().length === 0) {
      console.error('Origen invàlid:', newOrigin);
      return;
    }

    this.cheeseService
      .updateCheese(this.item._id, { milkOrigin: newOrigin.trim() })
      .subscribe({
        next: (response) => {
          console.log('Origen actualitzat:', response, newOrigin.trim());
          this.item.milkOrigin = newOrigin.trim();
        },
        error: (error) => {
          console.error("Error actualitzant l'origen:", error);
        },
      });
    this.milkOriginModalOpen = false;
  }

  onDateModalDismiss() {
    // Netegem el focus quan es tanca el modal de data per evitar warnings d'accessibilitat
    this.focusManager.clearFocus(this.elementRef);
  }

  onOriginModalDismiss() {
    // Netegem el focus quan es tanca el modal d'origen per evitar warnings d'accessibilitat
    this.focusManager.clearFocus(this.elementRef);
  }
}
