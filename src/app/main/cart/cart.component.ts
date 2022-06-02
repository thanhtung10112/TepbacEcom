import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { CartService } from './cart.service';
import { ProductService } from 'app/main/product/product.service';
import { MatDialog } from '@angular/material';
import { OrderComponent } from './order/order.component';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations : fuseAnimations
})
export class CartComponent implements OnInit {
  listProduct: any = [];
  total:any=0;
  isNull=false;
  formDiscount : FormGroup;
  listCodeDiscount:Object={};
  constructor(
    public alertService:AlertService,
    public cartService: CartService,
    private dialog: MatDialog,
    public formBuilder:FormBuilder,
    public productService:ProductService,
  ) { }

  ngOnInit() {
    this.getCart();
    this.updateTotal();
    this.buildFormDiscount();
  }
  decreaseValue(index) {
    if (this.listProduct[index].quantity > 1) {
      this.listProduct[index].quantity--;
      //console.log(this.listProduct);
      this.updateTotal();
    }
  }
  increaseValue(index) {
    this.listProduct[index].quantity++;
    //console.log(this.listProduct);
    this.updateTotal();
  }
  getCart(){
    this.cartService.getCart().pipe().subscribe(
      data=>{
        if(data.status=="success"){
          this.listProduct=data.data;
          if(this.listProduct==null){
            this.isNull=true;
          }else{
            this.isNull=false;
            this.listProduct.forEach(element => {
              element.image = this.isJSON(element.image)==false ? "" : JSON.parse(element.image)[0];
            });
            this.updateTotal();
          }
          this.cartService.countCart=this.listProduct!=null ? this.listProduct.length : "";
        }else{
          this.alertService.error(data.error.message);
        }
      },error=>
      {
          this.alertService.error("Lỗi kết nối");
      }
    )
  }
  updateTotal(){
    this.total=0;
    this.listProduct.forEach(element => {
      this.total+=(element.price-element.price*element.sale/100)*element.quantity;
    });
    for(let key in this.listCodeDiscount){
      this.total-=this.listCodeDiscount[key].price_sale;
    }
  }
  checkProductSaled(id){
    for(let key in this.listCodeDiscount){
      if(this.listCodeDiscount[key].product_id==id){
        return 0;
      }
    }
    return 1;
  }
  openOrder(){
    const dialogRef = this.dialog.open(OrderComponent, {
      width: '600px',
      data: {codeDiscount: this.listCodeDiscount}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("close");
      this.getCart();
      this.updateTotal();
    });
  }
  removeProduct(index){
    this.cartService.removeProduct(this.listProduct[index].product_id).pipe().subscribe(
      data=>{
        if(data.status=="success"){
          this.listProduct.splice(index,1);
          this.getCart();
          this.alertService.success("Đã xóa sản phẩm khỏi giỏ hàng.");
        }else{
          this.alertService.error(data.error.message);
        }
      },error=>
      {
          this.alertService.error("Lỗi kết nối");
      }
    )
  }
  buildFormDiscount(){
    this.formDiscount=this.formBuilder.group({
      code:['',Validators.required]
    })
  }
  checkCode(){
    //console.log(this.formDiscount.value);
    this.cartService.getDetailDiscount(this.formDiscount.value.code).pipe().subscribe(
      data=>{
        if(data.status=="success"){
          if(!(data.data.code in this.listCodeDiscount)){
            if(this.checkProductSaled(data.data.product_id)==1){
              this.listCodeDiscount[data.data.code]={
                'sale':data.data.detail_sale,
                'product_id':data.data.product_id,
                'price':data.data.price*(1-data.data.sale/100),
                'price_sale':data.data.price*(1-data.data.sale/100)*data.data.detail_sale/100
              };
              this.updateTotal();
            }else{
              this.alertService.warn("Một mặt hàng chỉ được áp dụng 1 mã giảm giá.");
            }
          }else{
            this.alertService.warn("Bạn đã sử dụng mã này rồi.");
          }
        }else{
          this.alertService.error(data.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      }
    );
    console.log(this.listCodeDiscount);
  }
  removeCodeDiscount(code){
    if((code in this.listCodeDiscount)){
      delete this.listCodeDiscount[code];
    }
    this.updateTotal();
  }
  isJSON(str) {
    try { 
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}
