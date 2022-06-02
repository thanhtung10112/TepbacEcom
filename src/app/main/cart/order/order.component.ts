import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { CartService } from '../cart.service';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { AlertService } from 'app/services/alert.service';
import {Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations : fuseAnimations
})
export class OrderComponent implements OnInit {
  optionsPhone:string[]=[];
  optionsAddress:string[]=[];
  optionsName:string[]=[];
  filteredOptionsPhone: Observable<string[]>;
  filteredOptionsAddress: Observable<string[]>;
  filteredOptionsName: Observable<string[]>;
  formOrder:FormGroup;
  phoneCtrl=new FormControl('',Validators.required);
  addressCtrl=new FormControl('',Validators.required);
  nameCrt=new FormControl('',Validators.required);
  constructor(
    public dialogRef:MatDialogRef<OrderComponent>,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  buildForm(){
    this.formOrder=this.formBuilder.group({
      'phone':this.phoneCtrl,
      'address':this.addressCtrl,
      'name':this.nameCrt,
    })
  }
  ngOnInit() {
    this.buildForm();
    this.getInforCustomer();
  }
  private _filter(value: string,options): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getInforCustomer(){
    this.cartService.getInforCustomer().pipe().subscribe(
      data=>{
        if(data.status=="success"){
          this.optionsName=data.data.name;
          this.optionsPhone=data.data.phone;
          this.optionsAddress=data.data.address;
          this.filteredOptionsPhone = this.phoneCtrl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value,this.optionsPhone))
          );
          this.filteredOptionsName = this.nameCrt.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value,this.optionsName))
          );
          this.filteredOptionsAddress = this.addressCtrl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value,this.optionsAddress))
          );
         
        }else{
          this.alertService.success(data.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      }
    )
  }
  saveOrder(){
    let listCode={};
    for(let key in this.data.codeDiscount){
      listCode[key]=this.data.codeDiscount[key].price_sale;
    }
    let params={
      code:JSON.stringify(listCode),
      name:this.formOrder.value.name,
      address:this.formOrder.value.address,
      phone:this.formOrder.value.phone
    }
    this.cartService.saveOrder(params).subscribe(
      res=>{
        if(res.status=="success"){
          this.alertService.success("Đặt hàng thành công.");
          this.onNoClick();
          this.router.navigate(['/cart/']);
        }else{
          this.alertService.success(res.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      }
    );
    
  }
  

}
