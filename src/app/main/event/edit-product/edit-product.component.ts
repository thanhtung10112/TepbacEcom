import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, ThemePalette } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from 'app/main/product/product.service';
import { LoadingFlag } from 'app/model/loading.model';
import { AlertService } from 'app/services/alert.service';
import moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EventService } from '../event.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  animations : fuseAnimations
})
export class EditProductComponent implements OnInit {

  event:any;
  form : FormGroup = new FormGroup({
    event_id : new FormControl('',Validators.required),
    product_id : new FormControl('',Validators.required),
    type_id : new FormControl('',Validators.required),
    term_id : new FormControl('',Validators.required),
    type_show : new FormControl('',Validators.required),
    quantity : new FormControl('',Validators.required),
    productSearch : new FormControl(''),
    start_time :new FormControl('',Validators.required),
    end_time :new FormControl('',Validators.required),
    timeChoose : new FormControl('')
  });
  loading = new LoadingFlag();
  listType : any;
  listTerm : any
  products$ : Observable < any[] > ;
  maxDate = moment();
  minDate = moment();
  private searchTerms = new Subject < string > ();
  message:string;
  seletedType : any;
  product_event_id : string;
  product_id : string;
  public date = new Date()
  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public eventService : EventService,
    public alertSerive : AlertService,
    public productService : ProductService
  ) { }

  ngOnInit() {
    this.event = this.data.event;
    this.product_event_id = this.data.product_event_id;
    this.minDate = moment(this.event.start_time*1000);
    this.maxDate = moment(this.event.end_time*1000);
    this.form.patchValue({event_id : this.event.id});
    this.loadType();
    this.loadTerm();
    let tem = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.getSearchProduct(term))
    );
    this.products$ = tem;
    
    this.products$.subscribe((data) => {
        if (data) {
            this.loading.setResult(true);
            this.message = "";
        } else {
            this.loading.setResult(false);
            this.message = "Không tìm thấy công ty";
        }
    });
    this.loadData();

  }
  initForm(param){
    let indexSeleted = 99;
    let startTime = parseInt(moment(param.start_time*1000).format('H'));
    let endTime = parseInt(moment(param.end_time*1000).format('H'));
    for(let i = 0; i< this.event.times.length ; i++){
      if(this.event.times[i][0] == startTime && this.event.times[i][1] == endTime){
        indexSeleted = i;
      }
    }
    this.form.setValue({
      event_id : param.event_id,
      product_id : param.product_id,
      type_id : param.type_id,
      term_id : param.term_id,
      type_show : param.type_show,
      quantity : param.quantity,
      productSearch : '',
      start_time : param.start_time,
      end_time : param.end_time,
      timeChoose : indexSeleted
    });
    console.log(this.form.value);
  }
  loadData(){
    this.eventService.getProduct(this.product_event_id).subscribe(res=>{
      if(res.status == 'success'){
        this.initForm(res.data);
        this.search({target:{value : this.data.product_name}});
        let index = this.listType.findIndex(e=>{
          return e.id===res.data.type_id;
        });
        if(index>=0){
          this.seletedType={
            content : this.getDetailType(this.listType[index]),
            image : this.listType[index].image
          }
        } 
      }else{
        this.alertSerive.error(res.error.message);
      }
    },()=>{
      this.alertSerive.error("Lỗi kết nối");
    })
  }
  getSearchProduct(val: string): Observable < any[] > {
    this.loading.setPending(true);
    if (!val.trim()) {
        // if not search term, return empty array.
        this.loading.setResult(true);
        return of([]);
    }
    return this.eventService.searchProduct(val).pipe();
  }
  loadType(){
    this.eventService.listTypeEvent(this.event.id).subscribe(res=>{
      if(res.status == 'success'){
        this.listType=res.data;
      }else{
        this.alertSerive.error(res.error);
      }
    },()=>{
      this.alertSerive.error("Lỗi kết nối");
    })
  }
  loadTerm(){
    this.eventService.listTermEvent(this.event.id).subscribe(res=>{
      if(res.status == 'success'){
        this.listTerm=res.data;
      }else{
        this.alertSerive.error(res.error);
      }
    },()=>{
      this.alertSerive.error("Lỗi kết nối");
    })
  }
  save(){
    let param = this.form.value;
    this.eventService.editProduct(this.product_event_id,this.form.value).subscribe(res=>{
      if(res.status == 'success'){
        this.dialogRef.close(true);
      }else{
        this.alertSerive.error(res.error.message)
      }
    },()=>{
      this.alertSerive.error("Lỗi kết nối");
    })
  }
  onTypeChange(ev){
    let index = this.listType.findIndex(e=>{
      return e.id===ev.value;
    });
    if(index>=0){
      this.seletedType={
        content : this.getDetailType(this.listType[index]),
        image : this.listType[index].image
      }
    } 
  }
  getDetailType(type){
    switch(type.key){
      case 'same':
        return "Đồng giá "+type.value+"đ";
      case 'free_ship':
        return "Miễn phí vận chuyển cho đơn từ "+type.min+"đ tối đa "+type.limit+"đ";
      case 'suport_ship':
        return "Hỗ trợ "+type.value+"đ vận chuyển cho đơn tối thiểu "+type.min+"KG";
      case 'same_ship':
        return "Đồng giá vận chuyển "+type.value+"đ cho đơn hàng dưới "+type.limit+"kg";
      case 'sale_percent':
        return "Giảm "+type.value+"% giá sản phẩm";
      case 'sale_price':
        return "Giảm "+type.value+"đ giá sản phẩm"; 
      default:
        return '';       
    }
  }
  search(term): void {
    this.searchTerms.next(term.target.value);
  }

  selectedTime(ev){
    let index=ev.value;
    if(index == 99){
      this.form.patchValue({
        start_time:this.event.start_time,
        end_time : this.event.end_time
      });
    }else{
      let timeMonthStart = moment(this.event.start_time * 1000).format("YYYY-MM-DD");
      let timeMonthEnd = moment(this.event.end_time * 1000).format("YYYY-MM-DD");
      this.form.patchValue({
        start_time: moment(this.event.times[index][0]+":00:00 "+timeMonthStart).valueOf()/1000,
        end_time : moment(this.event.times[index][1]+":00:00 "+timeMonthEnd).valueOf()/1000,
      });
    }
  }

}
