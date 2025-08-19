import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldCheesesPage } from './world-cheeses.page';

describe('WorldCheesesPage', () => {
  let component: WorldCheesesPage;
  let fixture: ComponentFixture<WorldCheesesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldCheesesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
