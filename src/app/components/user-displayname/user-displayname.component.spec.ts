import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDisplaynameComponent } from './user-displayname.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('UserDisplaynameComponent', () => {
  let component: UserDisplaynameComponent;
  let fixture: ComponentFixture<UserDisplaynameComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUserById']);

    await TestBed.configureTestingModule({
      imports: [UserDisplaynameComponent],
      providers: [{ provide: UserService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDisplaynameComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name when loaded', () => {
    const mockUser = {
      uid: 'test-id',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUserService.getUserById.and.returnValue(of(mockUser));
    component.userId = 'test-id';

    component.ngOnInit();

    expect(component.displayName).toBe('Test User');
    expect(component.isLoading).toBeFalse();
  });

  it('should show Anonymous User for user without displayName', () => {
    const mockUser = {
      uid: 'test-id',
      email: 'test@example.com',
    };

    mockUserService.getUserById.and.returnValue(of(mockUser));
    component.userId = 'test-id';

    component.ngOnInit();

    expect(component.displayName).toBe('Anonymous User');
  });
});
