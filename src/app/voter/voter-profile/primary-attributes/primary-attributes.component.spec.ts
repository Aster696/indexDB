import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryAttributesComponent } from './primary-attributes.component';

describe('PrimaryAttributesComponent', () => {
  let component: PrimaryAttributesComponent;
  let fixture: ComponentFixture<PrimaryAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
