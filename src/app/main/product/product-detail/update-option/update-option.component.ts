import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { LoadingFlag } from "app/model/loading.model";
import { AlertService } from "app/services/alert.service";
import { ProductService } from "../../product.service";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-update-option",
    templateUrl: "./update-option.component.html",
    styleUrls: ["./update-option.component.scss"],
    animations: fuseAnimations,
})
export class UpdateOptionComponent implements OnInit {
    public formUpdate: FormGroup = new FormGroup({
        name: new FormControl("", Validators.required),
        detail: new FormControl("", Validators.required),
        weight : new FormControl(0,Validators.required),
        price_root: new FormControl("", Validators.required),
        price_new: new FormControl("", Validators.required),
        option_id: new FormControl("", Validators.required),
        product_id: new FormControl("", Validators.required),
        quantity : new FormControl("",Validators.required)
    });
    fake_price_root = "";
    fake_price_new = "";
    loading = new LoadingFlag();

    constructor(
        public dialogRef: MatDialogRef<UpdateOptionComponent>,
        private productService: ProductService,
        private alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.buildForm();
    }
    onNoClick(value: any = false): void {
        this.dialogRef.close(value);
    }
    buildForm() {
        this.formUpdate.setValue({
            name: this.data.name,
            detail: this.data.detail,
            price_root: this.numberWithCommas(this.data.price_root),
            price_new: this.numberWithCommas(this.data.price_new),
            weight : ("weight" in this.data) ? this.data.weight : '',
            option_id: this.data.id,
            product_id: this.data.product_id,
            quantity : this.data.quantity
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
    save() {
        this.loading.setPending(true);
        this.formUpdate.patchValue({
            price_root: this.formUpdate.value.price_root.replace(/\,/g, ""),
        });
        this.formUpdate.patchValue({
            price_new: this.formUpdate.value.price_new.replace(/\,/g, ""),
        });
        let params = this.formUpdate.value;

        this.productService
            .updateOption(params)
            .pipe()
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.loading.setResult(true);
                        this.alertService.success(
                            "Cập nhật thông tin lựa chọn thành công"
                        );
                        this.onNoClick(true);
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
    validateName() {
        let currentName = this.formUpdate.get("name").value.replace(/\s/g, "");
        if (this.data.optionNames.includes(currentName)) {
            this.formUpdate.get("name").setErrors({ duplicate: true });
        } else if (!this.formUpdate.get("name").hasError("required")) {
            this.formUpdate.get("name").setErrors(null);
        }
    }
}
