import {
  Injectable,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  map,
  switchMap,
  of,
  combineLatest,
} from 'rxjs';
import {
  Database,
  ref,
  push,
  onValue,
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  set,
  remove,
  get,
} from '@angular/fire/database';
import { AuthService } from './auth.service';
import {
  ChatMessage,
  ChatRoom,
  UserPresence,
  MessageType,
  TimestampType,
  ChatError,
  ConnectionStatus,
  TypingIndicator,
} from '../interfaces/chat';

// Export the interfaces for backward compatibility
export { ChatMessage, ChatRoom, UserPresence, MessageType, TimestampType };

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private database = inject(Database);
  private authService = inject(AuthService);
  private injector = inject(Injector);

  private currentRoomSubject = new BehaviorSubject<string | null>(null);
  public currentRoom$ = this.currentRoomSubject.asObservable();

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private roomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  public rooms$ = this.roomsSubject.asObservable();

  private onlineUsersSubject = new BehaviorSubject<UserPresence[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor() {
    console.log('ChatService constructor called');
    this.diagnoseFirebaseSetup();
    this.initializeDefaultRooms().catch((error) => {
      console.error('Error initializing default rooms:', error);
    });
    this.setupPresenceSystem();
  }

  private diagnoseFirebaseSetup() {
    console.log('=== Firebase Diagnostic ===');
    try {
      console.log('Database instance:', this.database);
      console.log('Database app:', this.database.app);
      console.log('Database app options:', this.database.app.options);

      if (this.database.app.options.databaseURL) {
        console.log(
          '✓ Database URL configured:',
          this.database.app.options.databaseURL
        );
      } else {
        console.error('✗ Database URL not configured');
      }
    } catch (error) {
      console.error('Firebase diagnostic error:', error);
    }
    console.log('=== End Diagnostic ===');
  }

  /**
   * Inicialitza les sales de chat per defecte si no existeixen
   */
  private async initializeDefaultRooms() {
    try {
      console.log('Initializing default rooms...');
      const roomsRef = ref(this.database, 'chatRooms');
      console.log('Rooms reference created:', roomsRef);

      const snapshot = await get(roomsRef);
      console.log('Firebase snapshot exists:', snapshot.exists());
      console.log('Snapshot value:', snapshot.val());

      if (!snapshot.exists()) {
        const defaultRooms: Omit<ChatRoom, 'id'>[] = [
          {
            name: 'General Chat',
            description: 'General discussion about artisan cheeses',
            memberCount: 0,
            isActive: true,
            createdAt: Date.now(),
            createdBy: 'system',
            type: 'public' as const,
            status: 'active' as const,
          },
          {
            name: 'Cheese Making Tips',
            description: 'Share your cheese making experiences and tips',
            memberCount: 0,
            isActive: true,
            createdAt: Date.now(),
            createdBy: 'system',
            type: 'public' as const,
            status: 'active' as const,
          },
          {
            name: 'Local Producers',
            description: 'Connect with local cheese producers in your area',
            memberCount: 0,
            isActive: true,
            createdAt: Date.now(),
            createdBy: 'system',
            type: 'public' as const,
            status: 'active' as const,
          },
        ];

        for (const room of defaultRooms) {
          await push(roomsRef, room);
        }
      }

      this.loadRooms();
    } catch (error) {
      console.error('Error in initializeDefaultRooms:', error);
      // Still try to load rooms even if default room creation fails
      this.loadRooms();
    }
  }

  /**
   * Carrega totes les sales de chat
   */
  private loadRooms() {
    try {
      console.log('Loading rooms from Firebase...');
      const roomsRef = ref(this.database, 'chatRooms');

      runInInjectionContext(this.injector, () => {
        onValue(roomsRef, (snapshot) => {
          console.log(
            'Firebase onValue called, snapshot exists:',
            snapshot.exists()
          );
          const rooms: ChatRoom[] = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const room = {
                id: childSnapshot.key,
                ...childSnapshot.val(),
              } as ChatRoom;
              console.log('Found room:', room);
              rooms.push(room);
            });
          }
          console.log('Emitting rooms to subject:', rooms);
          this.roomsSubject.next(rooms);
        });
      });
    } catch (error) {
      console.error('Error in loadRooms:', error);
    }
  }

  /**
   * Selecciona una sala de chat i carrega els seus missatges
   */
  selectRoom(roomId: string) {
    this.currentRoomSubject.next(roomId);
    this.loadMessagesForRoom(roomId);
    this.updateUserPresence(roomId);
  }

  /**
   * Carrega els missatges d'una sala específica (últims 50)
   */
  private loadMessagesForRoom(roomId: string) {
    // Desconnecta listeners anteriors
    const previousRoom = this.currentRoomSubject.value;
    if (previousRoom) {
      const previousRef = ref(this.database, `messages/${previousRoom}`);
      runInInjectionContext(this.injector, () => {
        off(previousRef);
      });
    }

    // Carrega missatges de la nova sala
    const messagesRef = query(
      ref(this.database, `messages/${roomId}`),
      orderByChild('timestamp'),
      limitToLast(50)
    );

    runInInjectionContext(this.injector, () => {
      onValue(messagesRef, (snapshot) => {
        const messages: ChatMessage[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const message = {
              id: childSnapshot.key,
              ...childSnapshot.val(),
            } as ChatMessage;
            messages.push(message);
          });
        }
        // Ordena per timestamp descendentment (més nous primer)
        messages.sort((a, b) => b.timestamp - a.timestamp);
        this.messagesSubject.next(messages);
      });
    });
  }

  /**
   * Envia un missatge a la sala actual
   */
  async sendMessage(
    message: string,
    type: MessageType = 'text'
  ): Promise<void> {
    const currentRoom = this.currentRoomSubject.value;
    const currentUser = this.authService.currentUser;

    if (!currentRoom || !currentUser || !message.trim()) {
      throw new Error(
        'Cannot send message: missing room, user, or message content'
      );
    }

    const newMessage: Omit<ChatMessage, 'id'> = {
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous User',
      message: message.trim(),
      timestamp: Date.now(),
      type,
      roomId: currentRoom,
      ...(currentUser.photoURL && { userAvatar: currentUser.photoURL }),
    };

    try {
      // Afegeix el missatge
      const messagesRef = ref(this.database, `messages/${currentRoom}`);
      await push(messagesRef, newMessage);

      // Actualitza l'últim missatge de la sala
      const roomRef = ref(
        this.database,
        `chatRooms/${currentRoom}/lastMessage`
      );
      await set(roomRef, newMessage);

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Elimina un missatge específic
   */
  async deleteMessage(messageId: string, roomId: string): Promise<void> {
    try {
      const messageRef = ref(this.database, `messages/${roomId}/${messageId}`);
      await remove(messageRef);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Sistema de presència d'usuaris
   */
  private setupPresenceSystem() {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;

    const userPresenceRef = ref(this.database, `presence/${currentUser.uid}`);
    const presenceData: UserPresence = {
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous User',
      isOnline: true,
      lastSeen: Date.now(),
    };

    // Estableix presència online
    set(userPresenceRef, presenceData);

    // Configura per marcar com offline quan es desconnecta
    const offlineData = {
      ...presenceData,
      isOnline: false,
      lastSeen: Date.now(),
    };

    // Escolta canvis en totes les presències
    const allPresenceRef = ref(this.database, 'presence');
    runInInjectionContext(this.injector, () => {
      onValue(allPresenceRef, (snapshot) => {
        const users: UserPresence[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val() as UserPresence;
            if (user.isOnline) {
              users.push(user);
            }
          });
        }
        this.onlineUsersSubject.next(users);
      });
    });

    // Cleanup quan l'usuari surt
    window.addEventListener('beforeunload', () => {
      set(userPresenceRef, offlineData);
    });
  }

  /**
   * Actualitza la sala actual de l'usuari
   */
  private updateUserPresence(roomId: string) {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;

    const userPresenceRef = ref(this.database, `presence/${currentUser.uid}`);
    const updates = {
      currentRoom: roomId,
      lastSeen: Date.now(),
    };

    set(userPresenceRef, updates);
  }

  /**
   * Crea una nova sala de chat
   */
  async createRoom(name: string, description: string): Promise<string> {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to create a room');
    }

    const roomData: Omit<ChatRoom, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      memberCount: 1,
      isActive: true,
      createdAt: Date.now(),
      createdBy: currentUser.uid,
      type: 'public',
      status: 'active',
    };

    try {
      const roomsRef = ref(this.database, 'chatRooms');
      const newRoomRef = await push(roomsRef, roomData);
      return newRoomRef.key!;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Elimina una sala de chat (només el creador o admin)
   */
  async deleteRoom(roomId: string): Promise<void> {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to delete a room');
    }

    try {
      // Elimina la sala
      const roomRef = ref(this.database, `chatRooms/${roomId}`);
      await remove(roomRef);

      // Elimina tots els missatges de la sala
      const messagesRef = ref(this.database, `messages/${roomId}`);
      await remove(messagesRef);

      console.log('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  /**
   * Obté l'historial complet de missatges d'una sala
   */
  getMessageHistory(
    roomId: string,
    limit: number = 100
  ): Observable<ChatMessage[]> {
    const messagesRef = query(
      ref(this.database, `messages/${roomId}`),
      orderByChild('timestamp'),
      limitToLast(limit)
    );

    return new Observable<ChatMessage[]>((observer) => {
      runInInjectionContext(this.injector, () => {
        onValue(messagesRef, (snapshot) => {
          const messages: ChatMessage[] = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const message = {
                id: childSnapshot.key,
                ...childSnapshot.val(),
              } as ChatMessage;
              messages.push(message);
            });
          }
          messages.sort((a, b) => b.timestamp - a.timestamp);
          observer.next(messages);
        });
      });
    });
  }

  /**
   * Neteja els listeners quan es destrueix el servei
   */
  cleanup() {
    runInInjectionContext(this.injector, () => {
      const currentRoom = this.currentRoomSubject.value;
      if (currentRoom) {
        const messagesRef = ref(this.database, `messages/${currentRoom}`);
        off(messagesRef);
      }

      const roomsRef = ref(this.database, 'chatRooms');
      off(roomsRef);

      const presenceRef = ref(this.database, 'presence');
      off(presenceRef);
    });
  }

  /**
   * Obté informació d'una sala específica
   */
  getRoom(roomId: string): Observable<ChatRoom | null> {
    const roomRef = ref(this.database, `chatRooms/${roomId}`);
    return new Observable<ChatRoom | null>((observer) => {
      runInInjectionContext(this.injector, () => {
        onValue(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            const room = {
              id: snapshot.key,
              ...snapshot.val(),
            } as ChatRoom;
            observer.next(room);
          } else {
            observer.next(null);
          }
        });
      });
    });
  }
}
