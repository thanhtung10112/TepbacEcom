import { Injectable } from '@angular/core';
import { RequestApiService } from 'app/services/request-api.service';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  public url="/shop/shop-api";
  public countCart:any;
  constructor(private reqAPIService: RequestApiService,) { 
  }
  setCountCart(count){
    this.countCart=count;
  }
  getCart(){
    return this.reqAPIService.get(this.url+"?action=getListProductInCart");
  }
  saveOrder(post){
    return this.reqAPIService.post(this.url+"?action=order",post) .pipe(map(data => {
          return data;
        })
    );
  }
  removeProduct(id){
    return this.reqAPIService.get(this.url+"?action=removeProductInCart&id="+id);
  }
  getDetailDiscount(code){
    return this.reqAPIService.get(this.url+"?action=getDiscountCode&code="+code);
  }
  getInforCustomer(){
    return this.reqAPIService.get(this.url+"?action=getListInforCustomer");
  }
}
