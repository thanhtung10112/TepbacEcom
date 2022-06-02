import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  formCtrl:FormGroup=new FormGroup({
    content: new FormControl('',Validators.required)
  });
  constructor(
    public dialogRef: MatDialogRef<ReportComponent>
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(){
    this.dialogRef.close(this.formCtrl.value);
  }

}
