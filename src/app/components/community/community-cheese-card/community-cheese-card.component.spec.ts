import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityCheeseCardComponent } from './community-cheese-card.component';

describe('CommunityCheeseCardComponent', () => {
  let component: CommunityCheeseCardComponent;
  let fixture: ComponentFixture<CommunityCheeseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityCheeseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityCheeseCardComponent);
    component = fixture.componentInstance;

    // Mock cheese input
    component.cheese = {
      _id: '1',
      name: 'Test Cheese',
      description: 'Test Description',
      milkType: 'cow',
      milkOrigin: 'Test Farm',
      milkQuantity: 5,
      status: 'Done',
      date: '2025-09-25',
      userId: 'test-user',
      public: true,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit shareCheeseEvent when onShareCheese is called', () => {
    spyOn(component.shareCheeseEvent, 'emit');

    component.onShareCheese('Test Cheese', 'Test Description');

    expect(component.shareCheeseEvent.emit).toHaveBeenCalledWith({
      name: 'Test Cheese',
      description: 'Test Description',
    });
  });
});
