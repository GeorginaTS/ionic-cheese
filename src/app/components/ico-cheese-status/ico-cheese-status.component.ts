import { Component, Input, OnInit } from '@angular/core';
import { IonChip } from "@ionic/angular/standalone";

@Component({
  selector: 'app-ico-cheese-status',
  template: `<ion-chip color="success" [outline]="true">{{status}}</ion-chip>`,
  styleUrl: './ico-cheese-status.component.scss',
  imports: [IonChip],
})
export class IcoCheeseStatusComponent  {
  @Input() status!: string;


}
