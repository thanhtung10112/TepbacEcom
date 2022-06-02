import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDescriptionComponent } from './update-description.component';

describe('UpdateDescriptionComponent', () => {
  let component: UpdateDescriptionComponent;
  let fixture: ComponentFixture<UpdateDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
