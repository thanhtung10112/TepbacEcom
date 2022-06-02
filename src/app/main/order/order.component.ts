import { Component, OnInit, ViewChild } from "@angular/core";
import { OrderService } from "./order.service";
import { AlertService } from "../../services/alert.service";
import {
    MatTableDataSource,
    MatPaginator,
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
    PageEvent,
} from "@angular/material";
import { Order } from "app/model/order.model";
import { from } from "rxjs";
import { DetailComponent } from "./detail/detail.component";
import { fuseAnimations } from "@fuse/animations";
import { LoadingFlag } from "app/model/loading.model";
import { AuthService } from "app/services/auth.service";
@Component({
    selector: "app-order",
    templateUrl: "./order.component.html",
    styleUrls: ["./order.component.scss"],
    animations: fuseAnimations,
})
export class OrderComponent implements OnInit {
    public listOption = [
        {
            label: "Chưa Duyệt",
            meta_key: "order",
        },
        {
            label: "Đã Duyệt",
            meta_key: "confirm",
        },
        {
            label: "Đã Nhập Kho",
            meta_key: "ready",
        },
        {
            label: "Đang Giao",
            meta_key: "shipping",
        },
        {
            label: "Đã Giao",
            meta_key: "done",
        },
        {
            label: "Đã Hủy",
            meta_key: "cancel",
        },
    ];
    page: number = 0;
    resultsLength = 0;
    dataSource = new MatTableDataSource<any>();
    public option: string = "done";
    loading = new LoadingFlag();
    constructor(
        private orderService: OrderService,
        private alertService: AlertService,
        private dialog: MatDialog,
        public dataAuthService: AuthService
    ) {}
    public displayedColumns: string[] = [
        "id",
        "add_time",
        "total",
        "ship",
        "detail",
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.getListOrder();
    }

    dataHotlineEmail = this.dataAuthService.dataHotline;
    selectOption(meta_key) {
        this.option = meta_key;
        this.page = 0;
        this.getListOrder();
    }

    openDetailrOder(item) {
        const dialogRef = this.dialog.open(DetailComponent, {
            width: "600px",
            data: item,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("close");
        });
    }
    getListOrder() {
        this.loading.setPending(false);
        this.orderService.list(this.page, this.option).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.loading.setResult(true);
                    this.dataSource = new MatTableDataSource<any>(
                        res.data.list
                    );
                    //this.dataSource.paginator = this.paginator;
                    this.resultsLength = res.data.numRows;
                } else {
                    this.loading.setResult(false);
                    this.alertService.error(res.error.message);
                    this.dataSource = new MatTableDataSource<any>();
                }
            },
            (error) => {
                this.loading.setResult(false);
                this.alertService.error("Lỗi kết nối tới máy chủ");
            }
        );
    }
    onPage(event: PageEvent) {
        this.page = event.pageIndex;
        this.getListOrder();
    }
}
