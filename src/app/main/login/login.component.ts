import { Component, OnInit,NgZone } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';
import { RequestApiService } from '../../services/request-api.service';
import { UserStatusService } from '../../services/user-status.service';
import { AlertService } from '../../services/alert.service';
import { LoadingFlag } from '../../model/loading.model';
import { ProductService } from 'app/main/product/product.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations : fuseAnimations
})
export class LoginComponent implements OnInit {
  public loadingFlag = new LoadingFlag();

  // Private
  private _unsubscribeAll: Subject<any>;

  loginForm: FormGroup;
  loginMessage: string;
  returnUrl: string;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private reqAPIService: RequestApiService,
    private userStatusService: UserStatusService,
    private alertService: AlertService,
    private zone: NgZone,
    private productService:ProductService
  ) { 
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        }
      }
    };
    this._unsubscribeAll = new Subject();
  }
  // timeout() {
  //   setTimeout(() => {
  //     return this.zone.run(() => this.router.navigate([this.returnUrl]));
  //   });
  // }
  ngOnInit() {
    this.createForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']?this.route.snapshot.queryParams['returnUrl']:"";
    //console.log(this.returnUrl);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  createForm() {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required,Validators.minLength(5)]],
      remember: true
    });
  }
  onSubmit() {
    this.loginMessage = null;
    this.loadingFlag.setPending(true);
    this.authService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data.status == "error"){
            this.loginMessage = data.error.message;
          }else{
            this.getListShop();
            this.router.navigate([this.returnUrl]);
          }
          this.loadingFlag.setResult(true);
        },
        error => {
          this.loadingFlag.setResult(false);
          this.alertService.error("Lỗi kết nối");
        });
  }
  getListShop(){
    this.productService.getListShop().pipe().subscribe(
      data=>{
        if(data.status=="success"){
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

}
