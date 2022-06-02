import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import * as echarts from "echarts";

import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { AlertComponent } from "./_directives/alert/alert.component";
import { ConfirmComponent } from "./_directives/confirm/confirm.component";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
    FuseWidgetModule,
} from "@fuse/components";
import { FlexLayoutModule } from "@angular/flex-layout";
import { fuseConfig } from "app/fuse-config";
import { StarRatingModule } from "angular-star-rating";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { SampleModule } from "app/main/sample/sample.module";
import { LoginModule } from "app/main/login/login.module";
import { AppRoutingModule } from "./app-routing.module";
import { AlertService } from "../app/services/alert.service";
import { HomeComponent } from "app/main/home/home.component";
import { MaterialModule } from "./material.module";
import { UpdateProductComponent } from "./main/product/update-product/update-product.component";
import { NgxSummernoteModule } from "ngx-summernote";
import { CKEditorModule } from "ckeditor4-angular";
import { DetailDiscountComponent } from "./main/product/detail-discount/detail-discount.component";
import { ReportComponent } from "./main/order/report/report.component";
import { StatisticComponent } from "./main/statistic/statistic.component";
import { ChartModule } from "angular2-chartjs";
import { UpdateDetailComponent } from "app/main/product/product-detail/update-detail/update-detail.component";
import { UpdateDescriptionComponent } from "app/main/product/product-detail/update-description/update-description.component";
import { MatDividerModule } from "@angular/material";
import { ProductModule } from "./main/product/product.module";
import { UpdateOptionComponent } from "./main/product/product-detail/update-option/update-option.component";
import { AddOptionComponent } from "./main/product/product-detail/add-option/add-option.component";
@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        ConfirmComponent,
        HomeComponent,

        UpdateProductComponent,
        DetailDiscountComponent,
        ReportComponent,
        StatisticComponent,
        UpdateDescriptionComponent,
        UpdateDetailComponent,
        UpdateOptionComponent,
        AddOptionComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        HttpClientModule,
        TranslateModule.forRoot(),
        LoginModule,
        ProductModule,
        FlexLayoutModule,
        StarRatingModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,
        MaterialModule,
        MatDividerModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseWidgetModule,

        //plugin
        NgxSummernoteModule,
        CKEditorModule,

        // App modules
        LayoutModule,
        SampleModule,
        LoginModule,
        AppRoutingModule,

        //chart
        NgxEchartsModule.forRoot({ echarts }),
    ],
    bootstrap: [AppComponent],
    providers: [AlertService],
    entryComponents: [
        UpdateProductComponent,
        ConfirmComponent,
        DetailDiscountComponent,
        ReportComponent,
        StatisticComponent,
        UpdateDescriptionComponent,
        UpdateDetailComponent,
        UpdateOptionComponent,
        AddOptionComponent,
    ],
})
export class AppModule {}
