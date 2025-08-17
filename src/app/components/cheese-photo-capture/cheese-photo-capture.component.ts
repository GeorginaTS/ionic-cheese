import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IonButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { IonIcon} from "@ionic/angular/standalone";
@Component({
  selector: 'app-cheese-photo-capture',
  templateUrl: './cheese-photo-capture.component.html',
  styleUrls: ['./cheese-photo-capture.component.scss'],
  imports: [IonButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, CommonModule, IonGrid, IonRow, IonCol, IonIcon],
})
export class CheesePhotoCaptureComponent  implements OnInit {

  @Input() id!: string;
  photo: string | null = null;
  photos: string[] = [];


  constructor(private toastController: ToastController) { }

  async ngOnInit() {
    await this.loadPhotos();
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    const nextNum = this.photos.length + 1;
    const fileName = `${this.id}-${nextNum}.jpeg`;

    // Desa al filesystem
    if (image.dataUrl) {
      await Filesystem.writeFile({
        path: fileName,
        data: image.dataUrl.split(',')[1], // treure prefix base64
        directory: Directory.Data
      });

      // Afegim la nova foto a la llista
      this.photos.push(image.dataUrl);

      // Mostrem toast
      this.showToast('Foto desada correctament ✅');
    } else {
      this.showToast('Error: No s\'ha pogut obtenir la foto ❌');
    }
  }

  async loadPhotos() {
    this.photos = [];

    // Intentar carregar fotos consecutives fins que no existeixi la següent
    let num = 1;
    while (true) {
      const fileName = `${this.id}-${num}.jpeg`;
      try {
        const file = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Data
        });
        this.photos.push(`data:image/jpeg;base64,${file.data}`);
        num++;
      } catch {
        break; // Ja no hi ha més fotos
      }
    }
  }
 /** Esborrar una foto */
  async deletePhoto(index: number) {
    // Eliminem del array
    this.photos.splice(index, 1);

    // Reordenem i guardem les fotos restants
    await this.reorderPhotos();
    this.showToast('Foto eliminada 🗑️');
  }

  /** Marcar com a preferida (passa a primera posició) */
  async makeFavorite(index: number) {
    if (index === 0) return; // ja és la primera

    const favoritePhoto = this.photos.splice(index, 1)[0];
    this.photos.unshift(favoritePhoto);

    await this.reorderPhotos();
    this.showToast('Foto marcada com a preferida ⭐');
  }

  /** Reordenar i guardar fotos amb noms coherents id-1, id-2 ... */
  private async reorderPhotos() {
    for (let i = 0; i < this.photos.length; i++) {
      const fileName = `${this.id}-${i + 1}.jpeg`;
      try {
        // Desa la foto en el nou ordre
        await Filesystem.writeFile({
          path: fileName,
          data: this.photos[i].split(',')[1], // treure prefix base64
          directory: Directory.Data
        });
      } catch (error) {
        console.error('Error guardant la foto', error);
      }
    }

    // Eliminar fitxers antics que sobren (només si es va esborrar alguna foto)
    let num = this.photos.length + 1;
    while (true) {
      const oldFile = `${this.id}-${num}.jpeg`;
      try {
        await Filesystem.deleteFile({ path: oldFile, directory: Directory.Data });
        num++;
      } catch {
        break;
      }
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}
