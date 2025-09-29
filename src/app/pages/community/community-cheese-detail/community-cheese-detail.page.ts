import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  shareOutline,
  personOutline,
  calendarOutline,
  warningOutline,
} from 'ionicons/icons';

import { Cheese } from '../../../interfaces/cheese';
import { CheeseService } from '../../../services/cheese.service';
import { CheeseDetailImagesComponent } from 'src/app/components/my-cheeses/cheese-detail-images/cheese-detail-images.component';
import { Share } from '@capacitor/share';
import { UserDisplaynameComponent } from 'src/app/components/user-displayname/user-displayname.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-community-cheese-detail',
  templateUrl: './community-cheese-detail.page.html',
  styleUrls: ['./community-cheese-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    CheeseDetailImagesComponent,
    UserDisplaynameComponent,
    MenuComponent,
  ],
})
export class CommunityCheeseDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cheeseService = inject(CheeseService);
  private toastController = inject(ToastController);

  cheese: Cheese | null = null;
  loading = true;
  error = '';

  constructor() {
    addIcons({
      shareOutline,
      personOutline,
      calendarOutline,
      warningOutline,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const cheeseId = params['id'];
      if (cheeseId) {
        this.loadCheese(cheeseId);
      } else {
        this.error = 'No cheese ID provided';
        this.loading = false;
      }
    });
  }

  loadCheese(cheeseId?: string) {
    this.loading = true;
    this.error = '';

    const id = cheeseId || this.route.snapshot.params['id'];
    if (!id) {
      this.error = 'No cheese ID provided';
      this.loading = false;
      return;
    }

    // Get the specific public cheese by ID
    this.cheeseService.getAllPublicCheeses().subscribe({
      next: (response) => {
        const cheese = response.cheeses.find((c: Cheese) => c._id === id);
        if (!cheese) {
          this.error = 'Cheese not found or not public';
        } else {
          this.cheese = cheese;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cheese:', err);
        this.error = 'Failed to load cheese details';
        this.loading = false;
      },
    });
  }

  formatDate(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/cheese-placeholder.jpg';
  }

  async shareCheese() {
    if (!this.cheese) return;

    try {
      await Share.share({
        title: `${this.cheese.name} - Cheesely`,
        text: `Check out this amazing ${this.cheese.milkType} cheese made by a fellow cheese maker! Made from ${this.cheese.milkQuantity}L of ${this.cheese.milkOrigin} ${this.cheese.milkType} milk.`,
        url: window.location.href,
        dialogTitle: 'Share this amazing cheese!',
      });
    } catch (error) {
      console.error('Error sharing cheese:', error);
      // Fallback to copying to clipboard
      this.copyToClipboard();
    }
  }

  private async copyToClipboard() {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);

      const toast = await this.toastController.create({
        message: 'Link copied to clipboard',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      const toast = await this.toastController.create({
        message: 'Failed to copy link',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
