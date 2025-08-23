import { TestBed } from '@angular/core/testing';

import { AuthAlternativeService } from './auth-alternative.service';

describe('AuthAlternativeService', () => {
  let service: AuthAlternativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAlternativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
