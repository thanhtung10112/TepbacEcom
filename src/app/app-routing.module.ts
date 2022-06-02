import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import {
    AuthGuardService
} from './services/auth-guard.service';
import {
    LoginComponent
} from './main/login/login.component';
import {
    ProductComponent
} from './main/product/product.component';
import {
    ProductDetailComponent
} from './main/product/product-detail/product-detail.component';
import {
    InsertProductComponent
} from './main/product/insert-product/insert-product.component';
import {
    HomeComponent
} from './main/home/home.component';
import {
    StatisticComponent
} from './main/statistic/statistic.component';
const routes: Routes = [{
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
    },
    {
        path: 'order',
        loadChildren: './main/order/order.module#OrderModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'rate',
        loadChildren: './main/rate/rate.module#RateModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'statistic',
        component: StatisticComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'cart',
        loadChildren: './main/cart/cart.module#CartModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'product',
        loadChildren: './main/product/product.module#ProductModule',
        canActivate: [AuthGuardService],
    },
    {
        path: 'shop',
        loadChildren: './main/shop/shop.module#ShopModule',
        canActivate: [AuthGuardService],
    },
    {
        path: 'event',
        loadChildren: './main/event/event.module#EventModule',
        canActivate: [AuthGuardService],
    }
];
@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }