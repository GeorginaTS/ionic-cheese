import { Component, inject, OnInit, ElementRef } from '@angular/core';
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
  IonDatetimeButton,
} from '@ionic/angular/standalone';
import { Cheese } from 'src/app/interfaces/cheese';
import { IonInput, IonSelect, IonRange } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { IonTextarea, IonToggle } from '@ionic/angular/standalone';
import { CheeseService } from 'src/app/services/cheese.service';
import { IonModal, IonDatetime } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-add-cheese',
  templateUrl: './add-cheese.page.html',
  styleUrls: ['./add-cheese.page.scss'],
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
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    MenuComponent,
    IonTextarea,
    IonToggle,
    IonRange,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
  ],
})
export class AddCheesePage {
  cheese: Cheese = {
    _id: '',
    name: '',
    milkType: '',
    milkQuantity: 2,
    milkOrigin: '',
    date: new Date(),
    status: 'To do',
    public: false,
    userId: '', // Se establecerá de manera asíncrona
    description: '',
  };

  addCheeseForm!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private cheeseService = inject(CheeseService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);
  constructor() {
    this.addCheeseForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      milkType: new FormControl('cow', [Validators.required]),
      milkQuantity: new FormControl('4', [
        Validators.required,
        Validators.min(2),
        Validators.max(20),
      ]),
      milkOrigin: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      date: new FormControl(new Date().toISOString(), [Validators.required]),
      description: new FormControl('', [Validators.maxLength(200)]),
      public: new FormControl(true), // default to true
    });
  }

  async addCheese() {
    if (this.addCheeseForm.valid) {
      const cheeseData = this.addCheeseForm.value;
      const currentUser = await this.authService.getCurrentUserAsync();
      if (!currentUser) {
        console.error('User is not authenticated');
        this.router.navigate(['/home']);
        return;
      }
      cheeseData.userId = currentUser.uid;
      console.log('New Cheese Data:', cheeseData);
      this.cheeseService.createCheese(cheeseData).subscribe({
        next: (response) => {
          console.log('Formatge creat:', response);
          Toast.show({
            text: 'Cheese added successfully!',
          });

          this.router.navigate(['/my-cheeses']);
        },
        error: (error) => {
          console.error('Error creating cheese:', error);
        },
      });
    } else {
      console.error('Invalid form', this.addCheeseForm.errors);
      this.addCheeseForm.markAllAsTouched();
    }
    this.addCheeseForm.reset();
  }

  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }

  onDateModalDismiss() {
    // Netegem el focus quan es tanca el modal de data per evitar warnings d'accessibilitat
    this.focusManager.clearFocus(this.elementRef);
  }
}
