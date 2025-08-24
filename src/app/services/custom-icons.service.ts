import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';

@Injectable({
  providedIn: 'root'
})
export class CustomIconsService {
  constructor() {
    addIcons({
      mycheese: 'assets/icon/cheese-alternative-logo.svg',
      myheart: 'assets/icon/heart-cheese-lovers.svg',
      myhome: 'assets/icon/casita-home.svg',
      // otros iconos...
    });
  }
}
