import { Injectable } from '@angular/core';
import { RequestApiService } from 'app/services/request-api.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public url="/shop/order-api";
  public url_shop="/shop/shop-api";
  constructor(private reqAPIService: RequestApiService,) { 
  }
  getFullOrder(){
    return this.reqAPIService.get(this.url+"?action=getListOrder");
  }
  getDetailOrder(id){
    return this.reqAPIService.get(this.url_shop+"?action=getDetailOrder&id="+id);
  }
  list(page,option){
    return this.reqAPIService.get(this.url+"?page="+page+"&option="+option);
  }
  sendReport(data){
    return this.reqAPIService.post(this.url_shop+"?action=report",data);
  }
  actionOrder(order_id,action){
    return this.reqAPIService.get(this.url+"?action=actionOrder&id="+order_id+"&action_order="+action);
  }
  confirmStoking(id){
    return this.reqAPIService.get(this.url+"?action=confirm-stoking&id="+id);
  }
}
