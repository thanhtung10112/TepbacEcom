import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductComponent } from "./product.component";
import { SellingComponent } from "./selling/selling.component";
import { HandlingComponent } from "./handling/handling.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { InsertProductComponent } from "./insert-product/insert-product.component";
import { BlockingComponent } from "./blocking/blocking.component";
import { DeletedComponent } from "./deleted/deleted.component";
const productRoutes: Routes = [
    {
        path: "product",
        component: ProductComponent,
        children: [
            {
                path: "selling",
                component: SellingComponent,
            },
            {
                path: "handling",
                component: HandlingComponent,
            },
            {
                path: "blocking",
                component: BlockingComponent,
            },
            {
                path: "deleted",
                component: DeletedComponent,
            },
            {
                path: "detail/:id",
                component: ProductDetailComponent,
            },
            {
                path: "",
                redirectTo: "selling",
                pathMatch: "full",
            },
        ],
    },
    {
        path: "insert-product",
        component: InsertProductComponent,
    },
];
@NgModule({
    imports: [RouterModule.forChild(productRoutes)],
    exports: [RouterModule],
})
export class ProductRoutingModule {}
