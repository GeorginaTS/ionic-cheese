import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import {
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
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  shareOutline,
  personOutline,
  calendarOutline,
  warningOutline,
  star,
  starOutline,
  heart,
  heartOutline,
  download,
} from 'ionicons/icons';

import { Cheese } from '../../../interfaces/cheese';
import { CheeseService } from '../../../services/cheese.service';
import { AuthService } from '../../../services/auth.service';
import { CheeseDetailImagesComponent } from 'src/app/components/my-cheeses/cheese-detail-images/cheese-detail-images.component';
import { Share } from '@capacitor/share';
import { UserDisplaynameComponent } from 'src/app/components/user-displayname/user-displayname.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { SeoService } from 'src/app/services/seo.service';
import { PdfService } from 'src/app/services/pdf.service';

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
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private seoService = inject(SeoService);
  private destroyRef = inject(DestroyRef);
  private pdfService = inject(PdfService);

  // Reactive cheese data
  private cheeseSubject = new BehaviorSubject<Cheese | null>(null);
  cheese$ = this.cheeseSubject.asObservable();

  cheese: Cheese | null = null;
  loading = true;
  error = '';
  currentUser: any = null;

  constructor() {
    addIcons({
      shareOutline,
      personOutline,
      calendarOutline,
      warningOutline,
      star,
      starOutline,
      heart,
      heartOutline,
      download,
    });
  }

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.currentUser;

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
          this.cheeseSubject.next(cheese); // Actualitzar BehaviorSubject
          // Actualitzar SEO amb les dades del formatge
          this.updateSEO(cheese);
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
        title: `${this.cheese.name} - Caseus`,
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

  // Helper methods for star rating display
  getStarArray(rating?: number): number[] {
    const filledStars = Math.floor(rating || 0);
    return Array(filledStars).fill(0);
  }

  getEmptyStarArray(rating?: number): number[] {
    const filledStars = Math.floor(rating || 0);
    const emptyStars = 5 - filledStars;
    return Array(emptyStars).fill(0);
  }

  onToggleLike(): void {
    console.log('🧀 onToggleLike called', {
      currentUser: this.currentUser,
      cheese: this.cheese,
    });

    if (!this.currentUser) {
      console.warn('User must be logged in to like cheese');
      return;
    }

    const currentCheese = this.cheese;
    if (!currentCheese) {
      console.warn('No cheese available to like');
      return;
    }

    const userId = this.currentUser.uid;
    const isLiked = currentCheese.likedBy?.includes(userId) ?? false;

    // Optimistic update - actualització immediata de la UI
    const updatedLikedBy = isLiked
      ? (currentCheese.likedBy || []).filter((id) => id !== userId)
      : [...(currentCheese.likedBy || []), userId];

    const optimisticCheese: Cheese = {
      ...currentCheese,
      likedBy: updatedLikedBy,
    };

    // Actualitzar estat local immediatament
    this.cheese = optimisticCheese;
    this.cheeseSubject.next(optimisticCheese);

    // Cridar API amb RxJS Observable
    this.cheeseService
      .toggleLike(currentCheese._id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Like toggled successfully:', response);
          // Si el servidor retorna el formatge actualitzat, utilitzar-lo
          if (response?.cheese) {
            this.cheese = response.cheese;
            this.cheeseSubject.next(response.cheese);
          }
        },
        error: (error) => {
          console.error('Error toggling like:', error);
          // Revertir update optimista en cas d'error
          this.cheese = currentCheese;
          this.cheeseSubject.next(currentCheese);
        },
      });
  }

  /**
   * Actualitza les meta tags SEO amb les dades del formatge
   */
  private updateSEO(cheese: Cheese): void {
    // Actualitzar meta tags bàsiques
    this.seoService.updateCheeseMeta({
      _id: cheese._id,
      name: cheese.name,
      description: cheese.description || `Artisan Cheese ${cheese.name}`,
      milkType: cheese.milkType,
      milkOrigin: cheese.milkOrigin,
      userId: cheese.userId,
      createdAt:
        typeof cheese.date === 'string'
          ? cheese.date
          : cheese.date.toISOString(),
    });

    // Afegir structured data per rich snippets
    this.seoService.addCheeseStructuredData({
      _id: cheese._id,
      name: cheese.name,
      description: cheese.description || `Artisan Cheese ${cheese.name}`,
      milkType: cheese.milkType,
      createdAt:
        typeof cheese.date === 'string'
          ? cheese.date
          : cheese.date.toISOString(),
    });

    console.log('🔍 SEO updated for cheese:', cheese.name);
  }

  downloadPDF(cheese: Cheese): void {
    if (!cheese) {
      return;
    }
    this.pdfService
      .exportCheese$(cheese)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'PDF exported successfully',
            duration: 1800,
            color: 'success',
          });
          await toast.present();
        },
        error: async (err) => {
          console.error('PDF export error', err);
          const toast = await this.toastController.create({
            message: 'Failed to export PDF',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        },
      });
  }
}
