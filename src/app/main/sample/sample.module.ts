import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { SampleComponent } from './sample.component';

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports     : [


        FuseSharedModule
    ],
    exports     : [
        SampleComponent
    ]
})

export class SampleModule
{
}
