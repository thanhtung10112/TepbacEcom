import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { ShopService } from "../shop.service";
import { AlertService } from "app/services/alert.service";
import { ConfirmComponent } from "app/_directives/confirm/confirm.component";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";

@Component({
    selector: "app-create-shop",
    templateUrl: "./create-shop.component.html",
    styleUrls: ["./create-shop.component.scss"],
    animations: fuseAnimations,
})
export class CreateShopComponent implements OnInit {
    public shopId: any;
    //image fake shop
    public myFile: File;
    public myNameFile: any;
    pathImage: any = "";
    //logo fake shop
    public myLogo: File;
    public myNameLogo: any;
    pathLogo: any = "";
    isUploadFile: boolean = false;
    myFormData: FormData;
    myFormDataLogo: FormData;
    formCrt: FormGroup;
    loading = new LoadingFlag();
    listProvince: any = [];
    listDistrict: any = [];
    listWards: any = [];
    constructor(
        private formBuilder: FormBuilder,
        private shopService: ShopService,
        private alertService: AlertService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.initForm();
        this.getListProvince();
    }
    initForm() {
        this.formCrt = this.formBuilder.group({
            name: ["", Validators.required],
            description: ["", [Validators.required, Validators.minLength(10)]],
            email: ["", Validators.required],
            phone: ["", Validators.required],
            address: ["", Validators.required],
            tax_code: ["", Validators.required],
            province_id: ["", Validators.required],
            district_id: ["", Validators.required],
            wards_id: ["", Validators.required],
            ship: [2, Validators.required],
        });
    }
    uploadAvatar(event) {
        let myFileList: FileList = event.target.files;
        if (myFileList.length > 0) {
            this.myFile = myFileList[0];
            this.pathImage = event.target.value;
            this.myNameFile = this.myFile.name;
            var reader = new FileReader();
            reader.readAsDataURL(this.myFile);
            reader.onload = (_event) => {
                this.pathImage = reader.result;
            };
            this.isUploadFile = true;
            this.myFormData = new FormData();
            this.myFormData.append("avatarFile", this.myFile);
        }
    }
    uploadLogo(event) {
        let myFileList: FileList = event.target.files;
        if (myFileList.length > 0) {
            this.myLogo = myFileList[0];
            this.pathLogo = event.target.value;
            this.myNameLogo = this.myLogo.name;
            var reader = new FileReader();
            reader.readAsDataURL(this.myLogo);
            reader.onload = (_event) => {
                this.pathLogo = reader.result;
            };
            this.isUploadFile = true;
            this.myFormDataLogo = new FormData();
            this.myFormDataLogo.append("avatarFile", this.myLogo);
        }
    }
    saveAvatar() {
        this.loading.setPending(true);
        this.shopService
            .uploadImageShop(this.myFormData, this.myNameFile, this.shopId, 1)
            .pipe()
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.loading.setResult(true);
                        this.alertService.success("Đã upload 1 ảnh");
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
    saveLogo() {
        this.loading.setPending(true);
        this.shopService
            .uploadLogoShop(
                this.myFormDataLogo,
                this.myNameLogo,
                this.shopId,
                1
            )
            .pipe()
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.loading.setResult(true);
                        this.alertService.success("Đã upload 1 ảnh");
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
    saveShop() {
        let params = {
            name: this.formCrt.value.name,
            phone: this.formCrt.value.phone,
            tax_code: this.formCrt.value.tax_code,
            address: this.formCrt.value.address,
            description: this.formCrt.value.description,
            email: this.formCrt.value.email,
            province_id: this.formCrt.value.province_id,
            district_id: this.formCrt.value.district_id,
            wards_id: this.formCrt.value.wards_id,
            ship: this.formCrt.value.ship,
        };
        this.shopService
            .createShop(params)
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.alertService.success("Tạo cửa hàng thành công!");
                        this.alertService.success(
                            "Cửa hàng của bạn sẽ được hoạt động khi admin phê duyệt!"
                        );
                        console.log(data.data);
                        this.shopId = data.data.id;
                        this.saveAvatar();
                        this.saveLogo();
                        this.router.navigate(["/shop"]);
                    } else {
                        this.alertService.error(data.error.message);
                    }
                },
                (error) => {
                    this.alertService.error("Lỗi kết nối");
                }
            );
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
                console.log("🚀🚀🎉🎉 >>>>> getListWards", res);
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
    changeProvince(event) {
        console.log("🚀🚀🎉🎉 >>>>> event", event);
        this.getListDistrict(event.value);
    }
    changeDistrict(event) {
        this.getListWards(event.value);
    }
    confirmRegister() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: "500px",
            data: {
                title: "Tạo mới cửa hàng",
                subTitle:
                    "Sau khi tạo mới, cửa hàng của bạn cần chờ xác nhận trong 24 giờ. Bạn có chắc muốn tạo cửa hàng?",
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.saveShop();
            }
        });
    }
}
