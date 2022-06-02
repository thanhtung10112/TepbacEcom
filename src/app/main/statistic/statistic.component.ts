import { Component, OnInit, ViewChild } from "@angular/core";
import { AlertService } from "app/services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { StatisticService } from "./statistic.service";
import { ChartComponent } from "angular2-chartjs";
import { Chart } from "chart.js";
import { LoadingFlag } from "app/model/loading.model";
import { ShopService } from "../shop/shop.service";
import { ProductService } from "../product/product.service";
import { AuthService } from "app/services/auth.service";

@Component({
    selector: "app-statistic",
    templateUrl: "./statistic.component.html",
    styleUrls: ["./statistic.component.scss"],
    animations: fuseAnimations,
})
export class StatisticComponent implements OnInit {
    typeSelected: any = "";
    types: any = [
        {
            label: "Theo Ngày",
            action: "day",
        },
        {
            label: "Theo Tháng",
            action: "month",
        },
        {
            label: "Theo Năm",
            action: "year",
        },
    ];
    cOrderDataset: any = [];
    input_data_order: any;
    input_label_order: any;
    listShop: any = [];
    loading = new LoadingFlag();
    lineChartOrderDay: any;
    lineChartOrderMonth: any;
    lineChartOrderYear: any;

    show: string = "day";
    chartOptionDay: any = {};
    chartOptionMonth: any = {};
    chartOptionYear: any = {};

    @ViewChild("chartOrderDay") public chartOrderDay: Chart;
    @ViewChild("chartOrderMonth") public chartOrderMonth: Chart;
    @ViewChild("chartOrderYear") public chartOrderYear: Chart;
    constructor(
        public alertService: AlertService,
        public statisticService: StatisticService,
        public productService: ProductService,
        public dataAuthService: AuthService
    ) {}

    dataHotlineEmail = this.dataAuthService.dataHotline;

    ngOnInit() {
        this.getListShop();
        this.getData("");
    }
    statisticByShop(shop_id) {
        this.getData(shop_id);
    }
    getListShop() {
        this.productService.getListShop().subscribe(
            (res) => {
                if (res.status == "success") {
                    this.listShop = res.data;
                } else {
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.alertService.error("Lỗi kết nối");
            }
        );
    }

    getData(shop_id) {
        this.loading.setPending(true);
        this.statisticService.getData(shop_id).subscribe(
            (res) => {
                if (res.status == "success") {
                    this.input_data_order = [];
                    this.input_label_order = [];
                    ["day", "month", "year"].forEach((key) => {
                        let input_data = {
                            order: [],
                            product: [],
                        };
                        let input_label = [];
                        res.data[key].forEach((element) => {
                            input_label.push(element.order_day);
                            input_data.order.push(element.num_order);
                            input_data.product.push(element.num_product);
                        });
                        this.input_data_order[key] = input_data;
                        this.input_label_order[key] = input_label;
                    });

                    if (this.lineChartOrderDay) {
                        this.lineChartOrderDay.destroy();
                    }
                    if (this.lineChartOrderMonth) {
                        this.lineChartOrderMonth.destroy();
                    }
                    if (this.lineChartOrderYear) {
                        this.lineChartOrderYear.destroy();
                    }
                    this.initChartOrder();
                    this.loading.setResult(true);
                } else {
                    this.loading.setResult(false);
                    this.alertService.error(res.error.message);
                }
            },
            () => {
                this.loading.setResult(false);
                this.alertService.error("Lỗi kết nối");
            }
        );
    }

    initChartOrder() {
        // Echart Of day
        this.chartOptionDay = {
            color: ["#14499e", "#60d147"],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {
                itemStyle: {
                    borderWidth: 2,
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: this.input_label_order["day"],
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
            },
            series: [
                {
                    name: "Số Đơn",
                    type: "bar",
                    data: this.input_data_order["day"].order,
                },
                {
                    name: "Số Sản Phẩm",
                    type: "bar",
                    data: this.input_data_order["day"].product,
                },
            ],
        };

        // Echart of Month
        this.chartOptionMonth = {
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
            xAxis: {
                type: "category",
                data: this.input_label_order["month"],
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
            },
            series: [
                {
                    name: "Số Đơn",
                    type: "bar",
                    data: this.input_data_order["month"].order,
                },
                {
                    name: "Số Sản Phẩm",
                    type: "bar",
                    data: this.input_data_order["month"].product,
                },
            ],
        };

        // Echart of Year
        this.chartOptionYear = {
            color: ["#4cabce", "#e5323e"],
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
            xAxis: {
                type: "category",
                data: this.input_label_order["year"],
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
            },
            series: [
                {
                    name: "Số Đơn",
                    type: "bar",
                    data: this.input_data_order["year"].order,
                },
                {
                    name: "Số Sản Phẩm",
                    type: "bar",
                    data: this.input_data_order["year"].product,
                },
            ],
        };
    }

    chooseType(item) {
        this.typeSelected = item;
        this.getData(item.action);
    }

    showHiden(value) {
        this.show = value;
    }
}
