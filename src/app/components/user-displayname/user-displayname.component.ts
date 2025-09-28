import {
  Component,
  Input,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { UserService } from '../../services/user.service';
import { AppUser as User } from '../../interfaces/user';

@Component({
  selector: 'app-user-displayname',
  templateUrl: './user-displayname.component.html',
  styleUrls: ['./user-displayname.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner],
})
export class UserDisplaynameComponent implements OnInit, OnChanges {
  @Input() userId!: string;

  displayName: string = '';
  city: string = '';
  isLoading = false;

  private userService = inject(UserService);

  constructor() {
    addIcons({
      personOutline,
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.loadUserDisplayName();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && changes['userId'].currentValue) {
      this.loadUserDisplayName();
    }
  }

  private loadUserDisplayName() {
    if (!this.userId) return;

    this.isLoading = true;
    this.displayName = '';

    this.userService.getUserById(this.userId).subscribe({
      next: (user: User | null) => {
        console.log('🎯 UserDisplaynameComponent - Usuario recibido:', user);
        console.log('🎯 displayName:', user?.displayName);
        console.log('🎯 city:', user?.city);

        this.displayName = user?.displayName || 'Anonymous User';
        this.city = user?.city || 'Unknown City';

        console.log('🎯 displayName final:', this.displayName);
        console.log('🎯 city final:', this.city);

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        this.displayName = 'Unknown User';
        this.isLoading = false;
      },
    });
  }
}
