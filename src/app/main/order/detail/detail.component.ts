import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '../order.service';
import { AlertService } from 'app/services/alert.service';
import { ProductService } from 'app/main/product/product.service';
import { fuseAnimations } from '@fuse/animations';
import { ReportComponent } from '../report/report.component';
import { LoadingFlag } from 'app/model/loading.model';
import { load } from '@angular/core/src/render3';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations : fuseAnimations
})
export class DetailComponent implements OnInit {
  public detailOrder:any=[];
  loading = new LoadingFlag();
  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    public dialog:MatDialog,
    private orderService : OrderService,
    private alertService : AlertService,
    private productService : ProductService,
    public router : Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getDetailOrder(this.data.id);
  }
  numberWithCommas(x:number) {
    if(x){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return "0";
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  isJSON(str) {
    if(str=="" || str =="[]" || str=="null"){
      return false;
    }
    try { 
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  getDetailOrder(id){
    this.loading.setPending(true);
    this.orderService.getDetailOrder(id).subscribe(
      data=>{
        if(data.status=="success"){
          this.loading.setResult(true);
          this.detailOrder=data.data;
          this.detailOrder.pay=parseInt(this.detailOrder.order.total)+parseInt(this.detailOrder.order.shipping_fee)
          this.detailOrder.order.address_user=this.detailOrder.order.address_user.substring(this.detailOrder.order.address_user.indexOf(',')).replace(",",""); 
          // console.log(this.detailOrder);
        }else{
          this.loading.setResult(false);
          this.alertService.error(data.error.message);
        }
      },error=>{
        this.loading.setResult(false);
        this.alertService.error("Lỗi kết nối");
      }
      
    )
  }
  openReport(){
    const dialogRef = this.dialog.open(ReportComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loading.setPending(true);
        this.orderService.sendReport({
          "order_id":this.data.id,
          "content":result.content
        }).subscribe(res=>{
          if(res.status=="success"){
            this.loading.setResult(true);
            this.alertService.success("Đã thêm một báo cáo");
          }else{
            this.loading.setResult(false);
            this.alertService.error(res.error.message);
          }
        },()=>{
          this.loading.setResult(false);
          this.alertService.error("Lỗi kết nối");
        })
      }
    });
  }
  actionOrder(action){
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '250px',
      data: {confirmMessage: "Thay đổi trạng thái đơn hàng"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loading.setPending(true);
        this.orderService.actionOrder(this.detailOrder.order.id,action).subscribe(res=>{
          if(res.status=="success"){
            this.loading.setResult(true);
            this.alertService.success("Đã cập nhật đơn hàng");
          }else{
            this.loading.setResult(false);
            this.alertService.error(res.error.message);
          }
        },()=>{
          this.loading.setResult(false);
          this.alertService.error("Lỗi kết nối");
        })
      }
    });
  }
  openNewTabLink(){
    window.open(this.detailOrder.order.shipping_link, '_blank');
  }
  confirmStoking(){

    this.orderService.confirmStoking(this.detailOrder.order.id).subscribe(
      data=>{
        if(data.status=="success"){
          this.detailOrder.order.stoking_confirm=1; 
          this.alertService.success("Đã xác nhận còn hàng");
        }else{

          this.alertService.error(data.error.message);
        }
      },error=>{
        this.loading.setResult(false);
        this.alertService.error("Lỗi kết nối");
      }
      
    )
  }
}
