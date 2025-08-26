import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { WorldCheesesMapComponent } from "src/app/components/world-cheeses-map/world-cheeses-map.component";
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-world-cheeses',
  templateUrl: './world-cheeses.page.html',
  styleUrls: ['./world-cheeses.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MenuComponent, WorldCheesesMapComponent]
})
export class WorldCheesesPage implements OnInit {

  constructor(private elementRef: ElementRef,
  private focusManager: FocusManagerService) { }

  ngOnInit() {
  }
  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }

}
