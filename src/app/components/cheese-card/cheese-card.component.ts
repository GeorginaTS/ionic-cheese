import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonTitle, IonButton } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { Cheese } from 'src/app/interfaces/cheese';
import { RouterLink } from '@angular/router';
import { IcoMilkTypeComponent } from "../ico-milk-type/ico-milk-type.component";
import { IonIcon } from '@ionic/angular/standalone';
import { calendarOutline, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-cheese-card',
  templateUrl: './cheese-card.component.html',
  styleUrls: ['./cheese-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, DatePipe, RouterLink, IcoMilkTypeComponent, IonIcon],
})
export class CheeseCardComponent  implements OnInit {
   @Input() cheese!: Cheese;
   
  constructor() { 
    addIcons({ createOutline, trashOutline, calendarOutline });
  }

  ngOnInit() {}

}
