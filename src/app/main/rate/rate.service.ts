import { Injectable } from '@angular/core';
import { RequestApiService } from 'app/services/request-api.service';

@Injectable({
  providedIn: 'root'
})
export class RateService {
  public url="/eproduct/comment-api";
  public url_shop="/shop/shop-api";
  constructor(
    private reqApiService : RequestApiService
  ) { }
  getList(page){
    return this.reqApiService.get(this.url_shop+"?action=listComment&page="+page);
  }
  add(param){
    return this.reqApiService.post(this.url+"?action=add",param);
  }
  getListShop(id){
    return this.reqApiService.get(this.url+"?action=get&id="+id);
  }
}
