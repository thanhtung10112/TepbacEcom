import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { AlertService } from "app/services/alert.service";
import { ShopService } from "app/main/shop/shop.service";
import { from } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
@Component({
    selector: "app-selling",
    templateUrl: "./selling.component.html",
    styleUrls: ["./selling.component.scss"],
    animations: fuseAnimations,
})
export class SellingComponent implements OnInit {
    public listProduct: any = [];

    public shopEnable: String[] = [];
    public action = "active";
    loading = new LoadingFlag();
    constructor(
        private productService: ProductService,
        public alertService: AlertService
    ) {}

    ngOnInit() {
        this.getListProduct("");

        this.productService.shopChange$.subscribe((v) => {
            if (v !== 0) {
                this.getListProductByShop(v);
            }
        });
    }

    getListProductByShop(id) {
        if (id != "") {
            let option = "&status=" + this.action + "&shop_id=" + id;
            this.getListProduct(option);
        } else {
            let option = "&status=" + this.action;
            this.getListProduct(option);
        }
    }
    getListProduct(option) {
        option += "&status=" + this.action;
        this.loading.setPending(true);
        this.productService
            .getListProduct(option)
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.listProduct = data.data;
                        this.loading.setResult(true);
                    } else {
                        this.alertService.error(data.error.message);
                        this.loading.setResult(false);
                    }
                },
                (error) => {
                    this.loading.setResult(false);
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
}
