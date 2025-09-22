import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CheeseElaborationTasteComponent } from './cheese-elaboration-taste.component';
import { CheeseService } from '../../../services/cheese.service';
import { CheeseTaste } from '../../../interfaces/cheese';
import { FocusManagerService } from '../../../services/focus-manager.service';

// Mock del CheeseService
class MockCheeseService {
  updateCheese = jasmine
    .createSpy('updateCheese')
    .and.returnValue(of({ success: true }));
  getCheeseById = jasmine
    .createSpy('getCheeseById')
    .and.returnValue(of({ cheese: { taste: null } }));
}

// Mock del FocusManagerService
class MockFocusManagerService {
  clearFocus = jasmine.createSpy('clearFocus');
}

describe('CheeseElaborationTasteComponent', () => {
  let component: CheeseElaborationTasteComponent;
  let fixture: ComponentFixture<CheeseElaborationTasteComponent>;
  let mockCheeseService: MockCheeseService;
  let mockFocusManagerService: MockFocusManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheeseElaborationTasteComponent, ReactiveFormsModule],
      providers: [
        { provide: CheeseService, useClass: MockCheeseService },
        { provide: FocusManagerService, useClass: MockFocusManagerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseElaborationTasteComponent);
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
    expect(component.tasteForm.value).toEqual({
      visual: { rate: 0, text: '' },
      aroma: { rate: 0, text: '' },
      texture: { rate: 0, text: '' },
      flavor: { rate: 0, text: '' },
      taste: { rate: 0, text: '' },
    });
  });

  it('should patch form with initial data', () => {
    const initialData: CheeseTaste = {
      visual: { rate: 4, text: 'Beautiful color' },
      aroma: { rate: 3, text: 'Pleasant aroma' },
    };

    component.initialData = initialData;
    component.ngOnInit();

    expect(component.tasteForm.get('visual.rate')?.value).toBe(4);
    expect(component.tasteForm.get('visual.text')?.value).toBe(
      'Beautiful color'
    );
    expect(component.tasteForm.get('aroma.rate')?.value).toBe(3);
    expect(component.tasteForm.get('aroma.text')?.value).toBe('Pleasant aroma');
  });

  describe('hasData', () => {
    it('should return false for empty form', () => {
      expect(component.hasData()).toBeFalsy();
    });

    it('should return true when form has rating data', () => {
      component.tasteForm.get('visual.rate')?.setValue(3);
      expect(component.hasData()).toBeTruthy();
    });

    it('should return true when form has text data', () => {
      component.tasteForm.get('aroma.text')?.setValue('Great smell');
      expect(component.hasData()).toBeTruthy();
    });

    it('should return false for whitespace only text', () => {
      component.tasteForm.get('texture.text')?.setValue('   ');
      expect(component.hasData()).toBeFalsy();
    });
  });

  describe('getRatingText', () => {
    it('should return correct rating text', () => {
      expect(component.getRatingText(0)).toBe('');
      expect(component.getRatingText(1)).toBe('Poor');
      expect(component.getRatingText(2)).toBe('Fair');
      expect(component.getRatingText(3)).toBe('Good');
      expect(component.getRatingText(4)).toBe('Very Good');
      expect(component.getRatingText(5)).toBe('Excellent');
    });

    it('should return empty string for invalid ratings', () => {
      expect(component.getRatingText(-1)).toBe('');
      expect(component.getRatingText(6)).toBe('');
    });
  });

  describe('saveTaste', () => {
    it('should call service to save data when cheeseId is valid', () => {
      component.cheeseId = 'test-cheese-123';

      const testData = {
        visual: { rate: 4, text: 'Nice appearance' },
        flavor: { rate: 5, text: 'Excellent taste' },
      };

      component.tasteForm.patchValue(testData);
      component.saveTaste();

      expect(mockCheeseService.updateCheese).toHaveBeenCalledWith(
        'test-cheese-123',
        { taste: component.tasteForm.value }
      );
    });

    it('should not call service when cheeseId is undefined', () => {
      component.cheeseId = undefined;
      component.saveTaste();

      expect(mockCheeseService.updateCheese).not.toHaveBeenCalled();
    });

    it('should call clearFocus after successful save', (done) => {
      component.cheeseId = 'test-cheese-123';

      const testData = {
        visual: { rate: 3, text: 'Good look' },
      };

      component.tasteForm.patchValue(testData);
      component.saveTaste();

      // Esperem que clearFocus es cridi després del subscribe
      setTimeout(() => {
        expect(mockFocusManagerService.clearFocus).toHaveBeenCalledWith(
          component['elementRef']
        );
        done();
      }, 0);
    });
  });

  describe('loadData', () => {
    it('should load taste data from service when cheeseId exists', () => {
      const mockTasteData: CheeseTaste = {
        visual: { rate: 4, text: 'Beautiful' },
        aroma: { rate: 3, text: 'Pleasant' },
      };

      mockCheeseService.getCheeseById.and.returnValue(
        of({ cheese: { taste: mockTasteData } })
      );

      component.cheeseId = 'test-cheese-123';
      component.ngOnInit();

      expect(mockCheeseService.getCheeseById).toHaveBeenCalledWith(
        'test-cheese-123'
      );
      expect(component.tasteForm.get('visual.rate')?.value).toBe(4);
      expect(component.tasteForm.get('visual.text')?.value).toBe('Beautiful');
    });

    it('should handle error when loading data fails', () => {
      mockCheeseService.getCheeseById.and.returnValue(
        throwError(() => new Error('Service error'))
      );

      spyOn(console, 'error');
      component.cheeseId = 'test-cheese-123';
      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith(
        'Error loading cheese taste data:',
        jasmine.any(Error)
      );
    });

    it('should not call service when cheeseId is undefined', () => {
      component.cheeseId = undefined;
      component.ngOnInit();

      expect(mockCheeseService.getCheeseById).not.toHaveBeenCalled();
    });
  });

  describe('tasteAspects', () => {
    it('should have correct taste aspects defined', () => {
      expect(component.tasteAspects).toEqual([
        {
          key: 'visual',
          label: 'Visual',
          icon: 'eye-outline',
          description: 'Appearance, color, texture',
        },
        {
          key: 'aroma',
          label: 'Aroma',
          icon: 'leaf-outline',
          description: 'Smell and fragrance',
        },
        {
          key: 'texture',
          label: 'Texture',
          icon: 'hand-left-outline',
          description: 'Feel and consistency',
        },
        {
          key: 'flavor',
          label: 'Flavor',
          icon: 'restaurant-outline',
          description: 'Taste and intensity',
        },
        {
          key: 'taste',
          label: 'Overall Taste',
          icon: 'ribbon-outline',
          description: 'General impression',
        },
      ]);
    });
  });
});
