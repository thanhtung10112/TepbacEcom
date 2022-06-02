import {
    Component,
    OnInit,
    ViewEncapsulation
} from "@angular/core";
import {
    FormGroup,
    Validators,
    FormControl,
    FormArray,
    FormBuilder,
    ValidatorFn,
    AbstractControl,
    ValidationErrors,
} from "@angular/forms";
import {
    ProductService
} from "../product.service";
import {
    AlertService
} from "app/services/alert.service";
import {
    Router
} from "@angular/router";
import {
    fuseAnimations
} from "@fuse/animations";
import {
    COMMA,
    ENTER,
    H
} from "@angular/cdk/keycodes";
import {
    LoadingFlag
} from "app/model/loading.model";
import {
    summerNoteConfig
} from "environments/environment";
import {
    Observable,
    of ,
    Subject
} from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    switchMap
} from "rxjs/operators";

@Component({
    selector: "app-insert-product",
    templateUrl: "./insert-product.component.html",
    styleUrls: ["./insert-product.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class InsertProductComponent implements OnInit {
    public indexCount: number = 0;
    public loadingFlag = new LoadingFlag();
    public message: string;
    private searchTerms = new Subject < string > ();
    summerNoteConfig = summerNoteConfig;
    isLinear: boolean = true;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    product_id: number = 0;
    inforProduct: any;
    loading = new LoadingFlag();
    count: number = 0;
    listTerm: any = [];
    hasOption: boolean = false;
    optionStepValidator: ValidatorFn = (
        control: AbstractControl
    ): ValidationErrors | null => {
        let invalid = false;
        if (this.hasOption) {
            const optionList = (control.get("optionList") as FormArray)
                .controls;
            optionList.forEach((option) => {
                let name = option.get("name").value;
                let detail = option.get("detail").value;
                let price_root = option.get("price_root").value;
                let price_new = option.get("price_new").value;
                if (!name || !detail || !price_root || !price_new) {
                    invalid = true;
                } else if (!this.validateOptionName(0)) {
                    invalid = true;
                }
            });
        } else {
            const defaultPriceRoot = control.get("default_price_root").value;
            const defaultPriceNew = control.get("default_price_new").value;
            if (!defaultPriceNew || !defaultPriceRoot) {
                invalid = true;
            }
        }
        return invalid ? {
            invalid: true
        } : null;
    };
    formStep1: FormGroup = new FormGroup({
        shop_id: new FormControl("", Validators.required),
        name: new FormControl({
                value: "",
                disabled: false
            },
            Validators.required
        ),
        alias: new FormControl("", Validators.required),
        product_root_id: new FormControl(0, Validators.required),
        unit: new FormControl("", Validators.required),
        company_id: new FormControl("", Validators.required),
        compSearch: new FormControl(""),
    });
    formStep2: FormGroup = new FormGroup({
        all_detail: new FormControl(""),
        all_price_root: new FormControl(""),
        all_price_new: new FormControl(""),
        all_weight : new FormControl(""),
        all_quantity : new FormControl(""),
        optionList: new FormArray([]),
        default_price_root: new FormControl("", Validators.required),
        default_price_new: new FormControl("", Validators.required),
    }, {
        validators: this.optionStepValidator
    });
    formStep3: FormGroup = new FormGroup({});
    formStep4: FormGroup = new FormGroup({
        usefor: new FormControl([]),
        uses: new FormControl([], Validators.required),
        material: new FormControl([]),
    });
    formStep5: FormGroup = new FormGroup({
        description: new FormControl("", [
            Validators.required,
            Validators.minLength(10),
        ]),
        detail: new FormControl("", Validators.required),
    });

    public myFile: File;
    public myNameFile: any;
    pathImage: any = "";
    arrayImage: any = [];
    countUpload: any;
    myFormDataUpload: FormData;
    public listShop: any = [];
    public inforPr: any = [];
    public listPrRoot: any = [];
    companies$: Observable < any[] > ;
    public productRoot: any = [];


    constructor(
        private productService: ProductService,
        private alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.getListShop();
        this.getListTerm();
        let tem = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            // ignore new term if same as previous term
            distinctUntilChanged(),
            // switch to new search observable each time the term changes
            switchMap((term: string) => this.getSearchCompany(term))
        );
        this.companies$ = tem;

        this.companies$.subscribe((data) => {
            if (data) {
                this.loadingFlag.setResult(true);
                this.message = "";
            } else {
                this.loadingFlag.setResult(false);
                this.message = "Không tìm thấy công ty";
            }
        });
    }

    search(term): void {
        this.searchTerms.next(term.target.value);
    }

    getSearchCompany(val: string): Observable < any[] > {
        this.loadingFlag.setPending(true);
        if (!val.trim()) {
            // if not search term, return empty array.
            this.loadingFlag.setResult(true);
            return of([]);
        }
        return this.productService.searchCompany(val).pipe();
    }

    getProduct(id) {
        this.loading.setPending(true);
        this.productService
            .getDetailProduct(id)
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.loading.setResult(true);
                        this.inforProduct = data.data;
                    } else {
                        this.loading.setResult(false);
                        this.alertService.error(data.error.message);
                    }
                },
                (_error) => {
                    this.loading.setResult(false);
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
    getListShop() {
        this.loading.setPending(true);
        this.productService
            .getListShop()
            .pipe()
            .subscribe(
                (data) => {
                    if (data.status == "success") {
                        this.loading.setResult(true);
                        this.listShop = data.data;
                    } else {
                        this.loading.setResult(false);
                        this.alertService.error(data.error.message);
                    }
                },
                (_error) => {
                    this.loading.setResult(false);
                    this.alertService.error("Lỗi kết nối");
                }
            );
    }
    async getListTerm() {
        this.loading.setPending(true);
        const data = await this.productService.getListTerm().catch((err) => {
            this.alertService.error("Lỗi kết nối");
        });
        if (data["status"] == "success") {
            this.loading.setResult(true);
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
            this.loading.setResult(false);
            this.alertService.error(data["error"].message);
        }
    }
    insertProduct() {
        let optionList = [];
        if (this.hasOption) {
            optionList = this.formStep2.get("optionList").value;
            optionList.forEach((el) => {
                el.price_new = el.price_new.replace(/\,/g, "");
                el.price_root = el.price_root.replace(/\,/g, "");
            });
        } else {
            optionList = [{
                name: "mặc định",
                detail: "mặc định",
                price_root: this.formStep2
                    .get("default_price_root")
                    .value.replace(/\,/g, ""),
                price_new: this.formStep2
                    .get("default_price_new")
                    .value.replace(/\,/g, ""),
                weight:this.formStep2.get("all_weight").value,
                quantity:this.formStep2.get("all_quantity").value
            }, ];
        }
        let param = {
            shop_id: this.formStep1.value.shop_id,
            name: this.formStep1.get("name").value,
            product_root_id: this.formStep1.value.product_root_id,
            unit: this.formStep1.value.unit,
            alias: this.formStep1.value.alias,
            company_id: this.formStep1.value.company_id,
            options: optionList,
            detail: this.formStep5.value.detail,
            description: this.formStep5.value.description,
            list_term: this.prepareTermData(),
        };
        this.loading.setPending(true);
        this.productService.insertProduct(param).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.arrayImage.forEach((element) => {
                        if (element.root == 0) {
                            this.myFormDataUpload = new FormData();
                            this.myFormDataUpload.append(
                                "avatarFile",
                                element.file
                            );
                            this.myNameFile = element.file.name;
                            this.count = 0;
                            this.productService
                                .uploadImageShopProduct(
                                    res.data,
                                    this.myFormDataUpload,
                                    this.myNameFile
                                )
                                .pipe()
                                .subscribe(
                                    (res) => {
                                        if (res.status == "success") {
                                            this.count += 1;
                                            if (
                                                this.count ==
                                                this.arrayImage.filter(e=>{return e.root==0}).length
                                            ) {
                                                this.alertService.success(
                                                    "Tải sản phẩm thành công"
                                                );
                                                this.loading.setResult(true);
                                            }
                                        } else {
                                            this.alertService.error(
                                                res.error.message
                                            );
                                            this.loading.setResult(false);
                                        }
                                    },
                                    (_error) => {
                                        this.alertService.error("Lỗi kết nối");
                                        this.loading.setResult(false);
                                    }
                                );
                        }
                    });
                    this.router.navigate([
                        "/product/selling",
                    ]);

                } else {
                    this.alertService.error(res.error.message);
                    this.loading.setResult(false);
                }
            },
            (_error) => {
                this.alertService.error("Lỗi kết nối");
                this.loading.setResult(false);
            }
        );
    }
    uploadAvatar(event) {
        if (this.arrayImage.length < 3) {
            let myFileList: FileList = event.target.files;
            // console.log(myFileList);
            if (myFileList.length > 0) {
                this.myFile = myFileList[0];
                this.pathImage = event.target.value;
                this.myNameFile = this.myFile.name;
                var reader = new FileReader();
                reader.readAsDataURL(this.myFile);
                reader.onload = (_event) => {
                    this.pathImage = reader.result;
                    this.arrayImage.push({
                        file: this.myFile,
                        fake_path: this.pathImage,
                        root: 0
                    });
                };
                this.myFormDataUpload = new FormData();
                this.myFormDataUpload.append("avatarFile", this.myFile);
            }
        } else {
            this.alertService.warn("Bạn chỉ được chọn tối đa 3 ảnh");
        }
    }
    removeImageProduct(index) {
        this.arrayImage.splice(index, 1);
    }
    public onCompanyChange(event) {
        if (event.value === 0) {
            this.listPrRoot = [];
            this.formStep1.get("alias").reset();
            this.formStep1.get("unit").reset();
            this.formStep1.get("name").reset();
            this.formStep1.get("name").enable();
            return;
        } else {
            this.getListProductRoot(event.value);
        }
    }
    public getProductRoot() {
        this.arrayImage = [];
        if (this.formStep1.value.product_root_id == 0) {
            this.formStep1.get("alias").reset();
            this.formStep1.get("unit").reset();
            this.formStep1.get("name").reset();
            this.formStep1.get("name").enable();
            this.formStep3.reset();
            this.arrayImage = [];
            this.formStep4.reset();
            this.formStep5.reset();
            this.formStep4.enable();
            return;
        }
        this.productService
            .getProductRoot(
                this.formStep1.value.company_id,
                this.formStep1.value.product_root_id
            )
            .pipe()
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.productRoot = res.data;
                        this.formStep1.patchValue({
                            name: res.data.name,
                            alias: res.data.alias,
                            unit: res.data.unit
                        });
                        this.formStep1.get("name").disable();
                        var uses = [];
                        var usefor = [];
                        var material = [];
                        if (res.data.terms != '') {
                            res.data.terms = this.convertTermRoot(res.data.terms)
                        } else {
                            res.data.terms = {
                                material: [],
                                usefor: [],
                                uses: []
                            }
                        }
                        res.data.terms.material.forEach((arr) => {
                            arr.forEach((element) => {
                                this.listTerm.material.forEach((term) => {
                                    if (
                                        term.id == element.id &&
                                        !material.includes(term)
                                    ) {
                                        material.push(term);
                                    }
                                });
                            });
                        });
                        res.data.terms.usefor.forEach((arr) => {
                            arr.forEach((element) => {
                                this.listTerm.usefor.forEach((term) => {
                                    if (
                                        term.id == element.id &&
                                        !usefor.includes(term)
                                    ) {
                                        usefor.push(term);
                                    }
                                });
                            });
                        });
                        res.data.terms.uses.forEach((element) => {
                            this.listTerm.uses.forEach((term) => {
                                if (term.id == element.id) {
                                    uses.push(term);
                                }
                            });
                        });
                        this.formStep4.patchValue({
                            uses: uses,
                            usefor: usefor,
                            material: material,
                        });
                        //this.formStep4.disable();

                        this.formStep5.patchValue({
                            description: res.data.description,
                            detail: res.data.detail
                        });
                        if (res.data.options != '') {
                            res.data.options = this.convertOptionRoot(res.data.options);
                        } else {
                            res.data.options = [];
                        }
                        this.formStep2.reset();
                        console.log(res.data.options);
                        res.data.options.forEach(element => {
                            let option = this.formBuilder.group({
                                name: [element.name],
                                detail: [element.detail],
                                price_root: [res.data.price],
                                weight : ("weight" in element) ? [element.weight] : [0],
                                price_new: [""],
                                quantity : [""]
                            });
                            const control = < FormArray > this.formStep2.get("optionList");
                            control.push(option);
                            this.validateOptionName(
                                (this.formStep2.get("optionList") as FormArray).length - 1
                            );
                        });
                        res.data.images.forEach(image => {
                            this.arrayImage.push({
                                file: null,
                                fake_path: this.productService.getSitePath() + image,
                                root: 1
                            })
                        });
                        this.toggleOption(res.data.options.length > 0);
                        this.loading.setResult(true);
                    } else {
                        this.alertService.error(res.error.message);
                        this.loading.setResult(false);
                    }
                },
                (_error) => {
                    this.alertService.error("Lỗi kết nối");
                    this.loading.setResult(false);
                }
            );
    }
    public getListProductRoot(company_id) {
        this.loading.setPending(true);
        this.productService
            .listPrRoot(company_id)
            .pipe()
            .subscribe(
                (res) => {
                    if (res.status == "success") {
                        this.listPrRoot = res.data;
                        this.loading.setResult(true);
                    } else {
                        this.alertService.error(res.error.message);
                        this.loading.setResult(false);
                    }
                },
                (_error) => {
                    this.alertService.error("Lỗi kết nối");
                    this.loading.setResult(false);
                }
            );
    }
    selectionChange(type, event) {
        var item = event.source.value;
        if (!event.isUserInput) {
            return;
        }
        var currentSelected = this.formStep4.get(type).value;
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
            this.formStep4.get(type).patchValue(currentSelected);
        } else {
            //if remove: remove node and all children
            this.removeTerm(item, type);
        }
    }
    removeTerm(nodeToRemove, type) {
        var currentSelected = this.formStep4.get(type).value;
        var newArray = [];

        currentSelected.forEach((element) => {
            if (
                !nodeToRemove.children.includes(element.id) &&
                element.id != nodeToRemove.id
            ) {
                newArray.push(element);
            }
        });
        this.formStep4.get(type).patchValue(newArray);
    }
    toggleOption(val) {
        if (val) {
            this.formStep2.get("default_price_root").setErrors(null);
            this.formStep2.get("default_price_new").setErrors(null);

            if ((this.formStep2.get("optionList") as FormArray).length == 0) {
                this.addOption();
            }
        } else {
            this.clearErrorOptionList();
        }
        this.hasOption = val;
    }
    addOption() {
        this.indexCount += 1;
        let option = this.formBuilder.group({
            name: ["lựa chọn " + this.indexCount],
            detail: [""],
            price_root: [""],
            price_new: [""],
            weight:[""],
            quantity:[""]
        });
        const control = < FormArray > this.formStep2.get("optionList");
        control.push(option);
        this.validateOptionName(
            (this.formStep2.get("optionList") as FormArray).length - 1
        );
    }
    removeOption(optionIndex) {
        if ((this.formStep2.get("optionList") as FormArray).length == 1) {
            this.alertService.warn("Cần ít nhất 1 lựa chọn");
            return;
        }
        const control = < FormArray > this.formStep2.get("optionList");
        control.removeAt(optionIndex);
        if ((this.formStep2.get("optionList") as FormArray).length == 0) {
            this.indexCount = 0;
        }
        this.validateOptionName(0);
    }
    enterAll(key, event) {
        const controlArray = this.formStep2.get("optionList") as FormArray;
        event.preventDefault();
        if (key == "detail") {
            let currentDetail = this.formStep2.get("all_detail").value;
            for (let control of controlArray.controls) {
                control.get("detail").patchValue(currentDetail);
            }
        }
        if (key == "price_root") {
            let currentPriceRoot = this.formStep2.get("all_price_root").value;
            for (let control of controlArray.controls) {
                control.get("price_root").patchValue(currentPriceRoot);
            }
        }
        if (key == "price_new") {
            let currentPriceNew = this.formStep2.get("all_price_new").value;
            for (let control of controlArray.controls) {
                control.get("price_new").patchValue(currentPriceNew);
            }
        }
        if (key == "all_weight") {
            let currentDetail = this.formStep2.get("all_weight").value;
            for (let control of controlArray.controls) {
                control.get("weight").patchValue(currentDetail);
            }
        }
        if (key == "all_quantity") {
            let currentDetail = this.formStep2.get("all_quantity").value;
            for (let control of controlArray.controls) {
                control.get("quantity").patchValue(currentDetail);
            }
        }
    }
    validateOptionName(index) {
        let controlArray = this.formStep2.get("optionList") as FormArray;
        let nameOnFocus = controlArray.controls[index].get("name").value;
        if (nameOnFocus == "") {
            controlArray.controls[index].get("name").setErrors({
                empty: true
            });
        }
        let duplicateIndexList = [];
        controlArray.controls.forEach((optionControlGroup1, index1) => {
            controlArray.controls.forEach((optionControlGroup2, index2) => {
                let name1 = optionControlGroup1
                    .get("name")
                    .value.replace(/\s/g, "");
                let name2 = optionControlGroup2
                    .get("name")
                    .value.replace(/\s/g, "");
                if (
                    name1 == name2 &&
                    index1 != index2 &&
                    !controlArray.controls[index1]
                    .get("name")
                    .hasError("empty") &&
                    !controlArray.controls[index2].get("name").hasError("empty")
                ) {
                    if (!duplicateIndexList.includes(index1)) {
                        duplicateIndexList.push(index1);
                    }
                    if (!duplicateIndexList.includes(index2)) {
                        duplicateIndexList.push(index2);
                    }
                }
            });
        });
        controlArray.controls.forEach((optionControlGroup, duplicateIndex) => {
            if (duplicateIndexList.includes(duplicateIndex)) {
                optionControlGroup.get("name").setErrors({
                    duplicate: true
                });
            } else if (!optionControlGroup.get("name").hasError("empty")) {
                optionControlGroup.get("name").setErrors(null);
            }
        });
        return duplicateIndexList.length > 0 ? false : true;
    }
    validateOption() {
        // custom validator for step 2
        let hasError = false;
        if (this.hasOption) {
            // validate optionList
            let controlArray = (this.formStep2.get("optionList") as FormArray)
                .controls;
            controlArray.forEach((option, index) => {
                if (!option.get("detail").value) {
                    option.get("detail").setErrors({
                        required: true
                    });
                    hasError = true;
                }
                if (!option.get("price_root").value) {
                    option.get("price_root").setErrors({
                        required: true
                    });
                    hasError = true;
                }
                if (!option.get("price_new").value) {
                    option.get("price_new").setErrors({
                        required: true
                    });
                    hasError = true;
                }
            });
            if (hasError) {
                this.formStep2.setErrors({
                    invalid: true
                });
            }
        } else {
            // validate default option
        }
    }
    clearErrorOptionList() {
        let controlArray = (this.formStep2.get("optionList") as FormArray)
            .controls;
        controlArray.forEach((option, index) => {
            option.get("name").setErrors(null);
            option.get("detail").setErrors(null);
            option.get("price_root").setErrors(null);
            option.get("price_new").setErrors(null);
        });
        this.formStep2.get("optionList").setErrors(null);
    }
    prepareTermData() {
        let usefor = [];
        let uses = [];
        let material = [];
        this.formStep4.value.usefor.forEach((element) => {
            usefor.push(element.id);
        });
        this.formStep4.value.uses.forEach((element) => {
            uses.push(element.id);
        });
        this.formStep4.value.material.forEach((element) => {
            material.push(element.id);
        });
        return {
            uses: uses,
            usefor: usefor,
            material: material
        };
    }
    numberWithCommas(x: number) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return "";
    }
    convertNumber(value, key_ob, index: number = undefined) {
        value = value.replace(/\,/g, "");
        if (index >= 0) {
            // set in options:
            let controlItem = (this.formStep2.get("optionList") as FormArray)
                .controls[index];
            if (key_ob == "price_root") {
                controlItem.patchValue({
                    price_root: this.numberWithCommas(value),
                });
            } else if (key_ob == "price_new") {
                controlItem.patchValue({
                    price_new: this.numberWithCommas(value),
                });
            }
        } else {
            if (key_ob == "default_price_root") {
                this.formStep2.patchValue({
                    default_price_root: this.numberWithCommas(value),
                });
            } else if (key_ob == "default_price_new") {
                this.formStep2.patchValue({
                    default_price_new: this.numberWithCommas(value),
                });
            } else if (key_ob == "all_price_root") {
                this.formStep2.patchValue({
                    all_price_root: this.numberWithCommas(value),
                });
            } else if (key_ob == "all_price_new") {
                this.formStep2.patchValue({
                    all_price_new: this.numberWithCommas(value),
                });
            }
        }
    }
    convertOptionRoot(strOption: string) {
        let option = [];
        try {
            strOption = strOption.replace(/.lhh./g, '"');
            option = JSON.parse(strOption);
            console.log(option);
        } catch (err) {
            console.log(err);
            option = [];
        }
        return option;
    }
    convertTermRoot(strTerms) {
        let terms = {
            material: [],
            uses: [],
            usefor: []
        };
        try {
            strTerms = strTerms.replace(/.lhh./g, '"');
            terms = JSON.parse(strTerms);
            console.log(terms);
        } catch (err) {
            terms = {
                material: [],
                uses: [],
                usefor: []
            }
        }
        return terms;
    }
}