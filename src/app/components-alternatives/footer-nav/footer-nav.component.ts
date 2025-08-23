import { Component, OnInit } from '@angular/core';
import { IonButton, IonToolbar, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  imports: [IonIcon, IonCol, IonRow, IonGrid, IonButton, IonToolbar],
  standalone: true,
})
export class FooterNavComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
