import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAlternativeComponent } from '../../components-alternatives/login-alternative/login-alternative.component';
import { IonContent, IonIcon } from "@ionic/angular/standalone";
import  { FooterNavComponent } from '../../components-alternatives/footer-nav/footer-nav.component';


@Component({
  selector: 'app-home-alternative',
  templateUrl: './home-alternative.component.html',
  styleUrls: ['./home-alternative.component.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, LoginAlternativeComponent, FooterNavComponent]
})
export class HomeAlternativeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
