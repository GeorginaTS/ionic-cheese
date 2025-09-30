import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sendOutline,
  personOutline,
  timeOutline,
  chatbubbleOutline,
  trashOutline,
} from 'ionicons/icons';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { AppUser } from '../../../interfaces/user';
import {
  ChatRoom,
  ChatMessage,
  TimestampType,
  FirebaseTimestamp,
} from '../../../interfaces/chat';

@Component({
  selector: 'app-chat-tab',
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonItem,
    IonAvatar,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonSpinner,
    IonText,
  ],
})
export class ChatTabComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  selectedRoom: ChatRoom | null = null;
  newMessage = '';
  isLoading = true; // Start with loading state
  isLoadingMessages = false;

  // Observable data from Firebase
  chatRooms: ChatRoom[] = [];
  messages: ChatMessage[] = [];

  constructor() {
    addIcons({
      sendOutline,
      personOutline,
      timeOutline,
      chatbubbleOutline,
      trashOutline,
    });
  }

  ngOnInit() {
    this.initializeChat();
  }

  ngOnDestroy() {
    // Component cleanup handled by takeUntilDestroyed
  }

  private initializeChat() {
    // Para la demo, usamos directamente el General Chat (primera sala)
    // Subscribe to chat rooms from the service
    this.chatService.rooms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rooms: ChatRoom[]) => {
          this.chatRooms = rooms;
          this.isLoading = false;
          // Auto-select General Chat (primera sala) siempre
          if (rooms.length > 0) {
            this.selectedRoom = rooms[0];
            this.loadMessages(rooms[0].id);
          }
        },
        error: (error: Error) => {
          console.error('Error loading chat rooms:', error);
          this.isLoading = false;
        },
      });
  }

  selectRoom(room: ChatRoom) {
    this.selectedRoom = room;
    this.loadMessages(room.id);
  }

  private loadMessages(roomId: string) {
    this.isLoadingMessages = true;

    // Select room in the service and subscribe to messages
    this.chatService.selectRoom(roomId);

    this.chatService.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (messages: ChatMessage[]) => {
          this.messages = messages;
          this.isLoadingMessages = false;
        },
        error: (error: Error) => {
          console.error('Error loading messages:', error);
          this.isLoadingMessages = false;
        },
      });
  }
  async sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      await this.chatService.sendMessage(this.newMessage.trim(), 'text');

      // Clear input after successful send
      this.newMessage = '';
    } catch (error: unknown) {
      console.error('Error sending message:', error);
    }
  }
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTime(timestamp: TimestampType): string {
    if (!timestamp) return '';

    let date: Date;

    // Type guard for Firebase Timestamp
    if (
      typeof timestamp === 'object' &&
      'toDate' in timestamp &&
      typeof timestamp.toDate === 'function'
    ) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  }

  /**
   * Comprova si un missatge pertany a l'usuari actual
   */
  isOwnMessage(message: ChatMessage): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser ? message.userId === currentUser.uid : false;
  }

  /**
   * Elimina un missatge propi
   */
  async deleteMessage(message: ChatMessage) {
    if (!this.isOwnMessage(message)) {
      console.error('Cannot delete message: not own message');
      return;
    }

    if (!message.id) {
      console.error('Cannot delete message: message ID is missing');
      return;
    }

    try {
      await this.chatService.deleteMessage(message.id, message.roomId);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
}
