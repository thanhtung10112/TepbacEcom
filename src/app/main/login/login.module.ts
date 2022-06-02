import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    LoginComponent
],
imports     : [
  CommonModule,

  RouterModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,

  FormsModule,
  ReactiveFormsModule,
  FlexLayoutModule
  ]
})
export class LoginModule { }
