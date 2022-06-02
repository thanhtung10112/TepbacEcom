import { Injectable } from "@angular/core";
import { RequestApiService } from "app/services/request-api.service";
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpXhrBackend,
    HttpRequest,
} from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
@Injectable({
    providedIn: "root",
})
export class ProductService {
    public createdShop: boolean;
    public url = "/shop/shop-api";
    public url_product = "/shop/product-api";
    public url_discount = "/shop/discount-api";
    public url_upload = "/shop/upload-image-product-api";
    public pathUrlProductRoot: string = "";

    public shopChange$ = new BehaviorSubject(0);

    constructor(
        private reqAPIService: RequestApiService,
        private myHTTPClient: HttpClient
    ) {
        this.pathUrlProductRoot = reqAPIService.SITE_PATH;
    }
    getListTerm() {
        return this.reqAPIService
            .get(this.url_product + "?action=listTerm")
            .toPromise();
    }
    getListProduct(option) {
        return this.reqAPIService.get(
            this.url_product + "?action=list" + option
        );
    }
    getDetailProduct(id) {
        return this.reqAPIService.get(
            this.url_product + "?action=get&id=" + id
        );
    }
    getListShop() {
        return this.reqAPIService.get(this.url + "?action=getListShop");
    }
    getInforProduct() {
        return this.reqAPIService.get(this.url + "?action=getInforProduct");
    }
    insertProduct(params: any) {
        return this.reqAPIService
            .post(this.url_product + "?action=insert", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    createDiscount(params: any) {
        return this.reqAPIService
            .post(this.url_discount + "?action=createDiscount", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    updateDiscount(params: any) {
        return this.reqAPIService
            .post(this.url_discount + "?action=updateDiscount", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    removeDiscount(id) {
        return this.reqAPIService.get(
            this.url_discount + "?action=removeDiscount&id=" + id
        );
    }
    getSitePath() {
        return this.reqAPIService.SITE_PATH;
    }
    uploadImageShopProduct(id, myFile: any, myFileName: any): Observable<any> {
        let requestOptions = {
            headers: new HttpHeaders(),
            params: new HttpParams(),
        };
        requestOptions.headers = this.reqAPIService.getHeaderToken();
        requestOptions.headers = requestOptions.headers.delete("Content-Type");
        requestOptions.params = requestOptions.params.append(
            "fileName",
            myFileName
        );
        const req = new HttpRequest(
            "POST",
            encodeURI(this.getSitePath() + "/shop/shop-api"),
            myFile,
            requestOptions
        );
        return this.myHTTPClient.post(
            encodeURI(
                this.getSitePath() +
                    this.url_upload +
                    "?action=uploadImageProduct&id=" +
                    id
            ),
            myFile,
            requestOptions
        );
    }
    removeImageProduct(link) {
        return this.reqAPIService.get(
            this.url + "?action=removeImageProduct&link=" + link
        );
    }
    updateProduct(params: any, id) {
        return this.reqAPIService
            .post(this.url_product + "?action=update-infor&id=" + id, params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    saveImageProduct(params: any) {
        return this.reqAPIService
            .post(this.url + "?action=saveImageProduct", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    removeImage(id) {
        return this.reqAPIService.get(
            this.url_product + "?action=remove-image&id=" + id
        );
    }
    chooseImage(meta_id, id) {
        return this.reqAPIService.get(
            this.url_product +
                "?action=chooseDefaultImg&id=" +
                id +
                "&meta_id=" +
                meta_id
        );
    }
    saveTerm(params) {
        return this.reqAPIService
            .post(this.url_product + "?action=updateTerm", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    removeProduct(id) {
        return this.reqAPIService.get(
            this.url_product + "?action=removeProduct&id=" + id
        );
    }
    restoreProduct(id) {
        return this.reqAPIService.get(
            this.url_product + "?action=restoreProduct&id=" + id
        );
    }
    listFeedBack() {
        return this.reqAPIService.get(this.url + "?action=getListReport");
    }
    seenReport(id) {
        return this.reqAPIService.get(this.url + "?action=seenReport&id=" + id);
    }
    listPrRoot(co_id) {
        return this.reqAPIService.get(
            this.url_product + "?action=listProductRoot&co_id=" + co_id
        );
    }
    listCompany() {
        return this.reqAPIService.get(this.url_product + "?action=listCompany");
    }
    getProductRoot(co_id, id) {
        return this.reqAPIService.get(
            this.url_product +
                "?action=getProductRoot&id=" +
                id +
                "&co_id=" +
                co_id
        );
    }
    searchCompany(keyword) {
        return this.reqAPIService
            .get(
                this.url_product + "?action=listSeachCompany&keyword=" + keyword
            )
            .pipe(
                map((data) => {
                    return data.data;
                })
            );
    }
    updateOption(params: any) {
        return this.reqAPIService
            .post(this.url_product + "?action=update-option", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    addOption(params: any) {
        return this.reqAPIService
            .post(this.url_product + "?action=insertOption", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    removeOption(params: any) {
        return this.reqAPIService
            .post(this.url_product + "?action=removeOption", params)
            .pipe(
                map((data) => {
                    return data;
                })
            );
    }
    getLevel(arr: any[]) {
        arr.forEach((e: any) => {
            if (e.parent_id == "0") {
                e.level = 0;
            }
        });

        arr.forEach((e: any) => {
            var parent: any;
            if (e.parent_id !== "0") {
                parent = arr.find(({ id }) => id == e.parent_id);
                e.level = parent.level + 1;
            }
        });
        return arr;
    }
    getChildren(arr: any[], elementIndex: any) {
        //traverse until found node where node.parent_id = rootElement.parent_id
        arr[elementIndex].children = [];
        var nextIndex = elementIndex + 1;
        while (
            arr[nextIndex] &&
            arr[nextIndex].level > arr[elementIndex].level
        ) {
            arr[elementIndex].children.push(arr[nextIndex].id);
            nextIndex++;
        }
    }
    getTypeDiscount() {
        return this.reqAPIService.get(this.url_discount + "?action=getType");
    }

    getChartTracking(id) {
        return this.reqAPIService.get(
            this.url_product + "?action=tracking-order&product_id=" + id
        );
    }
}
