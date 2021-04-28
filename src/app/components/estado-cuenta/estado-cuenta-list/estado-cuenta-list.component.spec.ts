import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaListComponent } from './estado-cuenta-list.component';

describe('EstadoCuentaListComponent', () => {
  let component: EstadoCuentaListComponent;
  let fixture: ComponentFixture<EstadoCuentaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
