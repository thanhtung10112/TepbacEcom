import { Injectable } from '@angular/core';
import { RequestApiService } from 'app/services/request-api.service';
import {HttpClient, HttpHeaders, HttpParams, HttpXhrBackend, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  public url="/shop/statistic-api";
  constructor(
    private reqAPIService: RequestApiService,
    ) {
  }
  getData(shop_id){
    return this.reqAPIService.get(this.url+"?shop_id="+shop_id);
  }

}
