import { Injectable } from "@angular/core";
import { RequestApiService } from "app/services/request-api.service";
import { Router } from "@angular/router";
@Injectable({
    providedIn: "root",
})
export class HomeService {
    public url = "/shop/dashboard-api";
    public url_Chart = "/shop/tracking-api";
    public url_Shop = "/shop/tracking-api";

    // shop/tracking-api?action=shop&type=day
    constructor(private reqAPIService: RequestApiService) {}
    loadDashboard() {
        return this.reqAPIService.get(this.url);
    }

    getChart() {
        return this.reqAPIService.get(
            this.url_Chart + "?action=fullproduct&type=day"
        );
    }

    getChartShopId() {
        return this.reqAPIService.get(this.url_Shop + "?action=shop&type=day");
    }
}
