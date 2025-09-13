import { TestBed } from '@angular/core/testing';
import { CheeseService } from './cheese.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { Cheese } from '../interfaces/cheese';

// Mocks
const mockHttp = {
  get: jasmine.createSpy('get'),
  post: jasmine.createSpy('post'),
  put: jasmine.createSpy('put'),
  delete: jasmine.createSpy('delete'),
};
const mockAuthService = {
  getIdToken$: jasmine
    .createSpy('getIdToken$')
    .and.returnValue(of('mock-token')),
};

describe('CheeseService', () => {
  let service: CheeseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheeseService,
        { provide: HttpClient, useValue: mockHttp },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(CheeseService);
    // Reset spies before each test
    Object.values(mockHttp).forEach((spy) => spy.calls.reset());
    mockAuthService.getIdToken$.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with token for getAllCheeses', () => {
    mockHttp.get.and.returnValue(of([]));
    service.getAllCheeses().subscribe();
    expect(mockAuthService.getIdToken$).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalled();
    const args = mockHttp.get.calls.mostRecent().args;
    expect(args[1].headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('should call http.get with token for getCheeseById', () => {
    mockHttp.get.and.returnValue(of({ msg: 'ok', cheese: {} as Cheese }));
    service.getCheeseById('id1').subscribe();
    expect(mockAuthService.getIdToken$).toHaveBeenCalled();
    expect(mockHttp.get).toHaveBeenCalledWith(
      jasmine.stringMatching(/id1/),
      jasmine.any(Object)
    );
  });

  it('should call http.post with token for createCheese', () => {
    mockHttp.post.and.returnValue(of({} as Cheese));
    const cheese = { name: 'Brie' } as Cheese;
    service.createCheese(cheese).subscribe();
    expect(mockAuthService.getIdToken$).toHaveBeenCalled();
    expect(mockHttp.post).toHaveBeenCalledWith(
      jasmine.any(String),
      cheese,
      jasmine.any(Object)
    );
  });

  it('should call http.put with token for updateCheese', () => {
    mockHttp.put.and.returnValue(of({} as Cheese));
    service.updateCheese('id2', { name: 'Manchego' }).subscribe();
    expect(mockAuthService.getIdToken$).toHaveBeenCalled();
    expect(mockHttp.put).toHaveBeenCalledWith(
      jasmine.stringMatching(/id2/),
      { name: 'Manchego' },
      jasmine.any(Object)
    );
  });

  it('should call http.delete with token for deleteCheese', () => {
    mockHttp.delete.and.returnValue(of(undefined));
    service.deleteCheese('id3').subscribe();
    expect(mockAuthService.getIdToken$).toHaveBeenCalled();
    expect(mockHttp.delete).toHaveBeenCalledWith(
      jasmine.stringMatching(/id3/),
      jasmine.any(Object)
    );
  });
});
