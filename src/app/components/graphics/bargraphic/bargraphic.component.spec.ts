import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BargraphicComponent } from './bargraphic.component';

describe('BargraphicComponent', () => {
  let component: BargraphicComponent;
  let fixture: ComponentFixture<BargraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BargraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BargraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
