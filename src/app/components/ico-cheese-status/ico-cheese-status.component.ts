import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ico-cheese-status',
  template: `<div class="h-4 text-sm bg-green-400 p-2 flex justify-center items-center font-bold text-center">{{status}}</div>`,
  styleUrl: './ico-cheese-status.component.scss',
})
export class IcoCheeseStatusComponent  {
  @Input() status!: string;


}
