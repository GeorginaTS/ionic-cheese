import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CheeseElaborationMakingComponent } from './cheese-elaboration-making.component';
import { CheeseService } from '../../../services/cheese.service';
import { CheeseMaking } from '../../../interfaces/cheese';

// Mock del CheeseService
class MockCheeseService {
  updateCheese = jasmine
    .createSpy('updateCheese')
    .and.returnValue(of({ success: true }));
  getCheeseById = jasmine
    .createSpy('getCheeseById')
    .and.returnValue(of({ cheese: { making: null } }));
}

describe('CheeseElaborationMakingComponent', () => {
  let component: CheeseElaborationMakingComponent;
  let fixture: ComponentFixture<CheeseElaborationMakingComponent>;
  let mockCheeseService: MockCheeseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheeseElaborationMakingComponent, ReactiveFormsModule],
      providers: [{ provide: CheeseService, useClass: MockCheeseService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseElaborationMakingComponent);
    component = fixture.componentInstance;
    mockCheeseService = TestBed.inject(
      CheeseService
    ) as unknown as MockCheeseService;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockCheeseService.updateCheese.calls.reset();
    mockCheeseService.getCheeseById.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.makingForm.value).toEqual({
      milkTemperature: '',
      starterCultures: '',
      milkPH: '',
      coagulant: '',
      coagulationTime: '',
      curdCutting: '',
      molding: '',
      appliedPressure: '',
      salting: '',
    });
  });

  it('should not save data when form is invalid', () => {
    component.makingForm.markAllAsTouched();
    component.saveMaking();
    expect(mockCheeseService.updateCheese).not.toHaveBeenCalled();
  });

  it('should validate hasData correctly', () => {
    // Empty form should have no data
    expect(component.hasData()).toBeFalsy();

    // Form with temperature data should have data
    component.makingForm.patchValue({ milkTemperature: '32' });
    expect(component.hasData()).toBeTruthy();

    // Reset and test with string data
    component.makingForm.reset();
    component.makingForm.patchValue({ starterCultures: 'Test cultures' });
    expect(component.hasData()).toBeTruthy();

    // Test with whitespace only should not have data
    component.makingForm.reset();
    component.makingForm.patchValue({ starterCultures: '   ' });
    expect(component.hasData()).toBeFalsy();
  });

  it('should call service to save data when form has valid data', () => {
    component.cheeseId = 'test-cheese-123';

    const testData: CheeseMaking = {
      milkTemperature: '32',
      starterCultures: 'Test cultures',
      milkPH: '6.5',
      coagulant: 'Rennet',
      coagulationTime: '45',
      curdCutting: 'Small cubes',
      molding: 'Round mold',
      appliedPressure: '5',
      salting: 'Dry salt',
    };

    component.makingForm.patchValue(testData);
    component.saveMaking();

    expect(mockCheeseService.updateCheese).toHaveBeenCalledWith(
      'test-cheese-123',
      { making: testData }
    );
  });

  it('should not call service when form has no data', () => {
    component.cheeseId = 'test-cheese-123';

    // Keep form empty
    component.saveMaking();

    expect(mockCheeseService.updateCheese).not.toHaveBeenCalled();
  });

  it('should not call service when cheeseId is missing', () => {
    const testData: CheeseMaking = {
      milkTemperature: '32',
      starterCultures: 'Test cultures',
    };

    component.makingForm.patchValue(testData);
    component.cheeseId = undefined;

    component.saveMaking();
    expect(mockCheeseService.updateCheese).not.toHaveBeenCalled();
  });

  it('should load data from service when cheeseId is provided', () => {
    const testCheeseId = 'test-cheese-123';
    const mockMakingData: CheeseMaking = {
      milkTemperature: '35',
      starterCultures: 'Test cultures',
      milkPH: '6.2',
    };

    mockCheeseService.getCheeseById.and.returnValue(
      of({
        cheese: { making: mockMakingData },
      })
    );

    component.cheeseId = testCheeseId;
    component.ngOnInit();

    expect(mockCheeseService.getCheeseById).toHaveBeenCalledWith(testCheeseId);
    expect(component.makingForm.value.milkTemperature).toBe('35');
    expect(component.makingForm.value.starterCultures).toBe('Test cultures');
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
      'Error loading cheese making data:',
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
    component.makingForm.patchValue({ milkTemperature: '32' });
    component.saveMaking();

    expect(console.error).toHaveBeenCalledWith(
      'Error actualitzant la descripció:',
      jasmine.any(Error)
    );
  });

  it('should provide form controls via getter', () => {
    expect(component.f).toBe(component.makingForm.controls);
  });

  it('should handle form control value changes', () => {
    component.f['milkTemperature'].setValue('35');
    component.f['starterCultures'].setValue('Mesophilic');

    expect(component.makingForm.value.milkTemperature).toBe('35');
    expect(component.makingForm.value.starterCultures).toBe('Mesophilic');
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
      'Loading making data for cheese:',
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
    component.makingForm.patchValue({
      milkTemperature: '32',
      starterCultures: 'Test',
      coagulant: 'Rennet',
    });

    expect(component.hasData()).toBeTruthy();

    // Reset form
    component.makingForm.reset();

    expect(component.hasData()).toBeFalsy();
    expect(component.makingForm.value.milkTemperature).toBeNull();
    expect(component.makingForm.value.starterCultures).toBeNull();
  });
});
