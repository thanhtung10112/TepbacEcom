import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./product-routing.module";

import { MaterialModule } from "app/material.module";
import { DiscountComponent } from "./discount/discount.component";
import { ImageProductComponent } from "./image-product/image-product.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxSummernoteModule } from "ngx-summernote";
import { CKEditorModule } from "ckeditor4-angular";
import { FormsModule } from "@angular/forms";
import { ConfirmDeleteComponent } from "app/main/product/confirm-delete/confirm-delete.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDividerModule } from "@angular/material";
import { FuseSharedModule } from "@fuse/shared.module";
import { StarRatingModule } from "angular-star-rating";
import { ProductComponent } from "./product.component";
import { SellingComponent } from "./selling/selling.component";
import { HandlingComponent } from "./handling/handling.component";
import { InsertProductComponent } from "./insert-product/insert-product.component";
import { BlockingComponent } from "./blocking/blocking.component";
import { DeletedComponent } from "./deleted/deleted.component";

import * as echarts from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
import { ProductChartComponent } from "./product-detail/product-chart/product-chart.component";
@NgModule({
    declarations: [
        DiscountComponent,
        ImageProductComponent,
        ConfirmDeleteComponent,
        ProductDetailComponent,
        ProductComponent,
        SellingComponent,
        HandlingComponent,
        InsertProductComponent,
        BlockingComponent,
        DeletedComponent,
        ProductChartComponent,
    ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        MaterialModule,
        MatCheckboxModule,
        FlexLayoutModule,
        NgxSummernoteModule,
        CKEditorModule,
        FormsModule,

        FlexLayoutModule,
        StarRatingModule.forRoot(),

        // Fuse modules
        FuseSharedModule,

        //plugin
        NgxSummernoteModule,
        CKEditorModule,

        // Material moment date module
        MatMomentDateModule,
        MatDividerModule,
        NgxEchartsModule.forRoot({
            echarts,
        }),
    ],
    entryComponents: [
        DiscountComponent,
        ImageProductComponent,
        ConfirmDeleteComponent,
        ProductChartComponent,
    ],
})
export class ProductModule {}
