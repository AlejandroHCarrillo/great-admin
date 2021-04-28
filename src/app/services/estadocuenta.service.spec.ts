import { TestBed } from '@angular/core/testing';

import { EstadocuentaService } from './estadocuenta.service';

describe('EstadocuentaService', () => {
  let service: EstadocuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadocuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
