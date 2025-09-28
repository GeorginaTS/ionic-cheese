import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AppUser as User } from '../interfaces/user';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('Firestore', [
      'collection',
      'doc',
    ]);

    TestBed.configureTestingModule({
      providers: [UserService, { provide: Firestore, useValue: firestoreSpy }],
    });
    service = TestBed.inject(UserService);
    mockFirestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null for empty userId', () => {
    service.getUserById('').subscribe((user) => {
      expect(user).toBeNull();
    });
  });

  it('should return fallback user on error', () => {
    // Aquest test és més simple ja que els tests de Firestore requereixen més setup
    // En un entorn real, utilitzaríem l'emulador de Firestore per als tests
    service.getUserById('test-id').subscribe((user) => {
      expect(user).toBeDefined();
      expect(user?.uid).toBe('test-id');
    });
  });
});
