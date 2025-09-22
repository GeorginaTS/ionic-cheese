import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
  ElementRef,
} from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { CheeseMaking } from '../../../interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-elaboration-making',
  templateUrl: './cheese-elaboration-making.component.html',
  styleUrls: ['./cheese-elaboration-making.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
  ],
})
export class CheeseElaborationMakingComponent implements OnInit {
  @Input() cheeseId?: string;

  makingForm: FormGroup;

  private fb = inject(FormBuilder);
  private cheeseService = inject(CheeseService);

  constructor() {
    addIcons({ saveOutline });

    this.makingForm = this.fb.group({
      milkTemperature: [''],
      starterCultures: [''],
      milkPH: [''],
      coagulant: [''],
      coagulationTime: [''],
      curdCutting: [''],
      molding: [''],
      appliedPressure: [''],
      salting: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    if (this.cheeseId) {
      // TODO: Load making data from service based on cheeseId
      console.log('Loading making data for cheese:', this.cheeseId);
      try {
        this.cheeseService.getCheeseById(this.cheeseId).subscribe({
          next: (cheese) => {
            if (cheese && cheese.cheese && cheese.cheese.making) {
              this.makingForm.patchValue(cheese.cheese.making);
            }
          },
          error: (error) => {
            console.error('Error loading cheese making data:', error);
          },
        });
      } catch (error) {
        console.error('Error loading cheese making data:', error);
      } 
    }
  }

  saveMaking() {
    if (typeof this.cheeseId === 'string') {
      this.cheeseService
        .updateCheese(this.cheeseId, { making: this.makingForm.value })
        .subscribe({
          next: (response) => {
            console.log('Making data actualitzada:', response);
            this.loadData();
          },
          error: (error) => {
            console.error('Error actualitzant la descripció:', error);
          },
        });
      // this.descriptionModalOpen = false; // Remove or update if needed
    } else {
      console.error('cheeseId is undefined, cannot save making data.');
    }
  }

  hasData(): boolean {
    const formValue = this.makingForm.value;

    return Object.keys(formValue).some((key) => {
      const value = formValue[key];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  }

  get f() {
    return this.makingForm.controls;
  }
}
