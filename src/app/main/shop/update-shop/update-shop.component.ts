import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ShopService } from "../shop.service";
import { AlertService } from "app/services/alert.service";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { LoadingFlag } from "app/model/loading.model";
@Component({
    selector: "app-update-shop",
    templateUrl: "./update-shop.component.html",
    styleUrls: ["./update-shop.component.scss"],
})
export class UpdateShopComponent implements OnInit {
    public inforShop: any = [];
    formCtrl: FormGroup = new FormGroup({
        name: new FormControl("", Validators.required),
        email: new FormControl("", Validators.required),
        phone: new FormControl("", Validators.required),
        description: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
        ]),
        address: new FormControl("", Validators.required),
        province_id: new FormControl("", Validators.required),
        district_id: new FormControl("", Validators.required),
        wards_id: new FormControl("", Validators.required),
        ship: new FormControl("", Validators.required),
    });
    listProvince: any = [];
    listDistrict: any = [];
    listWards: any = [];
    loading = new LoadingFlag();
    constructor(
        public dialogRef: MatDialogRef<UpdateShopComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shopService: ShopService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        //console.log(this.data);
        this.buildForm();
        this.getListProvince();
        this.getListDistrict(this.formCtrl.value.province_id);
        this.getListWards(this.formCtrl.value.district_id);
    }
    getDetailShop(id) {
        this.loading.setPending(true);
        this.shopService
            .getDetailShop(id)
            .pipe()
            .subscribe(
                (data) => {
                    if ((data.status = "success")) {
                        this.loading.setResult(true);
                        this.inforShop = data.data;
                        //console.log(data.data);
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
    buildForm() {
        console.log(this.data);
        this.formCtrl.setValue({
            name: this.data.name,
            email: this.data.email,
            phone: this.data.phone,
            address: this.data.address,
            description: this.data.description,
            province_id: this.data.units[2].id,
            district_id: this.data.units[1].id,
            wards_id: this.data.units[0].id,
            ship: this.data.ship,
        });
    }
    getListProvince() {
        this.shopService.listUnit(0).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.listProvince = res.data;
                } else {
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.alertService.error("Lỗi kết nối");
            }
        );
    }
    changeProvince(event) {
        this.getListDistrict(event.value);
    }
    changeDistrict(event) {
        this.getListWards(event.value);
    }
    getListDistrict(id) {
        this.shopService.listUnit(id).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.listDistrict = res.data;
                } else {
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.alertService.error("Lỗi kết nối");
            }
        );
    }
    getListWards(id) {
        this.shopService.listUnit(id).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.listWards = res.data;
                } else {
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.alertService.error("Lỗi kết nối");
            }
        );
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    updateShop() {
        let params = {
            name: this.formCtrl.value.name,
            email: this.formCtrl.value.email,
            phone: this.formCtrl.value.phone,
            description: this.formCtrl.value.description,
            address: this.formCtrl.value.address,
            province_id: this.formCtrl.value.province_id,
            district_id: this.formCtrl.value.district_id,
            wards_id: this.formCtrl.value.wards_id,
            ship: this.formCtrl.value.ship,
        };

        this.loading.setPending(true);
        this.shopService
            .updateShop(params, this.data.id)
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.loading.setResult(true);
                        this.alertService.success(
                            "Cập nhật cửa hàng thành công!"
                        );
                        this.dialogRef.close(true);
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
}
