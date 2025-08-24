import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MenuComponent]
})
export class CommunityPage implements OnInit {

  constructor(private elementRef: ElementRef,
  private focusManager: FocusManagerService) { }

  ngOnInit() {
  }
ionViewWillLeave() {
  this.focusManager.clearFocus(this.elementRef);
}
}
