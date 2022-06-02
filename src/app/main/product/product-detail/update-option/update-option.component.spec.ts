import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOptionComponent } from './update-option.component';

describe('UpdateOptionComponent', () => {
  let component: UpdateOptionComponent;
  let fixture: ComponentFixture<UpdateOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
