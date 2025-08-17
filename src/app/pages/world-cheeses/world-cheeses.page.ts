import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { WorldCheesesMapComponent } from "src/app/components/world-cheeses-map/world-cheeses-map.component";

@Component({
  selector: 'app-world-cheeses',
  templateUrl: './world-cheeses.page.html',
  styleUrls: ['./world-cheeses.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MenuComponent, WorldCheesesMapComponent]
})
export class WorldCheesesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
