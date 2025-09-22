import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CheeseDetailComponent } from './cheese-detail.component';
import { CheeseService } from 'src/app/services/cheese.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { FocusManagerService } from 'src/app/services/focus-manager.service';
import { Cheese } from 'src/app/interfaces/cheese';

// Mock Services
class MockCheeseService {
  updateCheese = jasmine.createSpy('updateCheese').and.returnValue(of({}));
}

class MockFirebaseStorageService {
  getImageUrl = jasmine
    .createSpy('getImageUrl')
    .and.returnValue(Promise.resolve('https://test-image.jpg'));
}

class MockFocusManagerService {
  clearFocus = jasmine.createSpy('clearFocus');
}

describe('CheeseDetailComponent', () => {
  let component: CheeseDetailComponent;
  let fixture: ComponentFixture<CheeseDetailComponent>;
  let cheeseService: MockCheeseService;
  let firebaseStorageService: MockFirebaseStorageService;
  let focusManagerService: MockFocusManagerService;

  const mockCheese: Cheese = {
    _id: '123',
    name: 'Test Cheese',
    date: '2025-09-21',
    status: 'afining',
    description: 'Test description',
    public: false,
    userId: 'testuser',
    milkType: 'cow',
    milkOrigin: 'local',
    milkQuantity: 5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheeseDetailComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: CheeseService, useClass: MockCheeseService },
        {
          provide: FirebaseStorageService,
          useClass: MockFirebaseStorageService,
        },
        { provide: FocusManagerService, useClass: MockFocusManagerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseDetailComponent);
    component = fixture.componentInstance;
    cheeseService = TestBed.inject(
      CheeseService
    ) as unknown as MockCheeseService;
    firebaseStorageService = TestBed.inject(
      FirebaseStorageService
    ) as unknown as MockFirebaseStorageService;
    focusManagerService = TestBed.inject(
      FocusManagerService
    ) as unknown as MockFocusManagerService;
  });

  it('should create', () => {
    component.item = mockCheese;
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadPhoto on initialization', () => {
      component.item = mockCheese;
      spyOn(component, 'loadPhoto');

      component.ngOnInit();

      expect(component.loadPhoto).toHaveBeenCalled();
    });
  });

  describe('loadPhoto', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should set isLoading to false and return early if item is null', async () => {
      component.item = null as any;
      component.isLoading = true;

      await component.loadPhoto();

      expect(component.isLoading).toBe(false);
      expect(component.photo1).toBe('');
    });

    it('should load photo from Firebase Storage successfully', async () => {
      const testUrl = 'https://firebase-image.jpg';
      firebaseStorageService.getImageUrl.and.returnValue(
        Promise.resolve(testUrl)
      );

      await component.loadPhoto();

      expect(firebaseStorageService.getImageUrl).toHaveBeenCalledWith(
        `cheeses/${mockCheese._id}/${mockCheese._id}-1.jpeg`
      );
      expect(component.photo1).toBe(testUrl);
      expect(component.isLoading).toBe(false);
    });

    it('should handle Firebase Storage error and set photo1 to empty', async () => {
      firebaseStorageService.getImageUrl.and.returnValue(
        Promise.reject(new Error('File not found'))
      );

      await component.loadPhoto();

      expect(component.photo1).toBe('');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('updateDate', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should update cheese date successfully', () => {
      const newDate = '2025-12-25';
      cheeseService.updateCheese.and.returnValue(of({ success: true }));

      component.updateDate(newDate);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        date: newDate,
      });
      expect(component.item.date).toBe(newDate);
    });

    it('should handle update date error', () => {
      const newDate = '2025-12-25';
      const originalDate = component.item.date;
      cheeseService.updateCheese.and.returnValue(throwError('Update failed'));
      spyOn(console, 'error');

      component.updateDate(newDate);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        date: newDate,
      });
      expect(component.item.date).toBe(originalDate); // Should remain unchanged
      expect(console.error).toHaveBeenCalledWith(
        'Error actualitzant la data:',
        'Update failed'
      );
    });
  });

  describe('setStatus', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should update cheese status successfully', () => {
      const newStatus = 'madurat';
      cheeseService.updateCheese.and.returnValue(of({ success: true }));

      component.setStatus(newStatus);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        status: newStatus,
      });
      expect(component.item.status).toBe(newStatus);
      expect(component.statusModalOpen).toBe(false);
    });

    it('should handle update status error', () => {
      const newStatus = 'madurat';
      const originalStatus = component.item.status;
      cheeseService.updateCheese.and.returnValue(throwError('Update failed'));
      spyOn(console, 'error');

      component.setStatus(newStatus);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        status: newStatus,
      });
      expect(component.item.status).toBe(originalStatus); // Should remain unchanged
      expect(console.error).toHaveBeenCalledWith(
        "Error actualitzant l'estat:",
        'Update failed'
      );
    });
  });

  describe('saveDescription', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should update cheese description successfully', () => {
      const newDescription = 'Updated description';
      cheeseService.updateCheese.and.returnValue(of({ success: true }));

      component.saveDescription(newDescription);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        description: newDescription,
      });
      expect(component.item.description).toBe(newDescription);
      expect(component.descriptionModalOpen).toBe(false);
    });

    it('should handle update description error', () => {
      const newDescription = 'Updated description';
      const originalDescription = component.item.description;
      cheeseService.updateCheese.and.returnValue(throwError('Update failed'));
      spyOn(console, 'error');

      component.saveDescription(newDescription);

      expect(cheeseService.updateCheese).toHaveBeenCalledWith('123', {
        description: newDescription,
      });
      expect(component.item.description).toBe(originalDescription); // Should remain unchanged
      expect(console.error).toHaveBeenCalledWith(
        'Error actualitzant la descripció:',
        'Update failed'
      );
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call focusManager clearFocus', () => {
      component.item = mockCheese;

      component.ionViewWillLeave();

      expect(focusManagerService.clearFocus).toHaveBeenCalled();
    });
  });

  describe('Component properties', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should initialize with correct default values', () => {
      expect(component.statusModalOpen).toBe(false);
      expect(component.descriptionModalOpen).toBe(false);
      expect(component.photo1).toBe('');
      expect(component.isLoading).toBe(true);
    });

    it('should toggle statusModalOpen', () => {
      component.statusModalOpen = false;
      component.statusModalOpen = true;
      expect(component.statusModalOpen).toBe(true);

      component.statusModalOpen = false;
      expect(component.statusModalOpen).toBe(false);
    });

    it('should toggle descriptionModalOpen', () => {
      component.descriptionModalOpen = false;
      component.descriptionModalOpen = true;
      expect(component.descriptionModalOpen).toBe(true);

      component.descriptionModalOpen = false;
      expect(component.descriptionModalOpen).toBe(false);
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      component.item = mockCheese;
    });

    it('should show spinner when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('ion-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should show cheese detail images when photo1 is not empty', () => {
      component.isLoading = false;
      component.photo1 = 'https://test-image.jpg';
      fixture.detectChanges();

      const cheeseImages = fixture.nativeElement.querySelector(
        'app-cheese-detail-images'
      );
      expect(cheeseImages).toBeTruthy();
    });

    it('should show default image when photo1 is empty and not loading', () => {
      component.isLoading = false;
      component.photo1 = '';
      fixture.detectChanges();

      const defaultImage = fixture.nativeElement.querySelector(
        'img[src*="my-cheese-default.jpg"]'
      );
      expect(defaultImage).toBeTruthy();
    });

    it('should pass correct cheeseId to cheese-detail-images component', () => {
      component.isLoading = false;
      component.photo1 = 'https://test-image.jpg';
      fixture.detectChanges();

      const cheeseImages = fixture.nativeElement.querySelector(
        'app-cheese-detail-images'
      );
      expect(cheeseImages.getAttribute('ng-reflect-cheese-id')).toBe(
        mockCheese._id
      );
    });
  });
});
