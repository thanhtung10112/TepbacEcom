import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
import { summerNoteConfig } from "environments/environment";
@Component({
    selector: "app-update-detail",
    templateUrl: "./update-detail.component.html",
    styleUrls: ["./update-detail.component.scss"],
    animations: fuseAnimations,
})
export class UpdateDetailComponent implements OnInit {
    config = summerNoteConfig;
    loading = new LoadingFlag();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<UpdateDetailComponent>
    ) {}

    ngOnInit() {}
    save() {
        this.dialogRef.close(this.data);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
