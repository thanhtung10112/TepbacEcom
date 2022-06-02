import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { AlertService } from 'app/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-image-product',
  templateUrl: './image-product.component.html',
  styleUrls: ['./image-product.component.scss'],
  animations : fuseAnimations
})
export class ImageProductComponent implements OnInit {
  arrayImage:any=[];
  limitUpload:any=0;
  public myFile:File;
  public myNameFile:any;
  pathImage:any="";
  myFormDataUpload: FormData;
  constructor(
    public dialogRef: MatDialogRef<ImageProductComponent>,
    private productService: ProductService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
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
  ngOnInit() {
    // console.log(this.data);
    this.arrayImage=this.isJSON(this.data.image)==false ? [] : JSON.parse(this.data.image);
    this.limitUpload=this.arrayImage.length;
    if(localStorage.getItem('product_uploads')===null){
      localStorage.setItem('product_uploads','1');
    }
    // console.log(this.limitUpload);
  }
  removeImageProduct(path,index){
    this.productService.removeImageProduct(path).pipe().subscribe(
      res=>{
        if(res.status=="success"){
          this.arrayImage.splice(index,1);
          this.limitUpload-=1;
          this.saveImageProduct();
        }else{
          this.alertService.error(res.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      }
    )
  }
  uploadAvatar(event) {
    if(localStorage.getItem('product_uploads')=='3'){
      this.alertService.error("Bạn chỉ được tải lên tối đa 3 ảnh.");
    }else{
      let myFileList: FileList = event.target.files;
      // console.log(myFileList);
      if (myFileList.length > 0) {
        this.myFile = myFileList[0];
        this.myFormDataUpload = new FormData();
        this.myFormDataUpload.append('avatarFile', this.myFile);
      }
      let isUploadSuccess=1;
      this.productService.uploadImageShopProduct(this.data.id,this.myFormDataUpload,this.myNameFile).pipe().subscribe(
        res=>{
          if(res.status=="success"){
            //console.log(res.data);
            this.arrayImage.push(res.data);
            this.limitUpload=this.arrayImage.length;
            localStorage.setItem('product_uploads',(parseInt(localStorage.getItem('product_uploads'))+1).toString());
            this.saveImageProduct();
            // this.alertService.success("Đã tải ảnh thành công");
          }else{
            isUploadSuccess=0;
            this.alertService.error(res.error.message);
          }
        },error=>{
          isUploadSuccess=0;
          this.alertService.error("Lỗi kết nối");
        }
      );
     
    }
  }
  saveImageProduct(){
    let params={
      id:this.data.id,
      image:JSON.stringify(this.arrayImage)
    }
    // console.log("array1",JSON.stringify(this.arrayImage));
    this.productService.saveImageProduct(params).pipe().subscribe(
      res=>{
        if(res.status=="success"){
          //console.log('ĐÃ TẢI',res.data);
          this.alertService.success("Đã lưu thay đổi");
        }else{
          this.alertService.error(res.error.message);
        }
      },error=>{
        this.alertService.error("Lỗi kết nối");
      }
    )
  }
}
