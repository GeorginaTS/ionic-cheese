import { Component, EventEmitter, Output, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonItem,
  IonSelectOption,
  IonLabel,
  IonButton,
  IonSelect,
  IonTextarea,
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { FocusManagerService } from '../../services/focus-manager.service';

@Component({
  selector: 'app-add-note-modal',
  templateUrl: './add-note-modal.component.html',
  styleUrls: ['./add-note-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonItem,
    IonSelectOption,
    IonLabel,
    IonButton,
    IonSelect,
    IonTextarea,
  ],
})
export class AddNoteModalComponent {
  @Output() close = new EventEmitter<boolean>();
  noteForm = new FormGroup({
    noteText: new FormControl('', [Validators.required]),
    noteDate: new FormControl(new Date().toISOString()),
    noteAbout: new FormControl('Others'),
  });
  constructor(
    private toastController: ToastController,
    private focusManager: FocusManagerService,
    private elementRef: ElementRef
  ) {}

  async saveNote() {
    console.log('Note saved:', this.noteForm.value);

    const toast = await this.toastController.create({
      message: 'Note added successfully ✅',
      duration: 1000, // 1 segon
      position: 'middle', // o 'top' o 'middle'
      color: 'success', // opcional: 'primary', 'warning', 'danger', etc.
    });

    await toast.present();
    this.close.emit(true);
  }

  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }
}
