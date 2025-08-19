import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IcoCheeseStatusComponent } from './ico-cheese-status.component';

describe('IcoCheeseStatusComponent', () => {
  let component: IcoCheeseStatusComponent;
  let fixture: ComponentFixture<IcoCheeseStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoCheeseStatusComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IcoCheeseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
