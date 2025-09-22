import { Component, OnInit, Input, inject, ElementRef } from '@angular/core';
import {
  IonSegmentContent,
  IonSegmentView,
  IonLabel,
  IonSegmentButton,
  IonSegment,
} from '@ionic/angular/standalone';
import { CheeseElaborationMakingComponent } from '../cheese-elaboration-making/cheese-elaboration-making.component';
import { CheeseElaborationRipeningComponent } from '../cheese-elaboration-ripening/cheese-elaboration-ripening.component';
import { CheeseElaborationTasteComponent } from '../cheese-elaboration-taste/cheese-elaboration-taste.component';
import {
  CheeseMaking,
  CheeseRipening,
  CheeseTaste,
} from '../../../interfaces/cheese';
import { FocusManagerService } from 'src/app/services/focus-manager.service';

@Component({
  selector: 'app-cheese-elaboration',
  templateUrl: './cheese-elaboration.component.html',
  styleUrls: ['./cheese-elaboration.component.scss'],
  standalone: true,
  imports: [
    IonSegmentContent,
    IonSegmentView,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    CheeseElaborationMakingComponent,
    CheeseElaborationRipeningComponent,
    CheeseElaborationTasteComponent,
  ],
})
export class CheeseElaborationComponent implements OnInit {
  @Input() cheeseId?: string;

  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);

  constructor() {}

  ngOnInit() {}

  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }
}
