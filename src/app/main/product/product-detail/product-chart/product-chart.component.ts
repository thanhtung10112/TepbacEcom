import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { LoadingFlag } from "app/model/loading.model";
import { AlertService } from "app/services/alert.service";
import { EChartsOption } from "echarts";
import { ProductService } from "../../product.service";

@Component({
    selector: "app-product-chart",
    templateUrl: "./product-chart.component.html",
    styleUrls: ["./product-chart.component.scss"],
})
export class ProductChartComponent implements OnInit {
    chartProduct: any = {};
    loading = new LoadingFlag();
    TrackingOrderQuantitys: any;
    TrackingOrderDay: any;
    constructor(
        public dialogRef: MatDialogRef<ProductChartComponent>,
        public productService: ProductService,
        @Inject(MAT_DIALOG_DATA) public dataChart: any,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        const data = this.dataChart;
        this.getData(data);
    }

    getData(data) {
        this.loading.setPending(true);
        this.productService
            .getChartTracking(data)
            .pipe()
            .subscribe(
                (res) => {
                    if ((res.status = "success")) {
                        const DataTrackingOrder = res.data;
                        let quantitys = [];
                        let days = [];
                        DataTrackingOrder.forEach((element) => {
                            quantitys.push(element.quantity);
                            days.push(element.day);
                        });
                        this.TrackingOrderQuantitys = quantitys;
                        this.TrackingOrderDay = days;
                        this.initChartDay();
                        this.loading.setResult(true);
                    } else {
                        this.alertService.error(res.error.message);
                        this.loading.setResult(false);
                    }
                },
                (error) => {
                    this.alertService.error("Lỗi kết nối");
                    this.loading.setResult(false);
                }
            );
    }

    initChartDay() {
        this.chartProduct = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {},
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: this.TrackingOrderDay,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "số lượng đặt hàng",
                    type: "bar",
                    barWidth: "60%",
                    data: this.TrackingOrderQuantitys,
                    color: "#2e7d32",
                },
            ],
        };
    }
}
