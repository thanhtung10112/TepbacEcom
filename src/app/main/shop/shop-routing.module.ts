import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ShopComponent } from '../shop/shop.component';
import { DetailShopComponent } from './detail-shop/detail-shop.component';
import { UpdateShopComponent } from './update-shop/update-shop.component';
import { CreateShopComponent } from './create-shop/create-shop.component';
const shopRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path:'detail/:id',
                component: DetailShopComponent,
            },
            {
                path:'create',
                component:CreateShopComponent
            },
            {
                path: '',
                component: ShopComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(shopRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class ShopRoutingModule {
}