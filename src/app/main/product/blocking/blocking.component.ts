import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { AlertService } from 'app/services/alert.service';
import { from } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { LoadingFlag } from 'app/model/loading.model';
@Component({
  selector: 'app-blocking',
  templateUrl: './blocking.component.html',
  styleUrls: ['./blocking.component.scss'],
  animations: fuseAnimations
})
export class BlockingComponent implements OnInit {
  public listProduct: any = [];

  public shopEnable: String[] = [];
  public loading = new LoadingFlag();
  public action = 'block';
  constructor(
    private productService: ProductService,
    public alertService: AlertService
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

}
