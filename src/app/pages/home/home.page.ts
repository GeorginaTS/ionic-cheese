import { Component, ElementRef, inject } from '@angular/core';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { LoginComponent } from '../../components/login/login.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { RegisterComponent } from '../../components/register/register.component';
import { FormsModule } from '@angular/forms';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    LoginComponent,
    MenuComponent,
    RegisterComponent,
    FormsModule,
  ],
  standalone: true,
})
export class HomePage {
  selectedTab: 'login' | 'register' = 'login';
  private elementRef = inject(ElementRef);
  private focusManager = inject(FocusManagerService);
  constructor() {
  }
  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }
}
