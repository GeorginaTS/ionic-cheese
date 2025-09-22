import { Component, OnInit, Input, inject, ElementRef } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { CheeseRipening } from '../../../interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-elaboration-ripening',
  templateUrl: './cheese-elaboration-ripening.component.html',
  styleUrls: ['./cheese-elaboration-ripening.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    ReactiveFormsModule,
  ],
})
export class CheeseElaborationRipeningComponent implements OnInit {
  @Input() cheeseId?: string;
  @Input() initialData?: CheeseRipening;

  ripeningForm: FormGroup;

  private fb = inject(FormBuilder);
  private cheeseService = inject(CheeseService);
  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);

  constructor() {
    addIcons({ saveOutline });

    this.ripeningForm = this.fb.group({
      ripeningStartDate: [''],
      estimatedDuration: [''],
      temperature: [''],
      humidity: [''],
      turningFlips: [''],
      washing: [''],
      brushing: [''],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.ripeningForm.patchValue(this.initialData);
    }
    this.loadData();
  }

  private loadData() {
    if (this.cheeseId) {
      console.log('Loading ripening data for cheese:', this.cheeseId);
      try {
        this.cheeseService.getCheeseById(this.cheeseId).subscribe({
          next: (cheese) => {
            if (cheese && cheese.cheese && cheese.cheese.ripening) {
              this.ripeningForm.patchValue(cheese.cheese.ripening);
            }
          },
          error: (error) => {
            console.error('Error loading cheese ripening data:', error);
          },
        });
      } catch (error) {
        console.error('Error loading cheese ripening data:', error);
      }
    }
  }

  onDateChange(event: any) {
    this.ripeningForm.get('ripeningStartDate')?.setValue(event.detail.value);
    // Netegem el focus per evitar warnings d'accessibilitat
    this.clearFocus();
  }

  private clearFocus() {
    this.focusManager.clearFocus(this.elementRef);
  }

  saveRipening() {
    if (typeof this.cheeseId === 'string') {
      this.cheeseService
        .updateCheese(this.cheeseId, { ripening: this.ripeningForm.value })
        .subscribe({
          next: (response) => {
            console.log('Ripening data updated:', response);
            this.loadData();
            // Netegem el focus després de guardar
            this.clearFocus();
          },
          error: (error) => {
            console.error('Error updating ripening data:', error);
          },
        });
    } else {
      console.error('cheeseId is undefined, cannot save ripening data.');
    }
  }

  hasData(): boolean {
    const formValue = this.ripeningForm.value;

    return Object.keys(formValue).some((key) => {
      const value = formValue[key];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  }

  get f() {
    return this.ripeningForm.controls;
  }
}
