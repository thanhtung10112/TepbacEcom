import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { ProductService } from "../product.service";
import { AlertService } from "app/services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
@Component({
    selector: "app-update-product",
    templateUrl: "./update-product.component.html",
    styleUrls: ["./update-product.component.scss"],
    animations: fuseAnimations,
})
export class UpdateProductComponent implements OnInit {
    public formUpdate: FormGroup = new FormGroup({
        name: new FormControl(""),
        alias: new FormControl("", Validators.required),
        unit: new FormControl("", Validators.required),
        shop_id: new FormControl("", Validators.required),
    });
    fake_price_root = "";
    fake_price_new = "";
    loading = new LoadingFlag();
    public inforProduct: any = [];
    public listShop: any = [];
    constructor(
        public dialogRef: MatDialogRef<UpdateProductComponent>,
        private productService: ProductService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.getListShop();
        this.buildForm();
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    buildForm() {
        this.formUpdate.setValue({
            name: this.data.name,
            alias: this.data.alias,
            unit: this.data.unit.meta_value,
            shop_id: this.data.shop_id,
        });
        this.fake_price_new = this.numberWithCommas(this.data.price_new);
        this.fake_price_root = this.numberWithCommas(this.data.price_root);
    }
    convertNumber(value, key_ob) {
        value = value.replace(/\,/g, "");
        if (key_ob == "price_root") {
            this.formUpdate.patchValue({
                price_root: this.numberWithCommas(value),
            });
        } else {
            this.formUpdate.patchValue({
                price_new: this.numberWithCommas(value),
            });
        }
    }
    numberWithCommas(x: number) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return "";
    }
    getListShop() {
        this.productService
            .getListShop()
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
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
    save() {
        this.loading.setPending(true);
        let params = this.formUpdate.value;
        console.log(params);
        this.productService
            .updateProduct(params, this.data.id)
            .pipe()
            .subscribe(
                (res) => {
                    if ((res.status = "success")) {
                        this.loading.setResult(true);
                        this.alertService.success(
                            "Cập nhật thông tin sản phẩm thành công"
                        );
                        this.onNoClick();
                    } else {
                        this.loading.setResult(false);
                        this.alertService.error(res.error.message);
                    }
                },
                (error) => {
                    this.loading.setResult(false);
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
    setCatID(id) {
        this.formUpdate.controls["cat_id"].setValue(id);
    }
    setGroupID(id) {
        this.formUpdate.controls["group_id"].setValue(id);
    }
}
