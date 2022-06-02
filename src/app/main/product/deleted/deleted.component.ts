import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { AlertService } from 'app/services/alert.service';
import { from } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from 'app/_directives/confirm/confirm.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-deleted',
  templateUrl: './deleted.component.html',
  styleUrls: ['./deleted.component.scss'],
  animations: fuseAnimations
})
export class DeletedComponent implements OnInit {

  public listProduct: any = [];

  public shopEnable: String[] = [];
  public loading = new LoadingFlag();
  public action = 'delete';
  constructor(
    private productService: ProductService,
    public alertService: AlertService,
    public dialog : MatDialog,
    public router : Router
  ) { }

  ngOnInit() {
    this.getListProduct('');

    this.productService.shopChange$.subscribe((v) => {
      if (v !== 0) {
        this.getListProductByShop(v);
      }
    })
  }
  getListProductByShop(id) {
    if (id != "") {
      let option = '&status='+this.action+"&shop_id=" + id;
      this.getListProduct(option);
    } else {
      let option = '&status='+this.action;
      this.getListProduct(option);
    }
  }
  getListProduct(option) {
    option += '&status='+this.action;
    this.loading.setPending(true);
    this.productService.getListProduct(option).pipe().subscribe(
      data => {
        if (data.status == "success") {
          this.loading.setResult(true);
          this.listProduct = data.data;
        } else {
          this.loading.setResult(false);
          this.alertService.error(data.error.message);
        }
      }, error => {
        this.loading.setResult(false);
        this.alertService.error("Lỗi kết nối");
      }
    )
  }
  restore(id){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "500px",
      data: {
          title: "Khôi phục sản phẩm",
          subTitle:
              "Bạn có chắc muốn khôi phục sản phẩm này?",
      },
  });
  dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.loading.setPending(true);
          this.productService.restoreProduct(id).subscribe(
              (res) => {
                  if (res.status == "success") {
                      this.loading.setResult(true);
                      this.alertService.success(
                          "Khôi phục sản phẩm thành công"
                      );
                      this.router.navigate(["/product/selling"]);
                  } else {
                      this.loading.setResult(false);
                      this.alertService.error(res.error.message);
                  }
              },
              () => {
                  this.loading.setResult(false);
                  this.alertService.error("Lỗi kết nối");
              }
          );
      }
  });
  }

}
