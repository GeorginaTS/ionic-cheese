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

  async deletePhoto(index: number) {
    const fileName = `${this.id}-${index + 1}.jpeg`;
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data
      });
      this.showToast('Foto eliminada 🗑️');
    } catch {
      console.error('Error eliminant la foto');
    }

    // Reenumerar i renombrar
    await this.reorderPhotos();
    await this.loadPhotos();
  }

  private async reorderPhotos() {
    const total = this.photos.length;
    let currentNum = 1;

    for (let i = 0; i < total; i++) {
      const oldName = `${this.id}-${i + 1}.jpeg`;
      try {
        const file = await Filesystem.readFile({
          path: oldName,
          directory: Directory.Data
        });

        const newName = `${this.id}-${currentNum}.jpeg`;
        await Filesystem.writeFile({
          path: newName,
          data: file.data,
          directory: Directory.Data
        });

        if (newName !== oldName) {
          await Filesystem.deleteFile({
            path: oldName,
            directory: Directory.Data
          });
        }

        currentNum++;
      } catch {
        // Si no existeix, continua
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
