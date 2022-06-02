import { Component, OnInit, ViewChild } from "@angular/core";
import {
    MatDialog,
    MatDialogRef,
    MatPaginator,
    MatTableDataSource,
    PageEvent,
} from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
import { AlertService } from "app/services/alert.service";
import { AuthService } from "app/services/auth.service";
import { AnswerComponent } from "./answer/answer.component";
import { DetailComponent } from "./detail/detail.component";
import { RateService } from "./rate.service";

@Component({
    selector: "app-rate",
    templateUrl: "./rate.component.html",
    styleUrls: ["./rate.component.scss"],
    animations: fuseAnimations,
})
export class RateComponent implements OnInit {
    page: number = 0;
    resultsLength = 0;
    product_id = 0;
    dataSource = new MatTableDataSource<any>();
    public displayedColumns: string[] = [
        "id",
        "name_product",
        "add_time",
        "rating",
        "content",
        "detail",
        "anwser",
    ];
    public loadingFlag = new LoadingFlag();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        private rateService: RateService,
        private alertService: AlertService,
        public dialog: MatDialog,
        public dataAuthService: AuthService
    ) {}
    dataHotlineEmail = this.dataAuthService.dataHotline;
    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.getList();
    }
    getList() {
        this.loadingFlag.setPending(true);
        this.rateService.getList(this.page).subscribe(
            (res) => {
                if ((res.status = "success")) {
                    this.loadingFlag.setResult(true);
                    this.dataSource = new MatTableDataSource<any>(
                        res.data.list
                    );
                    this.resultsLength = res.data.numRows;
                } else {
                    this.loadingFlag.setResult(false);
                    this.alertService.error(res.error.message);
                    this.dataSource = new MatTableDataSource<any>();
                }
            },
            (error) => {
                this.loadingFlag.setResult(false);
                this.alertService.error("Lỗi kết nối tới máy chủ");
            }
        );
    }
    onPage(event: PageEvent) {
        this.page = event.pageIndex;
        this.getList();
    }
    openAnswer(item) {
        const dialogRef = this.dialog.open(AnswerComponent, {
            width: "600px",
            data: item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("close");
        });
    }
    openDetail(item) {
        const dialogRef = this.dialog.open(DetailComponent, {
            width: "600px",
            data: item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("close");
        });
    }
}
