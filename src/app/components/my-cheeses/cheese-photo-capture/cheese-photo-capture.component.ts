import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonButton,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-photo-capture',
  templateUrl: './cheese-photo-capture.component.html',
  styleUrls: ['./cheese-photo-capture.component.scss'],
  imports: [
    IonButton,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
  ],
})
export class CheesePhotoCaptureComponent implements OnInit {
  @Input() id!: string;
  photo: string | null = null;
  photos: string[] = [];
  // Track the Firebase Storage paths for each photo
  private photoPaths: string[] = [];
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private firebaseStorage = inject(FirebaseStorageService);
  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);
  constructor() {}

  async ngOnInit() {
    console.log('CheesePhotoCaptureComponent initialized with ID:', this.id);

    if (!this.id) {
      console.error('Cheese ID is missing or empty!');
      this.showToast('Error: Cheese ID is missing ❌', true);
      return;
    }

    await this.loadPhotos();
  }
    ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }

  async takePhoto() {
    console.log('Taking photo for cheese ID:', this.id);
    if (!this.id) {
      this.showToast('Cheese ID is missing!', true);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving image...',
      spinner: 'circles',
    });
    await loading.present();

    try {
      const image = await Camera.getPhoto({
        quality: 80, // Reduïm una mica per millorar la càrrega
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      // Trobem el següent número disponible de manera segura
      const nextNum = await this.getNextPhotoNumber();
      const fileName = `${this.id}-${nextNum}.jpeg`;
      const storagePath = `cheeses/${this.id}/${fileName}`;

      console.log('Creating photo with path:', storagePath);

      // Puja a Firebase Storage
      if (image.dataUrl) {
        // Eliminar el prefix base64 abans de pujar
        const base64Data = image.dataUrl.split(',')[1];

        // Puja la imatge i obté la URL
        const downloadUrl = await this.firebaseStorage.uploadImage(
          storagePath,
          base64Data
        );

        // Afegim la nova foto a la llista
        this.photos.push(downloadUrl);
        this.photoPaths.push(storagePath);

        console.log(
          'Photo saved successfully. Total photos:',
          this.photos.length
        );

        // Mostrem toast
        this.showToast('Photo saved ✅');
      } else {
        this.showToast('Error: Uploading photo ❌', true);
      }
    } catch (error) {
      console.error('Error capturing or uploading image', error);
      this.showToast('Error saving photo ❌', true);
    } finally {
      await loading.dismiss();
    }
  }

  async loadPhotos() {
    if (!this.id) {
      console.error('Cannot load photos: Cheese ID is missing');
      this.showToast('Error: Cheese ID is missing ❌', true);
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
        const folderPath = `cheeses/${this.id}`;
        console.log('Loading photos from folder:', folderPath);

        const items = await this.firebaseStorage.listImagesInFolder(folderPath);
        console.log('Found', items.length, 'images in folder');

        // Ordena les fotos pel nom del fitxer (per mantenir l'ordre numèric)
        // Millorem la lògica d'extracció del número per manejar IDs amb guions
        const sortedItems = items.sort((a, b) => {
          const numA = this.extractPhotoNumber(a.name, this.id);
          const numB = this.extractPhotoNumber(b.name, this.id);
          return numA - numB;
        });

        // Carrega les URLs per a cada imatge
        for (const item of sortedItems) {
          const url = await this.firebaseStorage.getImageUrl(item.fullPath);
          this.photos.push(url);
          this.photoPaths.push(item.fullPath);
        }

        console.log('Loaded', this.photos.length, 'photos successfully');
      } catch (error) {
        console.error('Error loading photos from Firebase Storage', error);
        this.showToast('Error loading photos  ❌', true);
      } finally {
        await loading.dismiss();
      }
    } catch (error) {
      console.error('Error loading photos', error);
    }
  }

  /** Esborrar una foto */
  async deletePhoto(index: number) {
    if (index < 0 || index >= this.photos.length) {
      this.showToast('Invalid photo index ❌', true);
      return;
    }

    try {
      const loading = await this.loadingController.create({
        message: 'Deleting photo...',
        spinner: 'circles',
      });
      await loading.present();

      // Eliminar de Firebase Storage
      const pathToDelete = this.photoPaths[index];

      try {
        await this.firebaseStorage.deleteImage(pathToDelete);
      } catch (error) {
        console.error('Error deleting from Firebase Storage:', error);
        // Continuem amb l'eliminació local fins i tot si falla Firebase
      }

      // Eliminem dels arrays locals
      this.photos.splice(index, 1);
      this.photoPaths.splice(index, 1);

      // Reordenem i renomenem les fotos restants per mantenir seqüència
      if (this.photos.length > 0) {
        await this.reorderPhotos();
      }

      this.showToast('Photo deleted 🗑️');
      await loading.dismiss();
    } catch (error) {
      console.error('Error deleting photo', error);
      this.showToast('Error deleting photo ❌', true);
    }
  }

  /** Marcar com a preferida (passa a primera posició) */
  async makeFavorite(index: number) {
    if (index === 0) {
      this.showToast('This photo is already the favorite ⭐');
      return; // ja és la primera
    }

    if (index < 0 || index >= this.photos.length) {
      this.showToast('Invalid photo index ❌', true);
      return;
    }

    try {
      const loading = await this.loadingController.create({
        message: 'Updating favorite photo...',
        spinner: 'circles',
      });
      await loading.present();

      // Movem la foto i el path a la primera posició
      const favoritePhoto = this.photos.splice(index, 1)[0];
      const favoritePath = this.photoPaths.splice(index, 1)[0];

      this.photos.unshift(favoritePhoto);
      this.photoPaths.unshift(favoritePath);

      // Reordenem i renomenem totes les fotos per mantenir la seqüència correcta
      await this.reorderPhotos();

      this.showToast('Photo marked as favorite ⭐');
      await loading.dismiss();
    } catch (error) {
      console.error('Error marking as favorite', error);
      this.showToast('Error updating photo order ❌', true);
    }
  }

  /** Reordenar i guardar fotos amb noms coherents id-1, id-2 ... */
  private async reorderPhotos() {
    // Llista temporal per guardar les noves URL i paths
    const newPhotos: string[] = [];
    const newPaths: string[] = [];

    for (let i = 0; i < this.photos.length; i++) {
      const fileName = `${this.id}-${i + 1}.jpeg`;
      const newPath = `cheeses/${this.id}/${fileName}`;

      try {
        // Si el path actual és diferent del nou path, hem de moure la foto
        if (this.photoPaths[i] !== newPath) {
          // 1. Obtenim la URL de la foto actual
          const currentUrl = this.photos[i];

          // 2. Descarreguem la imatge com a blob directament
          const response = await fetch(currentUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const blob = await response.blob();

          // 3. Convertim a base64 de manera més eficient
          const base64Data = await this.blobToBase64(blob);

          // 4. Pugem amb el nou nom primer
          const newUrl = await this.firebaseStorage.uploadImage(
            newPath,
            base64Data
          );

          // 5. Eliminem l'antiga després (per evitar pèrdua de dades)
          await this.firebaseStorage.deleteImage(this.photoPaths[i]);

          // Guardem la nova URL i path
          newPhotos.push(newUrl);
          newPaths.push(newPath);
        } else {
          // Si ja té el nom correcte, mantenim la URL i path originals
          newPhotos.push(this.photos[i]);
          newPaths.push(this.photoPaths[i]);
        }
      } catch (error) {
        console.error(`Error reordering photo ${i + 1}:`, error);
        // En cas d'error, mantenim la foto original
        newPhotos.push(this.photos[i]);
        newPaths.push(this.photoPaths[i]);
      }
    }

    // Actualitzem els arrays amb els nous valors
    this.photos = newPhotos;
    this.photoPaths = newPaths;
  }

  /** Convertir blob a base64 */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Eliminar el prefix data:image/...;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /** Extreu el número de foto del nom del fitxer de manera segura */
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

  /** Troba el següent número de foto disponible */
  private async getNextPhotoNumber(): Promise<number> {
    if (this.photos.length === 0) {
      return 1;
    }

    // Obtenim tots els números existents
    const existingNumbers = this.photoPaths
      .map((path) => {
        const fileName = path.split('/').pop() || '';
        return this.extractPhotoNumber(fileName, this.id);
      })
      .filter((num) => num > 0)
      .sort((a, b) => a - b);

    // Busquem el primer buit en la seqüència o el següent número
    for (let i = 1; i <= existingNumbers.length + 1; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }

    return existingNumbers.length + 1;
  }

  private async showToast(message: string, isError = false) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: isError ? 'danger' : 'success',
    });
    await toast.present();
  }
}
