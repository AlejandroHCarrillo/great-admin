import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosReportComponent } from './cargos-report.component';

describe('CargosReportComponent', () => {
  let component: CargosReportComponent;
  let fixture: ComponentFixture<CargosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargosReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
