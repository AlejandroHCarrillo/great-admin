import { TestBed } from '@angular/core/testing';

import { CiclosescolaresService } from './ciclosescolares.service';

describe('CiclosescolaresService', () => {
  let service: CiclosescolaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiclosescolaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
