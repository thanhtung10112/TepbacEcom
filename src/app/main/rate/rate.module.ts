import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateComponent } from './rate.component';
import { MaterialModule } from 'app/material.module';
import {RouterModule, Routes} from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AnswerComponent } from './answer/answer.component';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
const rateRoutes: Routes = [
  {
      path: '',
      component: RateComponent, 
  },
];
@NgModule({
  declarations: [RateComponent, AnswerComponent, DetailComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    RouterModule.forChild(rateRoutes)
  ],
  entryComponents: [
    AnswerComponent,
    DetailComponent
  ]
})
export class RateModule { }
