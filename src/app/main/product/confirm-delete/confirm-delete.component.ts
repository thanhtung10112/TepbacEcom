import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
  ) { }

  ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close();
  }

}
