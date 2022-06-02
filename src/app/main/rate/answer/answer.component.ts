import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';
import { AlertService } from 'app/services/alert.service';
import { RateService } from '../rate.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
  animations : fuseAnimations
})
export class AnswerComponent implements OnInit {
  loading=new LoadingFlag();
  content:string='';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<AnswerComponent>,
    private rateService:RateService,
    private alertService : AlertService
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    console.log(this.data);
  }
  save(){
    let param={
      product_id:this.data.product_id,
      shop_id:this.data.shop_id,
      shop_name:this.data.shop_name,
      post_id:this.data.id,
      is_shop:1,
      content:this.content
    }
    this.rateService.add(param).subscribe(res=>{
      if(res.status=="success"){
        this.alertService.success("Đã trả lời đánh giá");
        this.dialogRef.close();
      }else{
        this.alertService.error(res.error.message)
      }
    },()=>{
      this.alertService.error("Lỗi kết nối tới máy chủ")
    })
  }

}
