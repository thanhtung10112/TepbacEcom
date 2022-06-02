import { Component, OnDestroy, OnInit } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { AlertService } from "app/services/alert.service";
import { AuthService } from "app/services/auth.service";
import { ProductService } from "./product.service";
@Component({
    selector: "app-product",
    templateUrl: "./product.component.html",
    styleUrls: ["./product.component.scss"],
    animations: fuseAnimations,
})
export class ProductComponent implements OnInit, OnDestroy {
    navLinks = [
        { path: "./selling", label: "Đang bán" },
        { path: "./handling", label: "Đang chờ duyệt" },
        { path: "./blocking", label: "Đang bị khóa" },
        { path: "./deleted", label: "Đã xóa" },
    ];

    public listShop: any[];

    constructor(
        private productService: ProductService,
        public alertService: AlertService,
        public dataAuthService: AuthService
    ) {}

    dataHotlineEmail = this.dataAuthService.dataHotline;

    ngOnInit() {
        //console.log(this.navLinks);
        this.getListShop();
    }

    ngOnDestroy() {
        //this.productService.shopChange$.unsubscribe();
    }

    getListShop() {
        this.productService
            .getListShop()
            .pipe()
            .subscribe(
                (data) => {
                    if ((data.status = "success")) {
                        this.listShop = data.data;
                    } else {
                        this.alertService.error(data.error.message);
                    }
                },
                (error) => {
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }

    getListProductByShop(id) {
        this.productService.shopChange$.next(id);
    }
}
