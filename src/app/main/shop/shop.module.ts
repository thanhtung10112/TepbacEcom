import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from '../shop/shop-routing.module';
import { MaterialModule } from 'app/material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DetailShopComponent } from './detail-shop/detail-shop.component';
import { UpdateShopComponent } from './update-shop/update-shop.component';
import { CreateShopComponent } from './create-shop/create-shop.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { EventComponent } from './event/event.component';
@NgModule({
  declarations: [
    ShopComponent,
    DetailShopComponent, 
    UpdateShopComponent,
    CreateShopComponent,
    EventComponent,
    
    
    ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents:[
    UpdateShopComponent,
    EventComponent
  ]
})
export class ShopModule { }
