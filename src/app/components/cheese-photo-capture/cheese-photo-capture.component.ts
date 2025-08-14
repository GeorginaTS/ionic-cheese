import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IonButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-cheese-photo-capture',
  templateUrl: './cheese-photo-capture.component.html',
  styleUrls: ['./cheese-photo-capture.component.scss'],
  imports: [IonButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, CommonModule, IonGrid, IonRow, IonCol],
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
