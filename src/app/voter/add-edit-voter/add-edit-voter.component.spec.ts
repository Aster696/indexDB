import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVoterComponent } from './add-edit-voter.component';

describe('AddEditVoterComponent', () => {
  let component: AddEditVoterComponent;
  let fixture: ComponentFixture<AddEditVoterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVoterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
