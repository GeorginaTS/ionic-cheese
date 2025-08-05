import { Component, OnInit } from '@angular/core';
import { IonIcon, IonTabButton, IonLabel, IonTabBar } from "@ionic/angular/standalone";
import { heartOutline, homeOutline, personOutline, earthOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonTabButton, IonLabel, IonIcon, IonTabBar, RouterLink],
})
export class MenuComponent  implements OnInit {
  constructor() { 
    addIcons({ heartOutline, homeOutline, personOutline, earthOutline});
  }

  ngOnInit() {}

}
