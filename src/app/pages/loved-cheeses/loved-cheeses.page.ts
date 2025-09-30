import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Cheese } from '../../interfaces/cheese';
import { CheeseService } from '../../services/cheese.service';
import { AuthService } from '../../services/auth.service';
import { CommunityCheeseCardComponent } from '../../components/community/community-cheese-card/community-cheese-card.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-loved-cheeses',
  templateUrl: './loved-cheeses.page.html',
  styleUrls: ['./loved-cheeses.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonIcon,
    CommunityCheeseCardComponent,
    MenuComponent,
  ],
})
export class LovedCheesesPage implements OnInit {
  private cheeseService = inject(CheeseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  lovedCheeses: Cheese[] = [];
  loading = true;
  error = '';
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    if (this.currentUser) {
      this.loadLovedCheeses();
    } else {
      this.error = 'User not authenticated';
      this.loading = false;
    }
  }

  loadLovedCheeses() {
    this.loading = true;
    this.error = '';

    this.cheeseService.getAllPublicCheeses().subscribe({
      next: (response) => {
        // Filtrar els formatges que l'usuari actual ha posat like
        this.lovedCheeses = response.cheeses.filter(
          (cheese) =>
            cheese.likedBy && cheese.likedBy.includes(this.currentUser.uid)
        );
        this.loading = false;
        console.log('Loved cheeses loaded:', this.lovedCheeses.length);
      },
      error: (err) => {
        console.error('Error loading loved cheeses:', err);
        this.error = 'Failed to load loved cheeses';
        this.loading = false;
      },
    });
  }

  onCheeseUpdated(updatedCheese: Cheese) {
    // Actualitzar el formatge a la llista quan es modifica (per exemple, quan es treu el like)
    const index = this.lovedCheeses.findIndex(
      (cheese) => cheese._id === updatedCheese._id
    );
    if (index !== -1) {
      // Si l'usuari ha tret el like, eliminar el formatge de la llista
      if (!updatedCheese.likedBy?.includes(this.currentUser.uid)) {
        this.lovedCheeses.splice(index, 1);
      } else {
        // Sinó, actualitzar el formatge
        this.lovedCheeses[index] = updatedCheese;
      }
    }
  }
}
