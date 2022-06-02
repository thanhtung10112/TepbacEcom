import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
import { AlertService } from "app/services/alert.service";
import { AuthService } from "app/services/auth.service";
import { ConfirmComponent } from "app/_directives/confirm/confirm.component";
import { ProductService } from "../product/product.service";
import { AddProductComponent } from "./add-product/add-product.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { EventService } from "./event.service";

@Component({
    selector: "app-event",
    templateUrl: "./event.component.html",
    styleUrls: ["./event.component.scss"],
    animations: fuseAnimations,
})
export class EventComponent implements OnInit {
    data: any;
    loading = new LoadingFlag();
    id: string;
    constructor(
        public route: ActivatedRoute,
        public eventService: EventService,
        public alertSerive: AlertService,
        public productService: ProductService,
        public dialog: MatDialog,
        public dataAuthService: AuthService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get("id");
        this.loadEvent();
    }

    loadEvent() {
        this.loading.setPending(true);
        this.eventService.loadEvent(this.id).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.loading.setResult(true);
                    this.data = res.data;
                } else {
                    this.loading.setResult(false);
                    this.alertSerive.error(res.error);
                }
            },
            () => {
                this.loading.setResult(false);
                this.alertSerive.error("Lỗi kết nối");
            }
        );
    }

    dataHotlineEmail = this.dataAuthService.dataHotline;

    addProduct() {
        const dialogRef = this.dialog.open(AddProductComponent, {
            data: { event: this.data.infor },
            width: "800px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadEvent();
            }
        });
    }
    editProduct(item) {
        const dialogRef = this.dialog.open(EditProductComponent, {
            data: {
                event: this.data.infor,
                product_event_id: item.product_event_id,
                product_name: item.name,
            },
            width: "800px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadEvent();
            }
        });
    }
    removeProduct(item, index) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: "500px",
            data: {
                title: "Xóa sản phẩm",
                subTitle:
                    "Xóa sản phẩm đồng nghĩa sản phẩm sẽ không xuất hiện trong chương trình của eShop .Bạn có muốn xóa?",
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loading.setPending(true);
                this.eventService
                    .removeProduct(item.product_event_id)
                    .subscribe(
                        (res) => {
                            if (res.status == "success") {
                                this.loading.setResult(true);
                                this.alertSerive.success(
                                    "Đã xóa sản phẩm thành công"
                                );
                                this.data.list.splice(index, 1);
                            } else {
                                this.loading.setResult(false);
                                this.alertSerive.error(res.error.message);
                            }
                        },
                        () => {
                            this.loading.setResult(false);
                            this.alertSerive.error("Lỗi kết nối");
                        }
                    );
            }
        });
    }
}
