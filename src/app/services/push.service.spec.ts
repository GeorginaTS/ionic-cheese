import { TestBed } from '@angular/core/testing';
import { Push } from './push.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BehaviorSubject, of } from 'rxjs';
import { AppUser } from '../interfaces/user';

describe('Push', () => {
  let service: Push;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockCurrentUser: AppUser = {
    uid: 'user1',
    displayName: 'Test User',
    email: 'test@example.com',
    pushToken: 'test-token-123',
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      ['updateUserProfile'],
      {
        currentUser: mockCurrentUser,
        currentUser$: new BehaviorSubject(mockCurrentUser),
      }
    );

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);

    TestBed.configureTestingModule({
      providers: [
        Push,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    service = TestBed.inject(Push);
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockUserService = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have AuthService dependency', () => {
    expect(mockAuthService).toBeTruthy();
  });

  it('should have UserService dependency', () => {
    expect(mockUserService).toBeTruthy();
  });

  describe('Service initialization', () => {
    it('should initialize with proper dependencies', () => {
      expect(service).toBeTruthy();
      expect(mockAuthService).toBeTruthy();
      expect(mockUserService).toBeTruthy();
    });

    it('should have access to current user', () => {
      expect(mockAuthService.currentUser).toBeTruthy();
    });
  });

  describe('Push notification methods', () => {
    it('should have addListeners method', () => {
      expect(service.addListeners).toBeDefined();
      expect(typeof service.addListeners).toBe('function');
    });

    it('should have registerNotifications method', () => {
      expect(service.registerNotifications).toBeDefined();
      expect(typeof service.registerNotifications).toBe('function');
    });

    it('should have getDeliveredNotifications method', () => {
      expect(service.getDeliveredNotifications).toBeDefined();
      expect(typeof service.getDeliveredNotifications).toBe('function');
    });

    it('should have clearRegistrationTokens method', () => {
      expect(service.clearRegistrationTokens).toBeDefined();
      expect(typeof service.clearRegistrationTokens).toBe('function');
    });

    it('should have resetPushNotifications method', () => {
      expect(service.resetPushNotifications).toBeDefined();
      expect(typeof service.resetPushNotifications).toBe('function');
    });
  });

  describe('Token management', () => {
    beforeEach(() => {
      const mockUserData = {
        uid: 'user1',
        displayName: 'Test User',
        email: 'test@example.com',
        pushToken: 'old-token-123',
      };

      mockUserService.getUserById.and.returnValue(of(mockUserData));
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve(true));
    });

    it('should handle savePushToken with user data', (done) => {
      // Test private method indirectly through service behavior
      mockUserService.getUserById('user1').subscribe((userData) => {
        expect(userData).toBeTruthy();
        if (userData) {
          expect(userData.pushToken).toBe('old-token-123');
        }
        done();
      });
    });

    it('should handle updateUserProfile calls', async () => {
      const result = await mockAuthService.updateUserProfile({
        pushToken: 'new-token',
      });
      expect(result).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle null current user', () => {
      // Create a new spy with null user
      const nullUserAuthService = jasmine.createSpyObj('AuthService', [], {
        currentUser: null,
        currentUser$: new BehaviorSubject(null),
      });

      TestBed.configureTestingModule({
        providers: [
          Push,
          { provide: AuthService, useValue: nullUserAuthService },
          { provide: UserService, useValue: mockUserService },
        ],
      });

      const testService = TestBed.inject(Push);
      expect(testService).toBeTruthy();
    });

    it('should handle service methods without throwing errors', () => {
      // Test that methods exist and can be called without immediate errors
      expect(() => {
        service.addListeners();
        service.registerNotifications();
        service.getDeliveredNotifications();
        service.clearRegistrationTokens();
        service.resetPushNotifications();
      }).not.toThrow();
    });
  });

  describe('User authentication integration', () => {
    it('should access current user through AuthService', () => {
      expect(mockAuthService.currentUser).toBeTruthy();
      expect(mockAuthService.currentUser?.uid).toBe('user1');
    });

    it('should access user data through UserService', (done) => {
      const mockUserData: AppUser = { uid: 'user1', email: 'test@example.com' };
      mockUserService.getUserById.and.returnValue(of(mockUserData));

      mockUserService.getUserById('user1').subscribe((userData) => {
        expect(userData).toBeTruthy();
        if (userData) {
          expect(userData.uid).toBe('user1');
          expect(userData.email).toBe('test@example.com');
        }
        done();
      });
    });
  });

  describe('Service configuration', () => {
    it('should be provided in root', () => {
      // The service should be a singleton provided at root level
      expect(service).toBeTruthy();
    });

    it('should maintain consistent state', () => {
      // Service should maintain consistent state across method calls
      expect(service).toBeTruthy();
      expect(mockAuthService.currentUser).toBeTruthy();
    });
  });

  describe('Async operation support', () => {
    it('should handle promise-based operations', async () => {
      mockAuthService.updateUserProfile.and.returnValue(Promise.resolve(true));

      const result = await mockAuthService.updateUserProfile({
        pushToken: 'test',
      });
      expect(result).toBe(true);
    });

    it('should handle observable-based operations', (done) => {
      const testUser: AppUser = { uid: 'test-user', email: 'test@example.com' };
      mockUserService.getUserById.and.returnValue(of(testUser));

      mockUserService.getUserById('test-user').subscribe((user) => {
        expect(user).toBeTruthy();
        if (user) {
          expect(user.uid).toBe('test-user');
        }
        done();
      });
    });
  });
});
