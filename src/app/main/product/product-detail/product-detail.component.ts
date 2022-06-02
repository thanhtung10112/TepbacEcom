import { ProductChartComponent } from "./product-chart/product-chart.component";
import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../product.service";
import { AlertService } from "app/services/alert.service";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UpdateProductComponent } from "../update-product/update-product.component";
import { DiscountComponent } from "../discount/discount.component";
import { ConfirmComponent } from "app/_directives/confirm/confirm.component";
import { ImageProductComponent } from "../image-product/image-product.component";
import { fuseAnimations } from "@fuse/animations";
import { ConfirmDeleteComponent } from "app/main/product/confirm-delete/confirm-delete.component";
import { DetailDiscountComponent } from "../detail-discount/detail-discount.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { LoadingFlag } from "app/model/loading.model";
import { load } from "@angular/core/src/render3";
import { UpdateDescriptionComponent } from "./update-description/update-description.component";
import { FormControl, FormGroup } from "@angular/forms";
import { UpdateOptionComponent } from "./update-option/update-option.component";
import { AddOptionComponent } from "./add-option/add-option.component";
import { UpdateDetailComponent } from "./update-detail/update-detail.component";
@Component({
    selector: "app-product-detail",
    templateUrl: "./product-detail.component.html",
    styleUrls: ["./product-detail.component.scss"],
    animations: fuseAnimations,
})
export class ProductDetailComponent implements OnInit {
    @ViewChild("file") myDiv: ElementRef<HTMLElement>;
    item: any = [];
    arrayImage: any = [];
    imageSelected = 0;
    indexUpload: any;
    public myFile: File;
    public myNameFile: any;
    pathImage: any = "";
    countUpload: any;
    myFormDataUpload: FormData;
    listQuery: any = [];
    showDetail: boolean = false;
    showDescription: boolean = false;
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    listTerm: any;
    selectedTerm: FormGroup = new FormGroup({
        usefor: new FormControl([]),
        uses: new FormControl([]),
        material: new FormControl([]),
    });
    loading = new LoadingFlag();
    showUses: boolean = false;
    showUseFor: boolean = false;
    showMaterial: boolean = false;
    constructor(
        private route: ActivatedRoute,
        public productService: ProductService,
        private alertService: AlertService,
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {}

    async ngOnInit() {
        await this.getListTerm();
        this.getProduct();
        // this.getDataChart();
    }

    isJSON(str) {
        if (str == "" || str == "[]" || str == "null") {
            return false;
        }
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    numberWithCommas(x: number) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return "";
    }
    getProduct() {
        this.loading.setPending(true);
        const id = this.route.snapshot.paramMap.get("id");
        this.productService
            .getDetailProduct(id)
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.arrayImage = data.data.image;
                        for (let i = this.arrayImage.length; i < 3; i++) {
                            this.arrayImage.push({
                                meta_key: "null",
                                meta_value:
                                    "assets/images/product/add_image.png",
                                root: 0,
                            });
                        }
                        this.loading.setResult(true);
                        this.item = data.data;

                        this.item.min_price =
                            this.item.label_price.split("~")[0];
                        this.item.max_price =
                            this.item.label_price.split("~")[1];
                        var usefor = [];
                        var uses = [];
                        var material = [];
                        this.item.term["usefor"].forEach((element) => {
                            this.listTerm.usefor.forEach((term) => {
                                if (term.id === element.id) {
                                    element.children = term.children;
                                    term.isCurrent = true;
                                    term.action = "none";
                                    usefor.push(term);
                                }
                            });
                        });
                        this.item.term["uses"].forEach((element) => {
                            this.listTerm.uses.forEach((term) => {
                                if (term.id === element.id) {
                                    element.children = term.children;
                                    term.isCurrent = true;
                                    term.action = "none";
                                    uses.push(term);
                                }
                            });
                        });
                        this.item.term["material"].forEach((element) => {
                            this.listTerm.material.forEach((term) => {
                                if (term.id === element.id) {
                                    element.children = term.children;
                                    term.isCurrent = true;
                                    term.action = "none";
                                    material.push(term);
                                }
                            });
                        });
                        this.selectedTerm.get("usefor").patchValue(usefor);
                        this.selectedTerm.get("uses").patchValue(uses);
                        this.selectedTerm.get("material").patchValue(material);

                        this.item.description_edit = this.item.description;
                        this.item.detail_edit = this.item.detail;
                    } else {
                        this.alertService.error(data.error.message);
                        this.loading.setResult(false);
                        this.router.navigate(["/product/selling"]);
                    }
                },
                (error) => {
                    this.alertService.error("Lỗi kết nối");
                    this.loading.setResult(false);
                    this.router.navigate(["/product/selling"]);
                }
            );
    }
    openDetailDiscount(item) {
        item.price_new = this.item.price_new;
        item.product_id = this.item.id;
        const dialogRef = this.dialog.open(DetailDiscountComponent, {
            width: "500px",
            data: item,
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getProduct();
        });
    }
    openEditProduct() {
        const dialogRef = this.dialog.open(UpdateProductComponent, {
            width: "500px",
            data: this.item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getProduct();
            }
        });
    }

    openBarChart() {
        const dialogRef = this.dialog.open(ProductChartComponent, {
            width: "1500px",
            data: this.item.id,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getProduct();
            }
        });
    }

    openDiscount() {
        const dialogRef = this.dialog.open(DiscountComponent, {
            width: "750px",
            data: this.item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.item.discount_code.push(result);
            }
        });
    }
    openUpdateOption(index) {
        let data = this.item.options[index];
        let optionNames = [];
        this.item.options.forEach((element) => {
            if (element.name != data.name) {
                // remove spaces in name
                optionNames.push(element.name.replace(/\s/g, ""));
            }
        });
        data.optionNames = optionNames;
        const dialogRef = this.dialog.open(UpdateOptionComponent, {
            width: "750px",
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getProduct();
            }
        });
    }
    openAddOption() {
        let data = { product_id: this.item.id, optionNames: null };
        let optionNames = [];
        this.item.options.forEach((element) => {
            // remove spaces in name
            optionNames.push(element.name.replace(/\s/g, ""));
        });
        data.optionNames = optionNames;
        const dialogRef = this.dialog.open(AddOptionComponent, {
            width: "750px",
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getProduct();
            }
        });
    }
    removeOption(index) {
        if (this.item.options.length == 1) {
            this.alertService.warn("Sản phẩm cần có ít nhất 1 lựa chọn");
            return;
        }
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: "500px",
            data: {
                title: "Xóa lựa chọn",
                subTitle:
                    "Bạn có chắc chắn muốn xóa lựa chọn, hành động này sẽ không thể hoàn tác?",
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loading.setPending(true);
                let params = {
                    product_id: this.item.options[index].product_id,
                    option_id: this.item.options[index].id,
                };
                this.productService.removeOption(params).subscribe(
                    (res) => {
                        if (res.status == "success") {
                            this.loading.setResult(true);
                            this.alertService.success(
                                "Đã xóa lựa chọn thành công"
                            );
                            this.item.options.splice(index, 1);
                        } else {
                            this.loading.setResult(false);
                            this.alertService.error(res.error.message);
                        }
                    },
                    () => {
                        this.loading.setResult(false);
                        this.alertService.error("Lỗi kết nối");
                    }
                );
            }
        });
    }

    removeProduct() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: "500px",
            data: {
                title: "Xóa sản phẩm",
                subTitle:
                    "Xóa sản phẩm đồng nghĩa với xóa các thông tin liên quan tới sản phẩm,bạn có muốn xóa sản phẩm?",
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loading.setPending(true);
                this.productService.removeProduct(this.item.id).subscribe(
                    (res) => {
                        if (res.status == "success") {
                            this.loading.setResult(true);
                            this.alertService.success(
                                "Đã xóa sản phẩm thành công"
                            );
                            this.router.navigate(["/product/selling"]);
                        } else {
                            this.loading.setResult(false);
                            this.alertService.error(res.error.message);
                        }
                    },
                    () => {
                        this.loading.setResult(false);
                        this.alertService.error("Lỗi kết nối");
                    }
                );
            }
        });
    }

    showImage(index) {
        if (this.arrayImage[index].meta_key != "null") {
            this.imageSelected = index;
        } else {
            this.indexUpload = index;
            let el: HTMLElement = this.myDiv.nativeElement;
            el.click();
        }
    }
    uploadAvatar(event) {
        let myFileList: FileList = event.target.files;
        if (myFileList.length > 0) {
            this.myFile = myFileList[0];
            this.pathImage = event.target.value;
            this.myNameFile = this.myFile.name;
            var reader = new FileReader();
            this.myFormDataUpload = new FormData();
            this.myFormDataUpload.append("avatarFile", this.myFile);
            this.productService
                .uploadImageShopProduct(
                    this.route.snapshot.paramMap.get("id"),
                    this.myFormDataUpload,
                    this.myNameFile
                )
                .pipe()
                .subscribe(
                    (res) => {
                        if (res.status == "success") {
                            this.alertService.success(
                                "Thêm hình ảnh thành công"
                            );
                            this.arrayImage[this.indexUpload] = res.data;
                            this.arrayImage[this.indexUpload].root = 0;
                        } else {
                            this.alertService.error(res.error.message);
                        }
                    },
                    (error) => {
                        this.alertService.error("Lỗi kết nối");
                    }
                );
        }
    }
    chooseImage() {
        this.productService
            .chooseImage(
                this.arrayImage[this.imageSelected].id,
                this.route.snapshot.paramMap.get("id")
            )
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.alertService.success("Chọn ảnh thành công");
                    } else {
                        this.alertService.error(res.error.message);
                    }
                },
                () => {
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
    removeImage() {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: "750px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.productService
                    .removeImage(this.arrayImage[this.imageSelected].id)
                    .subscribe(
                        (res) => {
                            if (res.status == "success") {
                                this.alertService.success("Xóa ảnh thành công");
                                this.arrayImage.splice(this.imageSelected, 1);
                                if (this.imageSelected > 0) {
                                    this.imageSelected -= 1;
                                }
                                this.arrayImage.push({
                                    meta_key: "null",
                                    meta_value:
                                        "assets/images/product/add_image.png",
                                });
                            } else {
                                this.alertService.error(res.error.message);
                            }
                        },
                        () => {
                            this.alertService.error("Lỗi kết nối");
                        }
                    );
            }
        });
    }

    confirmDelete() {
        const dialogRef = this.dialog.open(DiscountComponent, {
            width: "750px",
            data: { id: this.route.snapshot.paramMap.get("id") },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.getProduct();
        });
    }
    async getListTerm() {
        const data = await this.productService.getListTerm().catch((err) => {
            this.alertService.error("Lỗi kết nối");
        });
        if (data["status"] == "success") {
            this.listTerm = data["data"];
            this.listTerm.usefor = this.productService.getLevel(
                this.listTerm.usefor
            );
            this.listTerm.uses = this.productService.getLevel(
                this.listTerm.uses
            );
            this.listTerm.material = this.productService.getLevel(
                this.listTerm.material
            );
            this.listTerm.usefor.forEach((_element, index) => {
                this.productService.getChildren(this.listTerm.usefor, index);
            });
            this.listTerm.uses.forEach((_element, index) => {
                this.productService.getChildren(this.listTerm.uses, index);
            });
            this.listTerm.material.forEach((_element, index) => {
                this.productService.getChildren(this.listTerm.material, index);
            });
        } else {
            this.alertService.error(data["error"].message);
        }
    }
    showEditTerm(type) {
        this.showUses = false;
        this.showUseFor = false;
        this.showMaterial = false;
        if (type == "uses") {
            this.showUses = true;
        } else if (type == "usefor") {
            this.showUseFor = true;
        } else {
            this.showMaterial = true;
        }
    }
    saveTerm(type) {
        this.productService
            .saveTerm({
                type: type,
                product_id: this.item.id,
                terms: JSON.stringify(this.getListQuery(type)),
            })
            .subscribe(
                async (res) => {
                    if (res.status == "success") {
                        this.alertService.success(
                            "Cập nhật thuộc tính thành công"
                        );
                        this.listTerm[type].forEach((element) => {
                            element.isCurrent = false;
                            element.action = "";
                        });
                        this.selectedTerm.reset();
                        this.getProduct();
                        this.closeEditTerm();
                    } else {
                        this.alertService.error(res.error.message);
                    }
                },
                () => {
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
    closeEditTerm() {
        this.showUses = false;
        this.showUseFor = false;
        this.showMaterial = false;
        this.showDetail = false;
        this.showDescription = false;
    }
    openEditDescription(content) {
        const dialogRef = this.dialog.open(UpdateDescriptionComponent, {
            width: "1000px",
            data: content,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let param = {
                    description: result,
                    shop_id: this.item.shop_id,
                };
                this.item.description = result;
                this.item.description_edit = result;
                this.saveDetail(param);
            }
        });
    }
    openEditDetail(content) {
        const dialogRef = this.dialog.open(UpdateDetailComponent, {
            width: "1000px",
            data: content,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let param = {
                    detail: result,
                    shop_id: this.item.shop_id,
                };
                this.item.detail = result;
                this.item.detail_edit = result;
                this.saveDetail(param);
            }
        });
    }
    saveDetail(param) {
        this.productService.updateProduct(param, this.item.id).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.alertService.success("Cập nhật thành công");
                    this.item.description = this.item.description_edit;
                    this.item.detail = this.item.detail_edit;
                    this.closeEditTerm();
                } else {
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.alertService.error("Lỗi kết nối");
            }
        );
    }
    removeTerm(nodeToRemove, type) {
        var currentSelected = this.selectedTerm.get(type).value;
        var newArray = [];

        currentSelected.forEach((element) => {
            if (
                !nodeToRemove.children.includes(element.id) &&
                element.id != nodeToRemove.id
            ) {
                newArray.push(element);
            }
        });
        this.selectedTerm.get(type).patchValue(newArray);
    }
    selectionChange(type, event) {
        var item = event.source.value;
        if (!event.isUserInput) {
            return;
        }
        var currentSelected = this.selectedTerm.get(type).value;
        if (event.source.selected) {
            currentSelected.push(item);
            //reset if "uses"
            if (type === "uses") {
                currentSelected = [item];
            }
            //if add: add all parent nodes
            var currentNode = item;
            var included = false;
            while (currentNode.parent_id !== "0" && !included) {
                this.listTerm[type].forEach((element) => {
                    if (element.id === currentNode.parent_id) {
                        if (!currentSelected.includes(element)) {
                            currentSelected.push(element);
                            currentNode = element;
                        } else {
                            included = true;
                        }
                    }
                });
            }
            if (type === "uses") {
                currentSelected.sort((a, b) => a.id - b.id);
            }
            this.selectedTerm.get(type).patchValue(currentSelected);
        } else {
            //if remove: remove all children
            this.removeTerm(item, type);
        }
    }
    getListQuery(type: string) {
        var queryArray = [];
        //get all none and add  item
        var selected = this.selectedTerm.get(type).value;
        selected.forEach((element) => {
            if (element.isCurrent) {
                element.action = "none";
            } else {
                element.action = "add";
            }
            queryArray.push(element);
        });
        //get all del item
        this.item.term[type].forEach((element) => {
            var deleted = true;
            selected.forEach((selectedEl) => {
                if (element.id === selectedEl.id) {
                    deleted = false;
                }
            });
            if (deleted) {
                element.action = "del";
                queryArray.push(element);
            }
        });
        return queryArray;
    }
}
