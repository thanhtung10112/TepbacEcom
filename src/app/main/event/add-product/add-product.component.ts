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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  animations : fuseAnimations
})
export class AddProductComponent implements OnInit {
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
  public date = new Date()
  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public eventService : EventService,
    public alertSerive : AlertService,
    public productService : ProductService
  ) { }

  ngOnInit() {
    this.event = this.data.event;
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
            this.message = "Kh??ng t??m th???y c??ng ty";
        }
    });
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
      this.alertSerive.error("L???i k???t n???i");
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
      this.alertSerive.error("L???i k???t n???i");
    })
  }
  save(){
    let param = this.form.value;
    this.eventService.addProduct(this.form.value).subscribe(res=>{
      if(res.status == 'success'){
        this.dialogRef.close(true);
      }else{
        this.alertSerive.error(res.error.message)
      }
    },()=>{
      this.alertSerive.error("L???i k???t n???i");
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
        return "?????ng gi?? "+type.value+"??";
      case 'free_ship':
        return "Mi???n ph?? v???n chuy???n cho ????n t??? "+type.min+"?? t???i ??a "+type.limit+"??";
      case 'suport_ship':
        return "H??? tr??? "+type.value+"?? v???n chuy???n cho ????n t???i thi???u "+type.min+"KG";
      case 'same_ship':
        return "?????ng gi?? v???n chuy???n "+type.value+"?? cho ????n h??ng d?????i "+type.limit+"KG";
      case 'sale_percent':
        return "Gi???m "+type.value+"% gi?? s???n ph???m";
      case 'sale_price':
        return "Gi???m "+type.value+"?? gi?? s???n ph???m"; 
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
