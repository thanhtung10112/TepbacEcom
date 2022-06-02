import { NgModule  } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule,MatIconModule,MatCheckboxModule } from '@angular/material';
import {RouterModule} from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { QuickPanelComponent } from 'app/layout/components/quick-panel/quick-panel.component';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatIconModule,
        MatCheckboxModule,
        FuseSharedModule,
        MatExpansionModule,
        RouterModule
    ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule
{
}
