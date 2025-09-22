import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheeseElaborationComponent } from './cheese-elaboration.component';

describe('CheeseElaborationComponent', () => {
  let component: CheeseElaborationComponent;
  let fixture: ComponentFixture<CheeseElaborationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CheeseElaborationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseElaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cheeseId input property', () => {
    const testCheeseId = 'test-cheese-123';
    component.cheeseId = testCheeseId;
    expect(component.cheeseId).toBe(testCheeseId);
  });

 
});
