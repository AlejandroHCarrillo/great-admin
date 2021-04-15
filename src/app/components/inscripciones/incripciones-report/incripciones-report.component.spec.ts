import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncripcionesReportComponent } from './incripciones-report.component';

describe('IncripcionesReportComponent', () => {
  let component: IncripcionesReportComponent;
  let fixture: ComponentFixture<IncripcionesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncripcionesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncripcionesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
