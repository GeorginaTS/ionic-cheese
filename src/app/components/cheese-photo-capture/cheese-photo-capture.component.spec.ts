import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheesePhotoCaptureComponent } from './cheese-photo-capture.component';

describe('CheesePhotoCaptureComponent', () => {
  let component: CheesePhotoCaptureComponent;
  let fixture: ComponentFixture<CheesePhotoCaptureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheesePhotoCaptureComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheesePhotoCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
