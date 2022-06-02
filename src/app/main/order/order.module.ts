import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material";
import {DetailComponent} from './detail/detail.component';
import { OrderComponent } from './order.component';
import { MaterialModule } from 'app/material.module';
import {RouterModule, Routes} from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReportComponent } from './report/report.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
const orderRoutes: Routes = [
  {
      path: '',
      component: OrderComponent, 
  },
];
@NgModule({
  declarations: [
    DetailComponent,
    OrderComponent,
    FuseConfirmDialogComponent
  ],
  imports: [ 
    CommonModule,
    MaterialModule,
    MatDialogModule,
    FlexLayoutModule,
    RouterModule.forChild(orderRoutes)
  ],
  entryComponents: [
    DetailComponent,
    FuseConfirmDialogComponent
  ]
  
})
export class OrderModule { }
