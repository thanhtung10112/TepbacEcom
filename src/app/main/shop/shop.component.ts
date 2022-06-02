import { Component, OnInit } from "@angular/core";
import { ProductService } from "app/main/product/product.service";
import { AlertService } from "app/services/alert.service";
import { ShopService } from "./shop.service";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";

@Component({
    selector: "app-shop",
    templateUrl: "./shop.component.html",
    styleUrls: ["./shop.component.scss"],
    animations: fuseAnimations,
})
export class ShopComponent implements OnInit {
    listShop: any = [];
    loading = new LoadingFlag();
    wrong: any = [];

    constructor(
        private productService: ProductService,
        public alertService: AlertService,
        private shopService: ShopService
    ) {}

    ngOnInit() {
        this.getListShop();
    }
    getListShop() {
        this.loading.setPending(true);
        this.productService
            .getListShop()
            .pipe()
            .subscribe(
                (data) => {
                    if ((data.status = "success")) {
                        this.loading.setResult(true);
                        this.listShop = data.data;
                        if (data.wrong) {
                            this.wrong = data.wrong;
                        }
                    } else {
                        this.loading.setResult(false);
                        this.alertService.error(data.error.message);
                    }
                },
                (error) => {
                    this.loading.setResult(false);
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }

    removeShop(id) {
        console.log(id);
    }
}
