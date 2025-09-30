import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { FocusManagerService } from 'src/app/services/focus-manager.service';
import { DiscoverTabComponent } from '../../components/community/discover-tab/discover-tab.component';
import { MeetingsTabComponent } from '../../components/community/meetings-tab/meetings-tab.component';
import { ChatTabComponent } from '../../components/community/chat-tab/chat-tab.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    MenuComponent,
    DiscoverTabComponent,
    MeetingsTabComponent,
    ChatTabComponent,
  ],
})
export class CommunityPage implements OnInit {
  selectedSegment = 'discover';
  private elementRef = inject(ElementRef);
  private focusManager = inject(FocusManagerService);

  ngOnInit() {}

  onShare(cheese: any) {
    if (navigator.share) {
      navigator.share({
        title: cheese.name,
        text: `Descobreix aquest formatge: ${cheese.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback per navegadors que no suporten Web Share API
      navigator.clipboard.writeText(`${cheese.name} - ${window.location.href}`);
    }
  }

  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
  }
}
