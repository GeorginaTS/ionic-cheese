import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheeseCardComponent } from './cheese-card.component';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { provideRouter } from '@angular/router';

describe('CheeseCardComponent', () => {
  let component: CheeseCardComponent;
  let fixture: ComponentFixture<CheeseCardComponent>;
  let mockFirebaseStorageService: jasmine.SpyObj<FirebaseStorageService>;

  beforeEach(async () => {
    mockFirebaseStorageService = jasmine.createSpyObj('FirebaseStorageService', ['getImageUrl']);
    mockFirebaseStorageService.getImageUrl.and.returnValue(Promise.resolve('mock-url'));

    await TestBed.configureTestingModule({
      imports: [CheeseCardComponent],
      providers: [
        { provide: FirebaseStorageService, useValue: mockFirebaseStorageService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseCardComponent);
    component = fixture.componentInstance;
    
    // Mock cheese input
    component.cheese = {
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