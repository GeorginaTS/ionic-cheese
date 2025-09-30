import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { heart, heartOutline, shareOutline } from 'ionicons/icons';
import { Cheese } from '../../../interfaces/cheese';
import { CheeseService } from '../../../services/cheese.service';
import { AuthService } from '../../../services/auth.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { UserDisplaynameComponent } from '../../user-displayname/user-displayname.component';

@Component({
  selector: 'app-community-cheese-card',
  templateUrl: './community-cheese-card.component.html',
  styleUrls: ['./community-cheese-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, UserDisplaynameComponent],
})
export class CommunityCheeseCardComponent implements OnInit {
  @Input() set cheese(value: Cheese) {
    console.log('🧀 Cheese data received:', value);
    this.cheeseSubject.next(value);
    // Carregar imatge immediatament quan es seteja el cheese
    if (value?._id) {
      console.log('📸 Found cheese ID, loading image for:', value._id);
      this.loadImage();
    } else {
      console.log('⚠️ No cheese ID found in cheese data');
    }
  }

  constructor() {
    addIcons({ heart, heartOutline, shareOutline });
  }

  get cheese(): Cheese {
    return this.cheeseSubject.value;
  }

  @Output() cheeseUpdated = new EventEmitter<Cheese>();

  // Reactive cheese data
  private cheeseSubject = new BehaviorSubject<Cheese>({} as Cheese);
  cheese$ = this.cheeseSubject.asObservable();

  // Services - seguint les instruccions de dependency injection amb inject()
  private cheeseService = inject(CheeseService);
  private authService = inject(AuthService);
  private storageService = inject(FirebaseStorageService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Properties
  imageUrl = '';
  currentUser: any = null;

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.currentUser;
  }

  onToggleLike(): void {
    if (!this.currentUser) {
      console.warn('User must be logged in to like cheese');
      this.router.navigate(['/login']);
      return;
    }

    const currentCheese = this.cheeseSubject.value;
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
            this.cheeseSubject.next(response.cheese);
            this.cheeseUpdated.emit(response.cheese);
          } else {
            // Sinó, mantenir l'update optimista
            this.cheeseUpdated.emit(optimisticCheese);
          }
        },
        error: (error) => {
          console.error('Error toggling like:', error);

          // Revertir update optimista en cas d'error
          this.cheeseSubject.next(currentCheese);
        },
      });
  }

  onCheeseCardClick(): void {
    const currentCheese = this.cheeseSubject.value;
    if (currentCheese?._id) {
      this.router.navigate(['/community/cheese', currentCheese._id]);
    }
  }

  async onShareCheese(
    event: Event,
    title: string,
    text: string
  ): Promise<void> {
    event.stopPropagation();

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } else {
        // Fallback per navegadors que no suporten Web Share API
        await navigator.clipboard.writeText(
          `${title} - ${text} ${window.location.href}`
        );
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  private async loadImage(): Promise<void> {
    const currentCheese = this.cheeseSubject.value;
    if (!currentCheese?._id) {
      console.error('No cheese ID available for loading image');
      this.imageUrl = '/assets/img/my-cheese-default.jpg';
      return;
    }

    console.log('🖼️ Loading image for cheese ID:', currentCheese._id);

    try {
      // Construir la ruta igual que en my-cheeses/cheese-card
      const storageFilePath = `cheeses/${currentCheese._id}/${currentCheese._id}-1.jpeg`;
      console.log('📂 Storage path:', storageFilePath);

      const downloadUrl = await this.storageService.getImageUrl(
        storageFilePath
      );
      this.imageUrl = downloadUrl;
      console.log('✅ Image loaded successfully:', this.imageUrl);
    } catch (error) {
      console.error('❌ Error loading image from Firebase:', error);
      this.imageUrl = '/assets/img/my-cheese-default.jpg';
    }
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-cheese.jpg';
  }
}
