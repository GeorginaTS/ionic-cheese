import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonIcon, IonCard, IonCardContent, 
  IonItem, IonLabel, IonAvatar, IonSkeletonText, 
  IonChip, IonList
} from '@ionic/angular/standalone';
import { MenuComponent } from "src/app/components/menu/menu.component";
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, mailOutline, calendarOutline, locationOutline, personOutline, peopleOutline, restaurantOutline } from 'ionicons/icons';
import { AppUser } from 'src/app/interfaces/user';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, MenuComponent, 
    IonButton, IonIcon, IonCard, IonCardContent, 
    IonItem, IonLabel, IonAvatar, IonSkeletonText, 
    IonChip, IonList, RouterLink, DatePipe
  ]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  userProfile: Partial<AppUser> | null = null;
  loading = true;

  constructor(private authService: AuthService) { 
    addIcons({ 
      logOutOutline,
      mailOutline,
      calendarOutline,
      locationOutline,
      personOutline,
      peopleOutline
    });
  }

  async ngOnInit() {
    this.user = this.authService.currentUser;
    try {
      if (this.user) {
        this.userProfile = await this.authService.getUserProfile();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
