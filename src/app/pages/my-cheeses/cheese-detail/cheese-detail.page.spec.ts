import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheeseDetailPage } from './cheese-detail.page';

describe('CheeseDetailPage', () => {
  let component: CheeseDetailPage;
  let fixture: ComponentFixture<CheeseDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheeseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
