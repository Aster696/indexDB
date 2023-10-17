import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipMappingComponent } from './relationship-mapping.component';

describe('RelationshipMappingComponent', () => {
  let component: RelationshipMappingComponent;
  let fixture: ComponentFixture<RelationshipMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationshipMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
