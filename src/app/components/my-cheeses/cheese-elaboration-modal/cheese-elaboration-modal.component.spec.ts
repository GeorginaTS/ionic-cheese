import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheeseElaborationModalComponent } from './cheese-elaboration-modal.component';

describe('CheeseElaborationModalComponent', () => {
  let component: CheeseElaborationModalComponent;
  let fixture: ComponentFixture<CheeseElaborationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheeseElaborationModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheeseElaborationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
