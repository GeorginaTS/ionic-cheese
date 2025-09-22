import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonTitle,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { Cheese } from 'src/app/interfaces/cheese';
import { RouterLink } from '@angular/router';
import { IcoMilkTypeComponent } from '../ico-milk-type/ico-milk-type.component';
import { IonIcon } from '@ionic/angular/standalone';
import { calendarOutline, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { IcoCheeseStatusComponent } from "../ico-cheese-status/ico-cheese-status.component";

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
    IonSpinner,
    IcoCheeseStatusComponent
],
})
export class CheeseCardComponent implements OnInit {
  @Input() cheese!: Cheese;
  photo1: string | '' = '';
  isLoading: boolean = true;

  constructor(private firebaseStorage: FirebaseStorageService) {
    addIcons({ createOutline, trashOutline, calendarOutline });
  }

  ngOnInit() {
    this.loadPhoto();
  }
  ionViewWillEnter() {
    this.loadPhoto();
  }
  async loadPhoto() {
    if (!this.cheese) {
      console.error('Cheese object is null');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    try {
      // Primer intentem carregar des de Firebase Storage
      const storageFilePath = `cheeses/${this.cheese._id}/${this.cheese._id}-1.jpeg`;

      try {
        // Obtenir la URL de la foto des de Firebase Storage
        const downloadUrl = await this.firebaseStorage.getImageUrl(
          storageFilePath
        );
        this.photo1 = downloadUrl;
        console.log('Imatge carregada des de Firebase (card):', downloadUrl);
      } catch (error: any) {
        // Si la foto no existeix a Firebase, intentem carregar-la localment com a fallback
        console.log('No hem trobat la foto a Firebase (card)', error.message);
      }
    } catch (error) {
      console.error('Error carregant la foto (card):', error);
      this.photo1 = '';
    } finally {
      this.isLoading = false;
    }
  }

  // Mètode auxiliar per carregar imatges locals si no estan a Firebase
  private async getLocalImage(fileName: string): Promise<string | null> {
    try {
      // Importem i utilitzem Filesystem directament
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      try {
        const file = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Data,
        });
        return `data:image/jpeg;base64,${file.data}`;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
}
