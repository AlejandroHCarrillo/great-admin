import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaMailComponent } from './estado-cuenta-mail.component';

describe('EstadoCuentaMailComponent', () => {
  let component: EstadoCuentaMailComponent;
  let fixture: ComponentFixture<EstadoCuentaMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
