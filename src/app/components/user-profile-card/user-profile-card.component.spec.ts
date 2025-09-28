import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileCardComponent } from './user-profile-card.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('UserProfileCardComponent', () => {
  let component: UserProfileCardComponent;
  let fixture: ComponentFixture<UserProfileCardComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUserById']);

    await TestBed.configureTestingModule({
      imports: [UserProfileCardComponent],
      providers: [{ provide: UserService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileCardComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user when userId is provided', () => {
    const mockUser = {
      uid: 'test-id',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    mockUserService.getUserById.and.returnValue(of(mockUser));
    component.userId = 'test-id';

    component.ngOnInit();

    expect(mockUserService.getUserById).toHaveBeenCalledWith('test-id');
    expect(component.user).toEqual(mockUser);
  });

  it('should handle error when loading user fails', () => {
    mockUserService.getUserById.and.returnValue(of(null));
    component.userId = 'invalid-id';

    component.ngOnInit();

    expect(component.hasError).toBeFalsy();
    expect(component.user).toBeNull();
  });
});
