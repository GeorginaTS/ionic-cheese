import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonTitle } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { Cheese } from 'src/app/interfaces/cheese';
import { RouterLink } from '@angular/router';
import { IcoMilkTypeComponent } from "../ico-milk-type/ico-milk-type.component";
import { IcoCheeseStatusComponent } from '../ico-cheese-status/ico-cheese-status.component';

@Component({
  selector: 'app-cheese-card',
  templateUrl: './cheese-card.component.html',
  styleUrls: ['./cheese-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, DatePipe, RouterLink, IcoMilkTypeComponent, IcoCheeseStatusComponent, IonTitle],
})
export class CheeseCardComponent  implements OnInit {
   @Input() cheese!: Cheese;
   
  constructor() { }

  ngOnInit() {}

}
