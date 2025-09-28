import {
  Component,
  Input,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonSpinner,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  calendarOutline,
  locationOutline,
} from 'ionicons/icons';
import { UserService } from '../../services/user.service';
import { AppUser as User } from '../../interfaces/user';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonAvatar,
    IonSpinner,
    IonIcon,
    IonButton,
  ],
})
export class UserProfileCardComponent implements OnInit, OnChanges {
  @Input() userId!: string;

  user: User | null = null;
  isLoading = false;
  hasError = false;

  private userService = inject(UserService);

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      locationOutline,
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.loadUser();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && changes['userId'].currentValue) {
      this.loadUser();
    }
  }

  public loadUser() {
    if (!this.userId) return;

    this.isLoading = true;
    this.hasError = false;

    this.userService.getUserById(this.userId).subscribe({
      next: (user: User | null) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  getFullLocation(): string {
    if (!this.user) return '';

    const parts = [
      this.user.city,
      this.user.province,
      this.user.country,
    ].filter(Boolean);

    return parts.join(', ');
  }
}
