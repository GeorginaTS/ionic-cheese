import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

// Mocks
const mockAuth = {
  currentUser: {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    getIdToken: () => Promise.resolve('token'),
  },
  signOut: () => Promise.resolve(),
};
const mockFirestoreService = {
  setDocument: jasmine
    .createSpy('setDocument')
    .and.returnValue(Promise.resolve()),
  getDocument$: jasmine
    .createSpy('getDocument$')
    .and.returnValue(
      of({ displayName: 'Test User', email: 'test@example.com' })
    ),
};
const mockRouter = { navigate: jasmine.createSpy('navigate') };
const mockToast = { present: jasmine.createSpy('present') };
const mockToastController = {
  create: jasmine
    .createSpy('create')
    .and.returnValue(Promise.resolve(mockToast)),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastController },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current user', () => {
    expect(service.currentUser?.uid).toBe(mockAuth.currentUser.uid);
    expect(service.currentUser?.email).toBe(mockAuth.currentUser.email);
    expect(service.currentUser?.displayName).toBe(mockAuth.currentUser.displayName);
  });

  it('should get id token', (done) => {
    service.getIdToken$().subscribe((token) => {
      expect(token).toBe('token');
      done();
    });
  });

  it('should get user profile from Firestore', async () => {
    const profile = await service.getUserProfile('123');
    expect(profile?.uid).toBe('123');
    expect(profile?.displayName).toBe('Test User');
    expect(profile?.email).toBe('test@example.com');
  });

  it('should handle logout', async () => {
    spyOn(mockAuth, 'signOut').and.returnValue(Promise.resolve());
    await service.logout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show toast on error', async () => {
    await (service as any).showToast('Error', 'danger');
    expect(mockToastController.create).toHaveBeenCalled();
    expect(mockToast.present).toHaveBeenCalled();
  });
});
