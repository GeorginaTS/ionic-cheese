import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAlternativeComponent } from '../../components-alternatives/login-alternative/login-alternative.component';
import { IonFooter, IonToolbar, IonRow, IonContent, IonCol, IonGrid, IonIcon, IonButton } from "@ionic/angular/standalone";


@Component({
  selector: 'app-home-alternative',
  templateUrl: './home-alternative.component.html',
  styleUrls: ['./home-alternative.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonGrid, IonCol, IonContent, IonRow, IonToolbar, IonFooter, CommonModule, LoginAlternativeComponent]
})
export class HomeAlternativeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
