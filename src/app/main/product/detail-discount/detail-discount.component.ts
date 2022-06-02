import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ProductService } from '../product.service';
import { AlertService } from 'app/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { LoadingFlag } from 'app/model/loading.model';
import { load } from '@angular/core/src/render3';
@Component({
  selector: 'app-detail-discount',
  templateUrl: './detail-discount.component.html',
  styleUrls: ['./detail-discount.component.scss'],
  animations : fuseAnimations
})
export class DetailDiscountComponent implements OnInit {

  formCtrl:FormGroup=new FormGroup({
    code:new FormControl('',Validators.required),
    limit_code:new FormControl('',Validators.required),
    sale:new FormControl('',[Validators.required]),
    all:new FormControl('',Validators.required),
    from:new FormControl('',Validators.required),
    max:new FormControl('',Validators.required),
    type : new FormControl('',Validators.required)
  });
  price_current:number;
  loading = new LoadingFlag();
  listType : any = [];
  constructor(
    public dialogRef: MatDialogRef<DetailDiscountComponent>,
    private productService: ProductService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getTypeDiscount();
    this.price_current=this.data.price_new;
    this.buildForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  buildForm(){
    this.formCtrl.setValue({
      code:this.data.code,
      limit_code:this.data.limit,
      sale:this.data.detail_sale,
      all:this.data.all,
      from:this.data.from,
      max:this.data.max,
      type:this.data.type
    })
  }
  saveDiscount(){
    let params={
      id:this.data.product_id,
      discount_id:this.data.id,
      code:this.formCtrl.value.code,
      limit:this.formCtrl.value.limit_code,
      sale:this.formCtrl.value.sale,
      all:this.formCtrl.value.all,
      from:this.formCtrl.value.from,
      max:this.formCtrl.value.max,
      type:this.formCtrl.value.type 
    };
    this.loading.setPending(true);
    this.productService.updateDiscount(params).subscribe(res=>{
      if(res.status=="success"){
          this.loading.setResult(true);
          this.alertService.success("Cập nhật mã giảm giá thành công.");
          this.dialogRef.close();
        }else{
          this.loading.setResult(false);
          this.alertService.error(res.error.message);
        }
      },error=>{
        this.loading.setResult(false);
        this.alertService.error("Lỗi kết nối");
      });
  }
 
  eventHandler(sale){
    if(parseFloat(sale)>=0 && parseFloat(sale)<=100){
      this.price_current=this.data.price_new-parseFloat(sale)*this.data.price_new/100
    }else{
      this.price_current=this.data.price_new;
    }
  }
  removeDiscount(){
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      this.productService.removeDiscount(this.data.id).subscribe(res=>{
        if(res.status=="success"){
          this.alertService.success("Xóa giảm giá thành công.");
          this.dialogRef.close();
          }else{
            this.alertService.error(res.error.message);
          }
        },error=>{
          this.alertService.error("Lỗi kết nối");
        });
      }
    });
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
