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
import { heartOutline, shareOutline } from 'ionicons/icons';
import { Cheese } from '../../../interfaces/cheese';
import { CheeseService } from '../../../services/cheese.service';
import { Share } from '@capacitor/share';
import { UserProfileCardComponent } from '../../user-profile-card/user-profile-card.component';
import { UserDisplaynameComponent } from '../../user-displayname/user-displayname.component';

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
    UserDisplaynameComponent
],
})
export class CommunityCheeseCardComponent implements OnInit {
  @Input() cheese!: Cheese;

  private router = inject(Router);
  private cheeseService = inject(CheeseService);

  imageUrl: string = 'assets/img/my-cheese-default.jpg';

  constructor() {
    addIcons({
      heartOutline,
      shareOutline,
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
        title: `${name} - Cheesely`,
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

  onLikeCheese(event: Event, cheeseId: string) {
    event.stopPropagation(); // Prevent card click event
    // TODO: Implement like functionality
    console.log('Like cheese:', cheeseId);
  }
}
