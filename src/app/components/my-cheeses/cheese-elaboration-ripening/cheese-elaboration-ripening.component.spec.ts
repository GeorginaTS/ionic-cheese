import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CheeseElaborationRipeningComponent } from './cheese-elaboration-ripening.component';
import { CheeseService } from '../../../services/cheese.service';
import { CheeseRipening } from '../../../interfaces/cheese';
import { FocusManagerService } from '../../../services/focus-manager.service';

// Mock del CheeseService
class MockCheeseService {
  updateCheese = jasmine
    .createSpy('updateCheese')
    .and.returnValue(of({ success: true }));
  getCheeseById = jasmine
    .createSpy('getCheeseById')
    .and.returnValue(of({ cheese: { ripening: null } }));
}

// Mock del FocusManagerService
class MockFocusManagerService {
  clearFocus = jasmine.createSpy('clearFocus');
}

describe('CheeseElaborationRipeningComponent', () => {
  let component: CheeseElaborationRipeningComponent;
  let fixture: ComponentFixture<CheeseElaborationRipeningComponent>;
  let mockCheeseService: MockCheeseService;
  let mockFocusManagerService: MockFocusManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheeseElaborationRipeningComponent, ReactiveFormsModule],
      providers: [
        { provide: CheeseService, useClass: MockCheeseService },
        { provide: FocusManagerService, useClass: MockFocusManagerService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseElaborationRipeningComponent);
    component = fixture.componentInstance;
    mockCheeseService = TestBed.inject(
      CheeseService
    ) as unknown as MockCheeseService;
    mockFocusManagerService = TestBed.inject(
      FocusManagerService
    ) as unknown as MockFocusManagerService;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockCheeseService.updateCheese.calls.reset();
    mockCheeseService.getCheeseById.calls.reset();
    mockFocusManagerService.clearFocus.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.ripeningForm.value).toEqual({
      ripeningStartDate: '',
      estimatedDuration: '',
      temperature: '',
      humidity: '',
      turningFlips: '',
      washing: '',
      brushing: '',
    });
  });

  it('should accept initial data via input and patch form values', () => {
    const initialData: CheeseRipening = {
      ripeningStartDate: '2024-01-15',
      estimatedDuration: '3 months',
      temperature: '12-15°C',
      humidity: '85%',
      turningFlips: 'Turn daily for first week',
      washing: 'Weekly with brine solution',
      brushing: 'Brush mold weekly',
    };

    component.initialData = initialData;
    component.ngOnInit();

    expect(component.ripeningForm.value).toEqual(initialData);
  });

  it('should validate hasData correctly', () => {
    // Empty form should have no data
    expect(component.hasData()).toBeFalsy();

    // Form with date data should have data
    component.ripeningForm.patchValue({ ripeningStartDate: '2024-01-15' });
    expect(component.hasData()).toBeTruthy();

    // Reset and test with string data
    component.ripeningForm.reset();
    component.ripeningForm.patchValue({ estimatedDuration: 'Test duration' });
    expect(component.hasData()).toBeTruthy();

    // Test with whitespace only should not have data
    component.ripeningForm.reset();
    component.ripeningForm.patchValue({ temperature: '   ' });
    expect(component.hasData()).toBeFalsy();
  });

  it('should call service to save data when form has valid data', () => {
    component.cheeseId = 'test-cheese-123';

    const testData: CheeseRipening = {
      ripeningStartDate: '2024-01-15',
      estimatedDuration: '3 months',
      temperature: '12-15°C',
      humidity: '85%',
      turningFlips: 'Turn daily',
      washing: 'Weekly washing',
      brushing: 'Brush weekly',
    };

    component.ripeningForm.patchValue(testData);
    component.saveRipening();

    expect(mockCheeseService.updateCheese).toHaveBeenCalledWith(
      'test-cheese-123',
      { ripening: testData }
    );
  });

  it('should call clearFocus after successful save', (done) => {
    component.cheeseId = 'test-cheese-123';

    const testData: CheeseRipening = {
      ripeningStartDate: '2024-01-15',
      estimatedDuration: '3 months',
    };

    component.ripeningForm.patchValue(testData);
    component.saveRipening();

    // Esperem que clearFocus es cridi després del subscribe
    setTimeout(() => {
      expect(mockFocusManagerService.clearFocus).toHaveBeenCalledWith(
        component['elementRef']
      );
      done();
    }, 0);
  });

  it('should not call service when cheeseId is missing', () => {
    const testData: CheeseRipening = {
      ripeningStartDate: '2024-01-15',
      estimatedDuration: '3 months',
    };

    component.ripeningForm.patchValue(testData);
    component.cheeseId = undefined;

    component.saveRipening();
    expect(mockCheeseService.updateCheese).not.toHaveBeenCalled();
  });

  it('should load data from service when cheeseId is provided', () => {
    const testCheeseId = 'test-cheese-123';
    const mockRipeningData: CheeseRipening = {
      ripeningStartDate: '2024-01-15',
      estimatedDuration: '3 months',
      temperature: '12°C',
    };

    mockCheeseService.getCheeseById.and.returnValue(
      of({
        cheese: { ripening: mockRipeningData },
      })
    );

    component.cheeseId = testCheeseId;
    component.ngOnInit();

    expect(mockCheeseService.getCheeseById).toHaveBeenCalledWith(testCheeseId);
    expect(component.ripeningForm.value.ripeningStartDate).toBe('2024-01-15');
    expect(component.ripeningForm.value.estimatedDuration).toBe('3 months');
  });

  it('should handle error when loading data fails', () => {
    const testCheeseId = 'test-cheese-123';
    spyOn(console, 'error');

    mockCheeseService.getCheeseById.and.returnValue(
      throwError(() => new Error('Service error'))
    );

    component.cheeseId = testCheeseId;
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      'Error loading cheese ripening data:',
      jasmine.any(Error)
    );
  });

  it('should handle service update error gracefully', () => {
    const testCheeseId = 'test-cheese-123';
    spyOn(console, 'error');

    mockCheeseService.updateCheese.and.returnValue(
      throwError(() => new Error('Update error'))
    );

    component.cheeseId = testCheeseId;
    component.ripeningForm.patchValue({ ripeningStartDate: '2024-01-15' });
    component.saveRipening();

    expect(console.error).toHaveBeenCalledWith(
      'Error updating ripening data:',
      jasmine.any(Error)
    );
  });

  it('should provide form controls via getter', () => {
    expect(component.f).toBe(component.ripeningForm.controls);
  });

  it('should handle form control value changes', () => {
    component.f['ripeningStartDate'].setValue('2024-01-15');
    component.f['estimatedDuration'].setValue('6 months');

    expect(component.ripeningForm.value.ripeningStartDate).toBe('2024-01-15');
    expect(component.ripeningForm.value.estimatedDuration).toBe('6 months');
  });

  it('should validate individual form controls', () => {
    // All controls should be valid by default (no validators)
    Object.keys(component.f).forEach((controlName) => {
      expect(component.f[controlName].valid).toBeTruthy();
    });
  });

  it('should handle cheeseId input', () => {
    const testCheeseId = 'cheese-123';
    component.cheeseId = testCheeseId;
    spyOn(console, 'log');

    component.ngOnInit();

    expect(console.log).toHaveBeenCalledWith(
      'Loading ripening data for cheese:',
      testCheeseId
    );
    expect(mockCheeseService.getCheeseById).toHaveBeenCalledWith(testCheeseId);
  });

  it('should not load data when cheeseId is not provided', () => {
    component.cheeseId = undefined;
    component.ngOnInit();

    expect(mockCheeseService.getCheeseById).not.toHaveBeenCalled();
  });

  it('should reset form correctly', () => {
    // Fill form with data
    component.ripeningForm.patchValue({
      ripeningStartDate: '2024-01-15',
      estimatedDuration: 'Test duration',
      temperature: '15°C',
    });

    expect(component.hasData()).toBeTruthy();

    // Reset form
    component.ripeningForm.reset();

    expect(component.hasData()).toBeFalsy();
    expect(component.ripeningForm.value.ripeningStartDate).toBeNull();
    expect(component.ripeningForm.value.estimatedDuration).toBeNull();
  });

  describe('onDateChange', () => {
    it('should update ripeningStartDate form control when date changes', () => {
      const testDate = '2024-01-15T00:00:00.000Z';
      const mockEvent = {
        detail: {
          value: testDate,
        },
      };

      component.onDateChange(mockEvent);

      expect(component.ripeningForm.get('ripeningStartDate')?.value).toBe(
        testDate
      );
      expect(mockFocusManagerService.clearFocus).toHaveBeenCalledWith(
        component['elementRef']
      );
    });

    it('should handle undefined date value', () => {
      const mockEvent = {
        detail: {
          value: undefined,
        },
      };

      component.onDateChange(mockEvent);

      expect(
        component.ripeningForm.get('ripeningStartDate')?.value
      ).toBeUndefined();
      expect(mockFocusManagerService.clearFocus).toHaveBeenCalledWith(
        component['elementRef']
      );
    });
  });
});
