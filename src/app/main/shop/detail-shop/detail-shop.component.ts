import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/services/alert.service';
import { ShopService } from 'app/main/shop/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateShopComponent } from '../update-shop/update-shop.component';
import { from } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';
import { load } from '@angular/core/src/render3';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-detail-shop',
  templateUrl: './detail-shop.component.html',
  styleUrls: ['./detail-shop.component.scss'],
  animations: fuseAnimations
})
export class DetailShopComponent implements OnInit {
  shopId: any;
  public inforShop: any = [];
  loading = new LoadingFlag();
  constructor(
    public route: ActivatedRoute,
    public shopService: ShopService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.shopId = this.route.snapshot.paramMap.get('id');
    this.getDetailShop(this.shopId);
  }
  getDetailShop(id) {
    this.loading.setPending(true);
    this.shopService.getDetailShop(id).pipe().subscribe(
      data => {
        if (data.status = "success") {
          this.inforShop = data.data;
          // this.inforShop.image=this.inforShop.image.replaceAll('thumb_image','ge_image');
          // this.inforShop.logo=this.inforShop.logo.replaceAll('thumb_image','ge_image');

          this.loading.setResult(true);
        } else {
          this.alertService.error(data.error.message);
          this.loading.setResult(false);
        }
      }, error => {
        this.alertService.error("Lỗi kết nối");
        this.loading.setResult(false);
      }
    )
  }
  openEdit(id) {
    const dialogRef = this.dialog.open(UpdateShopComponent, {
      width: '500px',
      data: this.inforShop
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('The dialog edit was closed');
        this.getDetailShop(this.shopId);
      }
    });
  }
  uploadAvatar(event) {
    let myFileList: FileList = event.target.files;
    if (myFileList.length > 0) {
      let myFile: File = myFileList[0];
      const myFileName = myFile.name;
      let myFormData: FormData = new FormData();
      myFormData.append('avatarFile', myFile);
      if (localStorage.getItem('avatar_uploads') === null) {
        localStorage.setItem('avatar_uploads', '1');
      }
      this.shopService.uploadImageShop(myFormData, myFileName, this.shopId, localStorage.getItem('avatar_uploads')).pipe().subscribe(
        res => {
          if (res.status == "success") {
            this.alertService.success("Đã thay đổi ảnh thành công");
            this.getDetailShop(this.shopId);
          } else {
            this.alertService.error(res.error.message);
          }
        }, error => {
          this.alertService.error("Lỗi kết nối");
        }
      );
    }
  }
  uploadLogo(event) {
    let myFileList: FileList = event.target.files;
    if (myFileList.length > 0) {
      let myFile: File = myFileList[0];
      const myFileName = myFile.name;
      let myFormData: FormData = new FormData();
      myFormData.append('avatarFile', myFile);
      if (localStorage.getItem('avatar_uploads') === null) {
        localStorage.setItem('avatar_uploads', '1');
      }
      this.shopService.uploadLogoShop(myFormData, myFileName, this.shopId, localStorage.getItem('avatar_uploads')).pipe().subscribe(
        res => {
          if (res.status == "success") {
            this.alertService.success("Đã thay đổi ảnh thành công");
            this.getDetailShop(this.shopId);
          } else {
            this.alertService.error(res.error.message);
          }
        }, error => {
          this.alertService.error("Lỗi kết nối");
        }
      );
    }
  }
  numberWithCommas(x: number) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return "";
  }
  openEvent(){
    const dialogRef = this.dialog.open(EventComponent, {
      width: '500px',
      data: this.inforShop
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.inforShop.event=result;
      }
      
    });
  }


}
