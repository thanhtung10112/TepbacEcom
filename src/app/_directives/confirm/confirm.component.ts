import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

 
@Component({
    selector: 'confirm',
    templateUrl: 'confirm.component.html'
})
 
export class ConfirmComponent {
    
 
    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onNoClick(): void {
        //console.log('Dong')
        this.dialogRef.close();
    }

}
