import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonItem, IonIcon } from "@ionic/angular/standalone";
import { Cheese } from 'src/app/interfaces/cheese';
import { DatePipe } from '@angular/common';
import { CheeseService } from 'src/app/services/cheese.service';
import { Router, RouterLink } from '@angular/router';
import { IcoCheeseStatusComponent } from "../ico-cheese-status/ico-cheese-status.component";
import { IcoMilkTypeComponent } from "../ico-milk-type/ico-milk-type.component";
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
@Component({
  selector: 'app-cheese-detail-component',
  templateUrl: './cheese-detail.component.html',
  styleUrls: ['./cheese-detail.component.scss'],
  imports: [IonButton, DatePipe, RouterLink, IcoCheeseStatusComponent, IcoMilkTypeComponent, IonItem, IonIcon],
})
export class CheeseDetailComponent  implements OnInit {
  @Input() item!: Cheese;

  constructor(private cheeseService: CheeseService, private router: Router) {
    addIcons({ createOutline, trashOutline});
   }

  ngOnInit() {}

   deleteCheese(id: string): void {
    this.cheeseService.deleteCheese(id).subscribe({
      next: (response) => {
        console.log('Formatge eliminat:', response);
        this.router.navigate(['/my-cheeses']);
      },
      error: (error) => {
        console.error('Error eliminant el formatge:', error);
      }
    });
  }

}
