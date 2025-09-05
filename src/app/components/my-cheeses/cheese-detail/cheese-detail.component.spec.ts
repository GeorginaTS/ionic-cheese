import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheeseDetailComponent } from './cheese-detail.component';
import { CheeseService } from 'src/app/services/cheese.service';
import { Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { of } from 'rxjs';

describe('CheeseDetailComponent', () => {
  let component: CheeseDetailComponent;
  let fixture: ComponentFixture<CheeseDetailComponent>;
  let mockCheeseService: jasmine.SpyObj<CheeseService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFirebaseStorageService: jasmine.SpyObj<FirebaseStorageService>;

  beforeEach(async () => {
    mockCheeseService = jasmine.createSpyObj('CheeseService', ['updateCheese']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFirebaseStorageService = jasmine.createSpyObj('FirebaseStorageService', ['getImageUrl']);
    
    mockCheeseService.updateCheese.and.returnValue(of({
      _id: 'test-id',
      name: 'Test Cheese',
      date: '2023-01-01',
      status: 'aging',
      description: 'Test description',
      milkType: 'cow',
      public: false,
      userId: 'test-user',
      milkOrigin: 'local',
      milkQuantity: 2
    }));
    mockFirebaseStorageService.getImageUrl.and.returnValue(Promise.resolve('mock-url'));

    await TestBed.configureTestingModule({
      imports: [CheeseDetailComponent],
      providers: [
        { provide: CheeseService, useValue: mockCheeseService },
        { provide: Router, useValue: mockRouter },
        { provide: FirebaseStorageService, useValue: mockFirebaseStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseDetailComponent);
    component = fixture.componentInstance;
    
    // Mock item input
    component.item = {
      _id: 'test-id',
      name: 'Test Cheese',
      date: '2023-01-01',
      status: 'aging',
      description: 'Test description',
      milkType: 'cow',
      public: false,
      userId: 'test-user',
      milkOrigin: 'local',
      milkQuantity: 2
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});