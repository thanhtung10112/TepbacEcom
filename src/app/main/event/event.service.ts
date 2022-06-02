import { Injectable } from "@angular/core";
import { RequestApiService } from "app/services/request-api.service";
import { map } from "rxjs/operators";
@Injectable({
    providedIn: "root",
})
export class EventService {
    public url = "/shop/event-api";
    constructor(private reqAPIService: RequestApiService) {}
    loadEvent(id) {
        return this.reqAPIService.get(this.url + "?action=get&id=" + id);
    }
    searchProduct(kw) {
        return this.reqAPIService
            .get(this.url + "?action=searchProduct&kw=" + kw)
            .pipe(
                map((data) => {
                    return data.data;
                })
            );
    }
    listTypeEvent(event_id) {
        return this.reqAPIService.get(
            this.url + "?action=listType&id=" + event_id
        );
    }
    listTermEvent(event_id) {
        return this.reqAPIService.get(
            this.url + "?action=listTerm&id=" + event_id
        );
    }
    addProduct(param) {
        return this.reqAPIService.post(this.url + "?action=add-product", param);
    }
    editProduct(id, param) {
        return this.reqAPIService.post(
            this.url + "?action=edit-product&id=" + id,
            param
        );
    }
    removeProduct(id) {
        return this.reqAPIService.get(
            this.url + "?action=remove-product&id=" + id
        );
    }
    getProduct(product_event_id) {
        return this.reqAPIService.get(
            this.url +
                "?action=getEventProduct&product_event_id=" +
                product_event_id
        );
    }
}
