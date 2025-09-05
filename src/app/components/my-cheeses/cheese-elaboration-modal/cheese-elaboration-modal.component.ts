import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonItem, IonLabel, IonTextarea, IonInput, IonSelectOption, IonSelect, IonButton } from "@ionic/angular/standalone";
import { ToastController } from '@ionic/angular';
import { CheeseService } from 'src/app/services/cheese.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cheese-elaboration-modal',
  templateUrl: './cheese-elaboration-modal.component.html',
  styleUrls: ['./cheese-elaboration-modal.component.scss'],
  imports: [IonItem, IonLabel, IonTextarea, IonInput, IonSelect, IonSelectOption, IonButton],
})
export class CheeseElaborationModalComponent implements OnInit {
  @Input() id!: string;
  elaborationForm = new FormGroup({
    temperature: new FormControl(''),
    time: new FormControl(''),
    fermentation: new FormControl('Choose one'),
    ferments: new FormControl('none'),
    rennet: new FormControl('0'),
    calcium: new FormControl('0'),
    comments: new FormControl(''),
  });
  constructor(private toastController: ToastController,     
    private formBuilder: FormBuilder,
    private cheeseService: CheeseService,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {}
  saveElaboration() {
    if (this.elaborationForm.valid) {
      const formData = this.elaborationForm.value;
      console.log('Saving elaboration data:', formData);
      // Here you would typically send the data to your backend API
    } else {
      console.log('Form is invalid');
    }
  }
}
