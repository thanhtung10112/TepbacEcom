import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShopComponent } from './update-shop.component';

describe('UpdateShopComponent', () => {
  let component: UpdateShopComponent;
  let fixture: ComponentFixture<UpdateShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
