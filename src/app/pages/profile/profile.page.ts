import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonAvatar, IonText, IonSpinner, IonCardHeader, IonCardTitle, IonCardContent, ModalController, IonNote } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { EditProfileModalComponent } from 'src/app/components/edit-profile-modal/edit-profile-modal.component';
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
  addCircleOutline,
  keyOutline,
} from 'ionicons/icons';
import { User } from '@angular/fire/auth';
import { AppUser } from 'src/app/interfaces/user';
import { CheeseService } from 'src/app/services/cheese.service';
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
    IonAvatar,
    IonSpinner,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonNote
],
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  currentUser: any = {
    uid: '',
    displayName: 'User',
    email: '',
    photoURL: '',
  };
  userProfile: AppUser = {
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
  };
  userCheesesCount = 0;
  isLoading = true;
  private authService = inject(AuthService);
  private cheeseService = inject(CheeseService);
  private focusManager = inject(FocusManagerService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  constructor() {
    addIcons({
      logOutOutline,
      mailOutline,
      calendarOutline,
      locationOutline,
      personOutline,
      peopleOutline,
      restaurantOutline,
      addCircleOutline,
      keyOutline,
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
    console.log('Starting loadProfile...');
    this.isLoading = true;

    try {
      this.user = await this.authService.getCurrentUserAsync();
      if (!this.user) {
        console.warn('No authenticated user found');
        this.isLoading = false;
        return;
      }

      // Assignar les dades bàsiques de l'usuari autenticat
      this.currentUser = {
        uid: this.user.uid,
        displayName: this.user.displayName || 'User',
        email: this.user.email || '',
        photoURL: this.user.photoURL || '../assets/icon/cheese.png',
      };

      // Intentar carregar dades adicionals del perfil des de Firestore
      const profile = await this.authService.getUserProfile();
      if (profile) {
        // Si es troba el perfil a Firestore, actualitzar el currentUser
        this.currentUser = {
          ...this.currentUser,
          ...profile,
        };
      }
      console.log('Final currentUser:', this.currentUser);

      // Carregar el nombre de formatges de l'usuari
      this.loadUserCheesesCount();
      console.log('Profile loading completed successfully');
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
      console.log('Setting isLoading to false');
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

  loadUserCheesesCount() {
    if (this.currentUser?.uid) {
      console.log('Loading user cheeses count for UID:', this.currentUser.uid);
      this.cheeseService.getUserCheesesCount(this.currentUser.uid).subscribe({
        next: (count) => {
          this.userCheesesCount = count;
          console.log('User cheeses count loaded:', count);
        },
        error: (error) => {
          console.error('Error loading user cheeses count:', error);
          this.userCheesesCount = 0;
        },
      });
    } else {
      console.log('No user UID available for cheeses count');
      this.userCheesesCount = 0;
    }
  }

  async openEditProfileModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileModalComponent,
      componentProps: {
        currentUser: this.currentUser,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.updated) {
        // Reload user data after update
        this.loadProfile();
      }
    });

    await modal.present();
  }

  goToMyCheeses() {
    this.router.navigate(['/my-cheeses']);
  }
}
