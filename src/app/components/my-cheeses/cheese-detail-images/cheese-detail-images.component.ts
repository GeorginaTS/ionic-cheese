import { Component, inject, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { LoadingController } from '@ionic/angular/standalone';

// Importacions per Swiper v12
import { register } from 'swiper/element/bundle';

// Registrem els components de Swiper
register();

@Component({
  selector: 'app-cheese-detail-images',
  standalone: true,
  templateUrl: './cheese-detail-images.component.html',
  styleUrls: ['./cheese-detail-images.component.scss'],
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheeseDetailImagesComponent implements OnInit {
  @Input() cheeseId!: string;
  photos: string[] = [];
  photoPaths: string[] = [];
  private loadingController = inject(LoadingController);
  private firebaseStorage = inject(FirebaseStorageService);

  constructor() {}

  ngOnInit() {
    this.loadPhotos();
  }

  async loadPhotos() {
    if (!this.cheeseId) {
      console.error('Cannot load photos: Cheese ID is missing');
      return;
    }

    this.photos = [];
    this.photoPaths = [];

    try {
      const loading = await this.loadingController.create({
        message: 'Loading photos...',
        spinner: 'circles',
      });
      await loading.present();

      try {
        // Primer intentem llistar les fotos a Firebase Storage
        const folderPath = `cheeses/${this.cheeseId}`;
        console.log('Loading photos from folder:', folderPath);

        const items = await this.firebaseStorage.listImagesInFolder(folderPath);
        console.log('Found', items.length, 'images in folder');

        // Ordena les fotos pel nom del fitxer (per mantenir l'ordre numèric)
        // Millorem la lògica d'extracció del número per manejar IDs amb guions
        const sortedItems = items.sort((a, b) => {
          const numA = this.extractPhotoNumber(a.name, this.cheeseId);
          const numB = this.extractPhotoNumber(b.name, this.cheeseId);
          return numA - numB;
        });

        // Carrega les URLs per a cada imatge
        for (const item of sortedItems) {
          const url = await this.firebaseStorage.getImageUrl(item.fullPath);
          this.photos.push(url);
          this.photoPaths.push(item.fullPath);
        }
        console.log('Loaded', this.photos.length, 'photos successfully');
        console.log('Photo paths:', this.photoPaths);
      } catch (error) {
        console.error('Error loading photos from Firebase Storage', error);
      } finally {
        await loading.dismiss();
      }
    } catch (error) {
      console.error('Error loading photos', error);
    }
  }
  private extractPhotoNumber(fileName: string, cheeseId: string): number {
    // Format esperat: {cheeseId}-{number}.jpeg
    // Ex: "cheese-123-2.jpeg" amb cheeseId "cheese-123" -> número 2

    const expectedPrefix = `${cheeseId}-`;

    if (!fileName.startsWith(expectedPrefix)) {
      console.warn(
        `File ${fileName} doesn't start with expected prefix ${expectedPrefix}`
      );
      return 0;
    }

    // Eliminem el prefix i l'extensió
    const remainder = fileName.substring(expectedPrefix.length);
    const numberPart = remainder.split('.')[0]; // Elimina l'extensió (.jpeg)

    const number = parseInt(numberPart);
    return isNaN(number) ? 0 : number;
  }
}
