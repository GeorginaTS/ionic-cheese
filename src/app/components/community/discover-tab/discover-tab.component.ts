import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';

import { CheeseService } from '../../../services/cheese.service';
import { Cheese } from '../../../interfaces/cheese';
import { CommunityCheeseCardComponent } from '../community-cheese-card/community-cheese-card.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-discover-tab',
  templateUrl: './discover-tab.component.html',
  styleUrls: ['./discover-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner,
    CommunityCheeseCardComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class DiscoverTabComponent implements OnInit {
  publicCheeses: Cheese[] = [];
  visibleCheeses: Cheese[] = [];
  batchSize = 5;
  isLoading = true;
  errorMessage = '';
  private cheeseService = inject(CheeseService);

  constructor() {}

  ngOnInit() {
    this.loadPublicCheeses();
  }

  loadPublicCheeses() {
    this.cheeseService.getAllPublicCheeses().subscribe({
      next: (response) => {
        this.publicCheeses = response?.cheeses || [];
        if (this.publicCheeses.length > 0) {
          this.visibleCheeses = this.publicCheeses.slice(0, this.batchSize);
          console.log('Initial visible cheeses:', this.visibleCheeses);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading community cheeses.';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
  loadMore(event: Event) {
    const infiniteEvent = event as InfiniteScrollCustomEvent;
    const currentLength = this.visibleCheeses.length;

    const next = this.publicCheeses.slice(
      currentLength,
      currentLength + this.batchSize
    );
    this.visibleCheeses = [...this.visibleCheeses, ...next];

    setTimeout(() => {
      infiniteEvent.target.complete();
      if (this.visibleCheeses.length >= this.publicCheeses.length) {
        infiniteEvent.target.disabled = true;
      }
    }, 500);
  }
}
