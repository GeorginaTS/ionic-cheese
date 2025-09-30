import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, shareOutline } from 'ionicons/icons';
import { Cheese } from '../../../interfaces/cheese';
import { CheeseService } from '../../../services/cheese.service';
import { Share } from '@capacitor/share';
import { UserProfileCardComponent } from '../../user-profile-card/user-profile-card.component';
import { UserDisplaynameComponent } from '../../user-displayname/user-displayname.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-community-cheese-card',
  templateUrl: './community-cheese-card.component.html',
  styleUrls: ['./community-cheese-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardTitle,
    IonButton,
    IonIcon,
    UserDisplaynameComponent,
  ],
})
export class CommunityCheeseCardComponent implements OnInit {
  @Input() cheese!: Cheese;

  private router = inject(Router);
  private cheeseService = inject(CheeseService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  imageUrl: string = 'assets/img/my-cheese-default.jpg';

  constructor() {
    addIcons({
      heartOutline,
      shareOutline, heart
    });
  }

  ngOnInit() {
    this.loadMainImage();
  }

  private loadMainImage() {
    if (this.cheese.imageUrl) {
      this.imageUrl = this.cheese.imageUrl;
    } else if (this.cheese._id) {
      this.cheeseService.getCheeseMainImage(this.cheese._id).subscribe({
        next: (url) => {
          if (url) {
            this.imageUrl = url;
          }
        },
        error: (error) => {
          console.error('Error loading main image:', error);
          // Keep default image
        },
      });
    }
  }

  onCheeseCardClick() {
    this.router.navigate(['/community/cheese', this.cheese._id]);
  }

  async onShareCheese(event: Event, name: string, description: string) {
    event.stopPropagation(); // Prevent card click event

    try {
      await Share.share({
        title: `${name} - Caseus`,
        text: `${description} Made from ${this.cheese.milkQuantity}L of ${this.cheese.milkOrigin} ${this.cheese.milkType} milk.`,
        url: `${window.location.origin}/community/cheese/${this.cheese._id}`,
        dialogTitle: 'Share this amazing cheese!',
      });
    } catch (error) {
      console.error('Error sharing cheese:', error);
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/my-cheese-default.jpg';
  }

  onToggleLike() {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      console.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }
    this.cheeseService.toggleLike(this.cheese._id).subscribe({
      next: (response) => {
        console.log('Like toggled successfully:', response);
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      },
    });
  }
}
