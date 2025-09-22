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
import { ToastController, LoadingController } from '@ionic/angular';
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
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

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

  onDateModalDismiss() {
    // Netegem el focus quan es tanca el modal de data per evitar warnings d'accessibilitat
    this.clearFocus();
  }

  private clearFocus() {
    this.focusManager.clearFocus(this.elementRef);
  }

  async saveRipening() {
    if (typeof this.cheeseId === 'string') {
      const loading = await this.loadingController.create({
        message: 'Saving ripening data...',
        spinner: 'circles',
      });
      await loading.present();

      this.cheeseService
        .updateCheese(this.cheeseId, { ripening: this.ripeningForm.value })
        .subscribe({
          next: async (response) => {
            console.log('Ripening data updated:', response);
            this.loadData();
            // Netegem el focus després de guardar
            this.clearFocus();
            await loading.dismiss();
            this.showToast('Ripening data saved successfully ✅');
          },
          error: async (error) => {
            console.error('Error updating ripening data:', error);
            await loading.dismiss();
            this.showToast('Error saving ripening data ❌', true);
          },
        });
    } else {
      console.error('cheeseId is undefined, cannot save ripening data.');
      this.showToast('Error: Cheese ID is missing ❌', true);
    }
  }

  hasData(): boolean {
    const formValue = this.ripeningForm.value;

    return Object.keys(formValue).some((key) => {
      const value = formValue[key];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
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

  ionViewWillLeave() {
    this.clearFocus();
  }

  get f() {
    return this.ripeningForm.controls;
  }
}
