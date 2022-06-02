import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ShopService } from '../shop.service';
import { AlertService } from 'app/services/alert.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { LoadingFlag } from 'app/model/loading.model';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  formCtrl:FormGroup=new FormGroup({
    event:new FormControl('',Validators.required),
  });
  loading = new LoadingFlag();
  constructor(
    public dialogRef: MatDialogRef<EventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private shopService: ShopService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.formCtrl.patchValue({event:this.data.event});
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(){
    this.loading.setPending(true);
    let params={
      event:this.formCtrl.value.event
    }
    this.shopService.updateEvent(params,this.data.id).pipe().subscribe(
      data=>{
        if(data.status=="success"){
          this.loading.setResult(true);
          this.alertService.success("Cập nhật cửa hàng thành công!");
          this.dialogRef.close(this.formCtrl.value.event);
        }else{
          this.loading.setResult(false);
          this.alertService.error(data.error.message);
        }
      },
      error=>{
        this.loading.setResult(false);
        this.alertService.error("Lỗi kết nối");
      }
    );
  }

}
