import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ProductService } from '../product.service';
import { AlertService } from 'app/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  animations : fuseAnimations
})
export class DiscountComponent implements OnInit {
  formCtrl : FormGroup=new FormGroup({
    code : new FormControl('',Validators.required),
    limit_code : new FormControl('',Validators.required),
    sale : new FormControl(''),
    all : new FormControl('',Validators.required),
    type : new FormControl('',Validators.required),
    from : new FormControl(''),
    max : new FormControl('')
  });
  price_current:number;
  loading=new LoadingFlag();
  listType : any = [];
  constructor(
    public dialogRef: MatDialogRef<DiscountComponent>,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getTypeDiscount();
    this.price_current=this.data.price_new;
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  
  saveDiscount(){
    let params={
      id:this.data.id,
      code:this.formCtrl.value.code,
      limit:this.formCtrl.value.limit_code,
      sale:this.formCtrl.value.sale,
      all:this.formCtrl.value.all,
      type : this.formCtrl.value.type,
      from:this.formCtrl.value.from,
      max:this.formCtrl.value.max
    };
    this.loading.setPending(true);
    this.productService.createDiscount(params).subscribe(res=>{
      if(res.status=="success"){
        this.loading.setResult(true);
        this.alertService.success("Cập nhật giảm giá thành công.");
        this.dialogRef.close(res.data);
        }else{
          this.loading.setResult(false);
          this.alertService.error(res.error.message);
        }
      },error=>{
        this.loading.setResult(true);
        this.alertService.error("Lỗi kết nối");
      });
  }
 
  eventHandler(sale){
    if(parseFloat(sale)>=0 && parseFloat(sale)<=100){
      this.price_current=this.data.price_new-parseFloat(sale)*this.data.price_new/100
    }
  }
  getTypeDiscount(){
    this.productService.getTypeDiscount().subscribe(res=>{
      if(res.status=="success"){
          this.listType = res.data;
        }else{
          this.alertService.error(res.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      });
  }
}
