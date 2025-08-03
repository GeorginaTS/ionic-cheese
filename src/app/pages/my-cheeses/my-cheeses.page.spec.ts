import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCheesesPage } from './my-cheeses.page';

describe('MyCheesesPage', () => {
  let component: MyCheesesPage;
  let fixture: ComponentFixture<MyCheesesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCheesesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
