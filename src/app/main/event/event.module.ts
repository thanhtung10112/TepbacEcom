import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'app/material.module';
import { FuseWidgetModule } from '@fuse/components';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './edit-product/edit-product.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule,OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const eventRoutes: Routes = [
  {
      path: 'detail/:id',
      component: EventComponent, 
  },
];
export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY HH:mm',
  fullPickerInput: 'DD/MM/YYYY HH:mm',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
  declarations: [EventComponent, AddProductComponent, EditProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(eventRoutes),
    FuseWidgetModule,
    FlexLayoutModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule
  ],
  entryComponents:[
    AddProductComponent,
    EditProductComponent
  ],
  providers:[{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }]
})
export class EventModule { }
