import { Component, OnInit, Input, inject, ElementRef } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
  IonRange,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonNote,
} from '@ionic/angular/standalone';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  eyeOutline,
  leafOutline,
  handLeftOutline,
  restaurantOutline,
  ribbonOutline,
  star,
  starOutline,
} from 'ionicons/icons';
import { CheeseTaste, Opinion } from '../../../interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-elaboration-taste',
  templateUrl: './cheese-elaboration-taste.component.html',
  styleUrls: ['./cheese-elaboration-taste.component.scss'],
  standalone: true,
  imports: [
    IonTextarea,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    ReactiveFormsModule,
    IonNote,
  ],
})
export class CheeseElaborationTasteComponent implements OnInit {
  @Input() cheeseId?: string;
  @Input() initialData?: CheeseTaste;

  tasteForm: FormGroup;

  // Definim els aspectes del formatge amb les seves icones
  tasteAspects = [
    {
      key: 'visual',
      label: 'Visual',
      icon: 'eye-outline',
      description: 'Appearance, color, texture',
    },
    {
      key: 'aroma',
      label: 'Aroma',
      icon: 'leaf-outline',
      description: 'Smell and fragrance',
    },
    {
      key: 'texture',
      label: 'Texture',
      icon: 'hand-left-outline',
      description: 'Feel and consistency',
    },
    {
      key: 'flavor',
      label: 'Flavor',
      icon: 'restaurant-outline',
      description: 'Taste and intensity',
    },
    {
      key: 'taste',
      label: 'Overall Taste',
      icon: 'ribbon-outline',
      description: 'General impression',
    },
  ];

  private fb = inject(FormBuilder);
  private cheeseService = inject(CheeseService);
  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  constructor() {
    addIcons({
      saveOutline,
      eyeOutline,
      leafOutline,
      handLeftOutline,
      restaurantOutline,
      ribbonOutline,
      star,
      starOutline,
    });

    // Creem el form amb FormGroups aniuats per a cada aspecte
    this.tasteForm = this.fb.group({
      visual: this.fb.group({
        rate: [0],
        text: [''],
      }),
      aroma: this.fb.group({
        rate: [0],
        text: [''],
      }),
      texture: this.fb.group({
        rate: [0],
        text: [''],
      }),
      flavor: this.fb.group({
        rate: [0],
        text: [''],
      }),
      taste: this.fb.group({
        rate: [0],
        text: [''],
      }),
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.tasteForm.patchValue(this.initialData);
    }
    this.loadData();
  }

  private loadData() {
    if (this.cheeseId) {
      console.log('Loading taste data for cheese:', this.cheeseId);
      try {
        this.cheeseService.getCheeseById(this.cheeseId).subscribe({
          next: (cheese) => {
            if (cheese && cheese.cheese && cheese.cheese.taste) {
              this.tasteForm.patchValue(cheese.cheese.taste);
            }
          },
          error: (error) => {
            console.error('Error loading cheese taste data:', error);
          },
        });
      } catch (error) {
        console.error('Error loading cheese taste data:', error);
      }
    }
  }

  private clearFocus() {
    this.focusManager.clearFocus(this.elementRef);
  }

  async saveTaste() {
    if (typeof this.cheeseId === 'string') {
      const loading = await this.loadingController.create({
        message: 'Saving taste data...',
        spinner: 'circles',
      });
      await loading.present();

      this.cheeseService
        .updateCheese(this.cheeseId, { taste: this.tasteForm.value })
        .subscribe({
          next: async (response) => {
            console.log('Taste data updated:', response);
            this.loadData();
            // Netegem el focus després de guardar
            this.clearFocus();
            await loading.dismiss();
            this.showToast('Taste data saved successfully ✅');
          },
          error: async (error) => {
            console.error('Error updating taste data:', error);
            await loading.dismiss();
            this.showToast('Error saving taste data ❌', true);
          },
        });
    } else {
      console.error('cheeseId is undefined, cannot save taste data.');
      this.showToast('Error: Cheese ID is missing ❌', true);
    }
  }

  hasData(): boolean {
    const formValue = this.tasteForm.value;

    return this.tasteAspects.some((aspect) => {
      const aspectValue = formValue[aspect.key];
      return (
        (aspectValue.rate && aspectValue.rate > 0) ||
        (aspectValue.text && aspectValue.text.trim().length > 0)
      );
    });
  }

  // Helper method per obtenir el valor del rating com a text
  getRatingText(rating: number): string {
    const ratings = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return ratings[rating] || '';
  }

  getStarIcon(currentRating: number, starPosition: number): string {
    return starPosition <= currentRating ? 'star' : 'star-outline';
  }

  setRating(aspectKey: string, rating: number) {
    const aspectGroup = this.tasteForm.get(aspectKey);
    if (aspectGroup) {
      aspectGroup.get('rate')?.setValue(rating);
    }
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

  get f() {
    return this.tasteForm.controls;
  }
}
