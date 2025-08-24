import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonAvatar, IonText } from '@ionic/angular/standalone';
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
import { FocusManagerService } from 'src/app/services/focus-manager.service';

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
    IonAvatar
],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  currentUser: any = null;
  userProfile: AppUser = {
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
  };
  isLoading = true;

  constructor(private authService: AuthService, private focusManager: FocusManagerService,  private elementRef: ElementRef) {
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
  // El mètode ionViewWillLeave:
ionViewWillLeave() {
  this.focusManager.clearFocus(this.elementRef);
}
  async loadProfile() {
    this.isLoading = true;

    try {
      this.user = this.authService.currentUser;
      if (!this.user) {
        console.warn('No authenticated user found');
        return;
      }

      // Assignar les dades bàsiques de l'usuari autenticat
      this.currentUser = {
        uid: this.user.uid,
        displayName: this.user.displayName || 'User',
        email: this.user.email || '',
        photoURL: this.user.photoURL || '',
      };

      // Intentar carregar dades adicionals del perfil des de Firestore
      const profile = await this.authService.getUserProfile();
      if (profile) {
        // Si es troba el perfil a Firestore, actualitzar el currentUser
        this.currentUser = {
          ...this.currentUser,
          ...profile,
        };
        console.log('User profile loaded from Firestore:', profile);
      }

      console.log('Final currentUser:', this.currentUser);
    } catch (error) {
      console.error('Error loading profile:', error);
      if (this.user) {
        // Si falla la càrrega del perfil però tenim un usuari autenticat
        this.currentUser = {
          uid: this.user.uid,
          displayName: this.user.displayName || 'User',
          email: this.user.email || '',
          photoURL: this.user.photoURL || '',
        };
      } else {
        // Fallback si no hi ha usuari
        this.currentUser = {
          uid: '',
          displayName: 'Guest',
          email: '',
          photoURL: '',
        };
      }
    } finally {
      this.isLoading = false;
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
