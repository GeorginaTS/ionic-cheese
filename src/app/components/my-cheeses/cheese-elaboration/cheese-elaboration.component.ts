import { Component, OnInit } from '@angular/core';
import { IonSegmentContent, IonSegmentView, IonLabel, IonSegmentButton, IonSegment } from "@ionic/angular/standalone";
@Component({
  selector: 'app-cheese-elaboration',
  templateUrl: './cheese-elaboration.component.html',
  styleUrls: ['./cheese-elaboration.component.scss'],
  imports: [IonSegmentContent, IonSegmentView, IonLabel, IonSegmentButton, IonSegment],
})
export class CheeseElaborationComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
