import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-ico-milk-type',
  imports: [],
  template: `
    <div class="text-2xl">
      @if(tipus =="cow" ) {🐄} 
      @if(tipus =="sheep") {🐑} 
      @if(tipus =="goat"){🐐} 
      @if(tipus =="buffala") {🐂}
      @if(tipus =="mixed") {🥛}
    </div>
  `,
  styleUrl: './ico-milk-type.component.scss',
})
export class IcoMilkTypeComponent {
  @Input() tipus!: string;
}
