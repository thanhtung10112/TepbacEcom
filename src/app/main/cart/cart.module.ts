import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';
import {RouterModule, Routes} from '@angular/router';
import { MaterialModule } from 'app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderComponent } from './order/order.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
const cartRoutes: Routes = [
  {
      path: '',
      component: CartComponent, 
  },
];
@NgModule({
  declarations: [CartComponent, OrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(cartRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    OrderComponent
  ]
})
export class CartModule { }
