import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { Cheese } from 'src/app/interfaces/cheese';
import { IonInput, IonSelect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-cheese',
  templateUrl: './add-cheese.page.html',
  styleUrls: ['./add-cheese.page.scss'],
  standalone: true,
imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,         // <- afegit
  IonSelect,        // <- afegit
  IonSelectOption,
  IonButton
]
})
export class AddCheesePage {
  cheese: Cheese = {
    _id: '',
    name: '',
    milkType: '',
    milkQuantity: 0,
    milkOrigin: '',
    date: new Date(),
    status: 'To do',
    public: false,
    userId: '',
    description: '',
  };

  addCheeseForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addCheeseForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      milkType: new FormControl('', [Validators.required]),
      milkQuantity: new FormControl('', [Validators.required, Validators.min(1)]),
      milkOrigin: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  addCheese() {
      const cheeseData = this.addCheeseForm.value;
      console.log('New Cheese Data:', cheeseData);
      // Aquí es pot afegir la lògica per enviar les dades al servidor o a un servei
  }
}
