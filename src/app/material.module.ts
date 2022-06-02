import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatGridListModule, MatTabsModule, MatExpansionModule, MatCardModule, MatBadgeModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatSortModule, MatMenuModule, MatInputModule, MatCheckboxModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatRadioModule, MatDatepickerModule, MatSelectModule, MatProgressBarModule, MatButtonToggleModule, MatAutocompleteModule, MatChipsModule, MatStepperModule, MatPaginatorIntl, MatRippleModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { getVietnamPaginatorIntl } from 'utils/vi-paginator-intl';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        MatSlideToggleModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatGridListModule,
        MatTabsModule,
        MatExpansionModule,
        MatCardModule,
        MatBadgeModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatDatepickerModule,
        LayoutModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatSortModule,
        MatStepperModule,
        MatRippleModule
    ],
    exports: [
        MatSlideToggleModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatGridListModule,
        MatTabsModule,
        MatExpansionModule,
        MatCardModule,
        MatBadgeModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTooltipModule,
        MatDialogModule,
        MatRadioModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatSortModule,
        MatStepperModule,
        MatRippleModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getVietnamPaginatorIntl() }
      ]
})

export class MaterialModule {}
