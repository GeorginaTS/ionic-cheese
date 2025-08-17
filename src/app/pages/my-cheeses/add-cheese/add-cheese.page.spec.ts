import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCheesePage } from './add-cheese.page';

describe('AddCheesePage', () => {
  let component: AddCheesePage;
  let fixture: ComponentFixture<AddCheesePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCheesePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
