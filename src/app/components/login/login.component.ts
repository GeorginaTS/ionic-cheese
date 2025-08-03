import { Component, OnInit } from '@angular/core';
import { IonButton, IonItem, IonInput, IonInputPasswordToggle } from "@ionic/angular/standalone";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonButton, IonItem, IonInput, IonInputPasswordToggle],
})
export class LoginComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  login() {
    console.log('Login button clicked');
    // Implement login logic here
  }
}
