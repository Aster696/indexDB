import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterProfileComponent } from './voter-profile.component';

describe('VoterProfileComponent', () => {
  let component: VoterProfileComponent;
  let fixture: ComponentFixture<VoterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoterProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
