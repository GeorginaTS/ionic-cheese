import { Component } from '@angular/core';
import { IonContent} from '@ionic/angular/standalone';
import { LoginComponent } from '../components/login/login.component';
import { MenuComponent } from "../components/menu/menu.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, LoginComponent, MenuComponent],
  standalone: true
})
export class HomePage {
  constructor() {
    
  }
}
