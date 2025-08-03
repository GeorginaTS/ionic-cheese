import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-ico-milk-type',
  imports: [],
  template: `
    <div class="text-2xl">
      @if(tipus =="vaca") {🐄} 
      @if(tipus =="ovella") {🐑} 
      @if(tipus =="cabra"){🐐} 
      @if(tipus =="búfala") {🐂}
    </div>
  `,
  styleUrl: './ico-milk-type.component.scss',
})
export class IcoMilkTypeComponent {
  @Input() tipus!: string;
}
