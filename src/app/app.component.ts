import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent {
    constructor() {
    this.initApp();
  }

  async initApp() {
    // Forcem mostrar
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true
    });
  }
}
