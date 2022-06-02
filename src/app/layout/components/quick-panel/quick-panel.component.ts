import { Component, ViewEncapsulation } from '@angular/core';
import { ProductService } from 'app/main/product/product.service';
import { AlertService } from 'app/services/alert.service';
import { AuthService } from 'app/services/auth.service';
@Component({
    selector     : 'quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent
{
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    listShop:any=[];
    createdShop:boolean=false;
    listFeedBack:any=[];

    /**
     * Constructor
     */
    constructor(
      public productService:ProductService,
        public alertService: AlertService,
        public authService: AuthService,
    )
    {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };
    }
    ngOnInit() {
      if(this.authService.checkIsLogedIn()){
        this.getListShop();
        this.getListFeedBack();
      }
    }
    getListShop(){
        this.productService.getListShop().pipe().subscribe(
          data=>{
            if(data.status=="success"){
              this.listShop=data.data;
              this.productService.createdShop=true;
             
            }else{
              this.productService.createdShop=false;
              this.alertService.error(data.error.message);
            }
          },
          error=>{
            this.alertService.error("Lỗi kết nối");
          }
        );
    }
    getListFeedBack(){
      this.productService.listFeedBack().pipe().subscribe(
        data=>{
          if(data.status=="success"){
            this.listFeedBack=data.data;
           
          }else{
            this.alertService.error(data.error.message);
          }
        },
        error=>{
          this.alertService.error("Lỗi kết nối");
        }
      );
    }
    seen(id,index){
      this.productService.seenReport(id).pipe().subscribe(
        data=>{
          if(data.status=="success"){
            this.alertService.success("Đã xem 1 thông báo");
            this.listFeedBack.splice(index,1);
          }else{
            this.alertService.error(data.error.message);
          }
        },
        error=>{
          this.alertService.error("Lỗi kết nối");
        }
      );
    }
}
