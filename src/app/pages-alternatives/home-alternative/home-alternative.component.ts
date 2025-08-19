import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAlternativeComponent } from '../../components-alternatives/login-alternative/login-alternative.component';

@Component({
  selector: 'app-home-alternative',
  templateUrl: './home-alternative.component.html',
  styleUrls: ['./home-alternative.component.scss'],
  standalone: true,
  imports: [CommonModule, LoginAlternativeComponent]
})
export class HomeAlternativeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
