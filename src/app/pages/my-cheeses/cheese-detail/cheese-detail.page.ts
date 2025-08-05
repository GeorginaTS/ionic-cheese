import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cheese } from 'src/app/interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { CheeseDetailComponent } from 'src/app/components/cheese-detail/cheese-detail.component';
@Component({
  selector: 'app-cheese-detail-page',
  templateUrl: './cheese-detail.page.html',
  styleUrls: ['./cheese-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MenuComponent, IonIcon, IonButton, RouterLink, CheeseDetailComponent]
})
export class CheeseDetailPage implements OnInit {

  cheeseId: string = '';
  cheese: Cheese | null = null;
  isLoading: boolean = true;

  private routeSub!: Subscription;
  constructor(private route: ActivatedRoute, private cheeseService: CheeseService, private location: Location, private router: Router) {
    // Add icons to the IonIcon component
    addIcons({
      arrowBackCircleOutline: arrowBackCircleOutline,
    })
   }
ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap): void => {
      const id: string | null = params.get('id');
      if (id) {
        this.cheeseId = id;
        this.loadCheese();
      }
    });
  }
loadCheese(): void {
  this.isLoading = true;

  this.cheeseService.getCheeseById(this.cheeseId).subscribe({
    next: (response: { msg: string; cheese: Cheese }): void => {
      this.cheese = response.cheese;
      this.isLoading = false;
      console.log('Formatge carregat:', this.cheese);
    },
    error: (error: any): void => {
      console.error('Error carregant el formatge:', error);
      this.isLoading = false;
    }
  });

  }
 
}
