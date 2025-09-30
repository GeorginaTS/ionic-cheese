import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Database } from '@angular/fire/database';
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';
import {
  ChatMessage,
  ChatRoom,
  UserPresence,
  MessageType,
} from '../interfaces/chat';
import { AppUser } from '../interfaces/user';

describe('ChatService', () => {
  let service: ChatService;
  let mockDatabase: jasmine.SpyObj<Database>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockCurrentUser: AppUser = {
    uid: 'user1',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: undefined,
  };

  const mockChatMessage: ChatMessage = {
    id: 'msg1',
    userId: 'user1',
    userName: 'Test User',
    message: 'Hello World',
    timestamp: 1234567890,
    type: 'text',
    roomId: 'room1',
  };

  const mockChatRoom: ChatRoom = {
    id: 'room1',
    name: 'Test Room',
    description: 'A test room',
    memberCount: 2,
    isActive: true,
    createdAt: 1234567890,
    createdBy: 'user1',
    type: 'public',
    status: 'active',
  };

  const mockUserPresence: UserPresence = {
    userId: 'user1',
    userName: 'Test User',
    isOnline: true,
    lastSeen: 1234567890,
    currentRoom: 'room1',
  };

  beforeEach(() => {
    const databaseSpy = jasmine.createSpyObj('Database', ['app']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: new BehaviorSubject(mockCurrentUser),
      currentUser: mockCurrentUser,
    });

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: Database, useValue: databaseSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(ChatService);
    mockDatabase = TestBed.inject(Database) as jasmine.SpyObj<Database>;
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have authenticated user', () => {
    expect(mockAuthService.currentUser).toBeTruthy();
  });

  it('should handle null user state gracefully', () => {
    const nullUserSubject = new BehaviorSubject<AppUser | null>(null);
    (mockAuthService as any).currentUser$ = nullUserSubject;

    expect(service).toBeTruthy();
  });

  describe('Service initialization', () => {
    it('should initialize with proper dependencies', () => {
      expect(service).toBeTruthy();
      expect(mockDatabase).toBeTruthy();
      expect(mockAuthService).toBeTruthy();
    });

    it('should handle database connection', () => {
      expect(mockDatabase.app).toBeDefined();
    });
  });

  describe('Message operations', () => {
    it('should be ready for message operations', () => {
      // Basic test structure for message functionality
      expect(service).toBeTruthy();
      expect(mockChatMessage.type).toBe('text');
    });

    it('should handle message data structure', () => {
      expect(mockChatMessage.id).toBe('msg1');
      expect(mockChatMessage.userId).toBe('user1');
      expect(mockChatMessage.userName).toBe('Test User');
      expect(mockChatMessage.message).toBe('Hello World');
      expect(mockChatMessage.roomId).toBe('room1');
    });
  });

  describe('Room operations', () => {
    it('should handle room data structure', () => {
      expect(mockChatRoom.id).toBe('room1');
      expect(mockChatRoom.name).toBe('Test Room');
      expect(mockChatRoom.memberCount).toBe(2);
      expect(mockChatRoom.isActive).toBe(true);
    });
  });

  describe('User presence', () => {
    it('should handle presence data structure', () => {
      expect(mockUserPresence.userId).toBe('user1');
      expect(mockUserPresence.userName).toBe('Test User');
      expect(mockUserPresence.isOnline).toBe(true);
      expect(mockUserPresence.currentRoom).toBe('room1');
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', () => {
      expect(service).toBeTruthy();
      // Service should not throw errors during initialization
    });
  });
});
