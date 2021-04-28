import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosReportComponent } from './pagos-report.component';

describe('PagosReportComponent', () => {
  let component: PagosReportComponent;
  let fixture: ComponentFixture<PagosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
