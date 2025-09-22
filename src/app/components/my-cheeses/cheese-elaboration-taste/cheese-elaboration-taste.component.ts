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
} from '@ionic/angular/standalone';
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
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    ReactiveFormsModule,
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

  saveTaste() {
    if (typeof this.cheeseId === 'string') {
      this.cheeseService
        .updateCheese(this.cheeseId, { taste: this.tasteForm.value })
        .subscribe({
          next: (response) => {
            console.log('Taste data updated:', response);
            this.loadData();
            // Netegem el focus després de guardar
            this.clearFocus();
          },
          error: (error) => {
            console.error('Error updating taste data:', error);
          },
        });
    } else {
      console.error('cheeseId is undefined, cannot save taste data.');
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

  get f() {
    return this.tasteForm.controls;
  }
}
