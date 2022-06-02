import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';
import { AlertService } from 'app/services/alert.service';
import { RateService } from '../rate.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations : fuseAnimations
})
export class DetailComponent implements OnInit {
  loading=new LoadingFlag();
  list:any=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<DetailComponent>,
    private rateService:RateService,
    private alertService : AlertService
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getList();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getList(){
    this.rateService.getListShop(this.data.id).subscribe(res=>{
      if(res.status=="success"){
        this.list=res.data;
      }else{
        this.alertService.error(res.error.message)
      }
    },()=>{
      this.alertService.error("Lỗi kết nối tới máy chủ");
    })
  }

}
