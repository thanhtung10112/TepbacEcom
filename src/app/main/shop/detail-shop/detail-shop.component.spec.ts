import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShopComponent } from './detail-shop.component';

describe('DetailShopComponent', () => {
  let component: DetailShopComponent;
  let fixture: ComponentFixture<DetailShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
