import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
import { summerNoteConfig } from "environments/environment";

@Component({
    selector: "app-update-description",
    templateUrl: "./update-description.component.html",
    styleUrls: ["./update-description.component.scss"],
    animations: fuseAnimations,
})
export class UpdateDescriptionComponent implements OnInit {
    config = summerNoteConfig;
    loading = new LoadingFlag();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<UpdateDescriptionComponent>
    ) {}

    ngOnInit() {}
    save() {
        this.dialogRef.close(this.data);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
