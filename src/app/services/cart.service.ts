import { Injectable } from '@angular/core';
import { RequestApiService } from './request-api.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  url="/shop/shop-api"
  constructor(
    private router: Router,
    private reqAPIService: RequestApiService,
  ) { }
  getCart(){
    return this.reqAPIService.get(this.url+"?action=getCart");
  }
}
