import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiclosEscolaresComponent } from './ciclos-escolares.component';

describe('CiclosEscolaresComponent', () => {
  let component: CiclosEscolaresComponent;
  let fixture: ComponentFixture<CiclosEscolaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiclosEscolaresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiclosEscolaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
