import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonButton,
} from '@ionic/angular/standalone';
import { Cheese } from 'src/app/interfaces/cheese';
import { IonInput, IonSelect } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { IonTextarea, IonToggle } from '@ionic/angular/standalone';
import { CheeseService } from 'src/app/services/cheese.service';
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
    IonInput, // <- afegit
    IonSelect, // <- afegit
    IonSelectOption,
    IonButton,
    MenuComponent,
    IonTextarea,
    IonToggle,
  ],
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

  constructor(
    private formBuilder: FormBuilder,
    private cheeseService: CheeseService,
    private router: Router
  ) {
    this.addCheeseForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      milkType: new FormControl('', [Validators.required]),
      milkQuantity: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      milkOrigin: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl('', [Validators.maxLength(200)]),
      public: new FormControl(true), // default to true
    });
  }

  addCheese() {
    if (this.addCheeseForm.valid) {
      const cheeseData = this.addCheeseForm.value;
      console.log('New Cheese Data:', cheeseData);
      this.cheeseService.createCheese(cheeseData).subscribe({
        next: (response) => {
          console.log('Formatge creat:', response);
          this.router.navigate(['/my-cheeses']);
        },
        error: (error) => {
          console.error('Error creant el formatge:', error);
        },
      });
    } else {
      console.error('Formulari invàlid', this.addCheeseForm.errors);
       this.addCheeseForm.markAllAsTouched()
    }

    this.addCheeseForm.reset();
  }
}
