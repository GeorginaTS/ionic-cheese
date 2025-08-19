import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private firebaseStorage: FirebaseStorageService
  ) {}

  async ngOnInit() {
    await this.loadPhotos();
  }

  async takePhoto() {
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

      const nextNum = this.photos.length + 1;
      const fileName = `${this.id}-${nextNum}.jpeg`;
      const storagePath = `cheeses/${this.id}/${fileName}`;

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
        const items = await this.firebaseStorage.listImagesInFolder(folderPath);

        // Ordena les fotos pel nom del fitxer (per mantenir l'ordre numèric)
        const sortedItems = items.sort((a, b) => {
          const numA = parseInt(a.name.split('-').pop()?.split('.')[0] || '0');
          const numB = parseInt(b.name.split('-').pop()?.split('.')[0] || '0');
          return numA - numB;
        });

        // Carrega les URLs per a cada imatge
        for (const item of sortedItems) {
          const url = await this.firebaseStorage.getImageUrl(item.fullPath);
          this.photos.push(url);
          this.photoPaths.push(item.fullPath);
        }
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
    try {
      const loading = await this.loadingController.create({
        message: 'Deleting photo...',
        spinner: 'circles',
      });
      await loading.present();

      // Eliminar de Firebase Storage
      const path = this.photoPaths[index];
      await this.firebaseStorage.deleteImage(path);

      // Eliminem dels arrays locals
      this.photos.splice(index, 1);
      this.photoPaths.splice(index, 1);

      // Reordenem i guardem les fotos restants
      await this.reorderPhotos();
      this.showToast('Photo deleted 🗑️');

      await loading.dismiss();
    } catch (error) {
      console.error('Error deleting photo', error);
      this.showToast('Error deleting photo ❌', true);
    }
  }

  /** Marcar com a preferida (passa a primera posició) */
  async makeFavorite(index: number) {
    if (index === 0) return; // ja és la primera

    try {
      const loading = await this.loadingController.create({
        message: 'Updating photos...',
        spinner: 'circles',
      });
      await loading.present();

      const favoritePhoto = this.photos.splice(index, 1)[0];
      const favoritePath = this.photoPaths.splice(index, 1)[0];

      this.photos.unshift(favoritePhoto);
      this.photoPaths.unshift(favoritePath);

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
          // No podem moure directament a Firebase Storage, així que:
          // 1. Obtenim la URL de la foto actual
          const currentUrl = this.photos[i];

          // 2. Descarreguem la imatge
          const response = await fetch(currentUrl);
          const blob = await response.blob();

          // 3. Convertim a base64
          const reader = new FileReader();
          const base64Data = await new Promise<string>((resolve) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]); // Eliminar prefix
            };
            reader.readAsDataURL(blob);
          });

          // 4. Eliminem l'antiga si és diferent
          await this.firebaseStorage.deleteImage(this.photoPaths[i]);

          // 5. Pugem amb el nou nom
          const newUrl = await this.firebaseStorage.uploadImage(
            newPath,
            base64Data
          );

          // Guardem la nova URL i path
          newPhotos.push(newUrl);
          newPaths.push(newPath);
        } else {
          // Si ja té el nom correcte, mantenim la URL i path originals
          newPhotos.push(this.photos[i]);
          newPaths.push(this.photoPaths[i]);
        }
      } catch (error) {
        console.error('Error Reordering photos', error);
      }
    }

    // Actualitzem els arrays amb els nous valors
    this.photos = newPhotos;
    this.photoPaths = newPaths;
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
