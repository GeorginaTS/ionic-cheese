import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonSelectOption, IonLabel, IonButton, IonSelect, IonTextarea } from "@ionic/angular/standalone";

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
    IonTextarea
  ],
})
export class AddNoteModalComponent {
  @Output() close = new EventEmitter<boolean>();
  noteForm = new FormGroup({
    noteText: new FormControl('', [Validators.required]),
    noteDate: new FormControl(new Date().toISOString()),
    noteAbout: new FormControl('Others'),
  });
  constructor() {}

saveNote() {
  console.log('Note saved:', this.noteForm.value);
  this.close.emit(true);
}


}
