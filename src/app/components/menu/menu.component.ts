import { Component, OnInit } from '@angular/core';
import { IonIcon, IonTabButton, IonLabel, IonBadge, IonTabBar } from "@ionic/angular/standalone";
import { heart, calendar, musicalNote, personCircleOutline, chatbubblesOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonTabButton, IonLabel, IonBadge, IonIcon, IonTabBar, RouterLink],
})
export class MenuComponent  implements OnInit {

  constructor() { 
    addIcons({ heart, calendar, musicalNote,personCircleOutline, chatbubblesOutline});
  }

  ngOnInit() {}

}
