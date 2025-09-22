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

  describe('event handlers', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should handle making data saved event', () => {
      const mockMakingData = { milkTemperature: '32' };
      component.onMakingDataSaved(mockMakingData);
      expect(console.log).toHaveBeenCalledWith(
        'Making data received in parent:',
        mockMakingData
      );
    });

    it('should handle ripening data saved event', () => {
      const mockRipeningData = { ripeningStartDate: '2024-01-01' };
      component.onRipeningDataSaved(mockRipeningData);
      expect(console.log).toHaveBeenCalledWith(
        'Ripening data received in parent:',
        mockRipeningData
      );
    });

    it('should handle taste data saved event', () => {
      const mockTasteData = { visual: { rate: 4, text: 'Good look' } };
      component.onTasteDataSaved(mockTasteData);
      expect(console.log).toHaveBeenCalledWith(
        'Taste data received in parent:',
        mockTasteData
      );
    });
  });
});
