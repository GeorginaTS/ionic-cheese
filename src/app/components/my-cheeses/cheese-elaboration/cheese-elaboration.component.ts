import { Component, OnInit, Input } from '@angular/core';
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

  constructor() {}

  ngOnInit() {}

  onMakingDataSaved(makingData: CheeseMaking) {
    console.log('Making data received in parent:', makingData);
    // TODO: Save to service or emit to parent component
    this.showSaveMessage('Making process data saved successfully!');
  }

  onRipeningDataSaved(ripeningData: CheeseRipening) {
    console.log('Ripening data received in parent:', ripeningData);
    // TODO: Save to service or emit to parent component
    this.showSaveMessage('Ripening process data saved successfully!');
  }

  onTasteDataSaved(tasteData: CheeseTaste) {
    console.log('Taste data received in parent:', tasteData);
    // TODO: Save to service or emit to parent component
    this.showSaveMessage('Taste evaluation data saved successfully!');
  }

  private showSaveMessage(message: string) {
    // TODO: Implement toast notification
    console.log(message);
  }
}
