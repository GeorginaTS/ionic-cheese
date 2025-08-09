import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonFab, IonSpinner } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { CheeseService } from '../../services/cheese.service';
import { Cheese } from '../../interfaces/cheese';
import { CheeseCardComponent } from 'src/app/components/cheese-card/cheese-card.component';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';
import { add, addCircleOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-cheeses',
  templateUrl: './my-cheeses.page.html',
  styleUrls: ['./my-cheeses.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MenuComponent,
    CheeseCardComponent,
    IonIcon, RouterLink,
    IonFabButton,
    IonFab,
    IonSpinner
],
})
export class MyCheesesPage implements OnInit {
  cheeses: Cheese[] = [];
  isLoading = true;
  errorMessage = '';
  
  constructor(private cheeseService: CheeseService) {
    addIcons({ addCircleOutline, add });
  }
  ngOnInit(): void {
    this.loadCheeses();
  }
  ionViewWillEnter() {
    this.loadCheeses();
  }
  loadCheeses(): void {
    this.cheeseService.getAllCheeses().subscribe({
      next: (data) => {
        this.cheeses = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error carregant els formatges.';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
}
