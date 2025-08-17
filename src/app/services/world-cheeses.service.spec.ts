import { TestBed } from '@angular/core/testing';

import { WorldCheesesService } from './world-cheeses.service';

describe('WorldCheesesService', () => {
  let service: WorldCheesesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldCheesesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
