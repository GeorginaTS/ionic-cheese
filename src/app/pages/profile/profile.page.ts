import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonSkeletonText,
  IonChip,
  IonList,
} from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import {
  logOutOutline,
  mailOutline,
  calendarOutline,
  locationOutline,
  personOutline,
  peopleOutline,
  restaurantOutline,
} from 'ionicons/icons';
import { User } from '@angular/fire/auth';
import { AppUser } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MenuComponent,
    IonButton,
    IonIcon,
    IonCard,
    RouterLink,
    IonAvatar,
  ],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  userProfile: AppUser = {
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
  };
  loading = true;

  constructor(private authService: AuthService) {
    addIcons({
      logOutOutline,
      mailOutline,
      calendarOutline,
      locationOutline,
      personOutline,
      peopleOutline,
      restaurantOutline,
    });
  }

  async ngOnInit() {
    this.loadProfile();
  }
  ionViewWillEnter() {
    this.loadProfile();
  }
  async loadProfile() {
    try {
      const profile: AppUser | null = await this.authService.getUserProfile();
      this.userProfile = profile ?? {
        uid: '',
        displayName: '',
        email: '',
        photoURL: '',
      };
      console.log('User profile loaded:', this.userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      this.userProfile = {
        uid: '',
        displayName: '',
        email: '',
        photoURL: '',
      };
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
