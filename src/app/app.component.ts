import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CustomIconsService } from './services/custom-icons.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private customIcons: CustomIconsService  ) {}
}


