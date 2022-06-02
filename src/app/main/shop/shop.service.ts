import { Injectable } from '@angular/core';
import { RequestApiService } from 'app/services/request-api.service';
import {HttpClient, HttpHeaders, HttpParams, HttpXhrBackend, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  public url="/shop/shop-api";
  public url_address="/eproduct/address-api";
  constructor(
    private reqAPIService: RequestApiService,
    private myHTTPClient: HttpClient,
    ) {
  }
  getDetailShop(id){
    return this.reqAPIService.get(this.url+"?action=detail&id="+id);
  }
  getSitePath(){
    return this.reqAPIService.SITE_PATH;
  }
  uploadImageShop(myFile: any,myFileName:any,shop_id: any,avatar_uploads:any):Observable<any>{
    let requestOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams()
    };
    requestOptions.headers = this.reqAPIService.getHeaderToken();
    //console.log('aaaaaaaaaaaaa',this.reqAPIService.getHeaderToken());
    requestOptions.headers = requestOptions.headers.delete('Content-Type');
    requestOptions.params = requestOptions.params.append('fileName',myFileName);
    requestOptions.params = requestOptions.params.append('avatar_uploads', avatar_uploads);
    requestOptions.params = requestOptions.params.append('id',shop_id);
    console.log(requestOptions.headers);
    const req = new HttpRequest('POST',encodeURI(this.getSitePath() + "/shop/upload-image-shop-api"),myFile,requestOptions);
    return this.myHTTPClient.post(encodeURI(this.getSitePath() + "/shop/upload-image-shop-api"), myFile, requestOptions);
  }
  uploadLogoShop(myFile: any,myFileName:any,shop_id: any,avatar_uploads:any):Observable<any>{
    let requestOptions = {
      headers: new HttpHeaders(),
      params: new HttpParams()
    };
    requestOptions.headers = this.reqAPIService.getHeaderToken();
    //console.log('aaaaaaaaaaaaa',this.reqAPIService.getHeaderToken());
    requestOptions.headers = requestOptions.headers.delete('Content-Type');
    requestOptions.params = requestOptions.params.append('fileName',myFileName);
    requestOptions.params = requestOptions.params.append('avatar_uploads', avatar_uploads);
    requestOptions.params = requestOptions.params.append('id',shop_id);
    const req = new HttpRequest('POST',encodeURI(this.getSitePath() + "/shop/upload-logo-shop-api"),myFile,requestOptions);
    return this.myHTTPClient.post(encodeURI(this.getSitePath() + "/shop/upload-logo-shop-api"), myFile, requestOptions);
  }
  createShop(params: any){
    return this.reqAPIService.post(this.url+'?action=register', params)
            .pipe(map(data => {
                  return data;
                })
            );
  }
  updateShop(params: any,id:any){
    return this.reqAPIService.post(this.url+'?action=updateShop&id='+id, params)
            .pipe(map(data => {
                  return data;
                })
            );
  }
  listUnit(parent_id){
    return this.reqAPIService.get(this.url_address+"?action=listUnit&id="+parent_id);
  }
  updateEvent(data,shop_id){
    return this.reqAPIService.post(this.url+"?action=updateEvent&id="+shop_id,data);
  }
}
