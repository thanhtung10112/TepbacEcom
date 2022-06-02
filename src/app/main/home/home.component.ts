import { Component, OnInit } from "@angular/core";
import { HomeService } from "./home.service";
import { AlertService } from "../../services/alert.service";
import { fuseAnimations } from "@fuse/animations";
import { from } from "rxjs";
import { LoadingFlag } from "app/model/loading.model";
import { EChartsOption } from "echarts";
import moment from "moment";
import { DateTimeAdapter } from "ng-pick-datetime";
import { AuthService } from "app/services/auth.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
    animations: fuseAnimations,
})
export class HomeComponent implements OnInit {
    public isRegister: boolean = true;
    public loading = new LoadingFlag();
    public data: any = {
        order: { cancel: 0, done: 0, not_confirm: 0, shipping: 0 },
        product: { buying: 3, buyed: 5, handling: 4, blocked: 0 },
        profit: { money: 0, quantity: 0, count_order: 0, count_comment: 0 },
    };
    public DataChart: [];
    chartOption: any = {};
    chartOptionShop: any = {};
    ChartProductTimes: any;
    ChartProductClick: any;
    ChartProductImpressions: any;
    ChartShopTimes: any;
    ChartShopClick: any;
    ChartShopImpressions: any;
    formatTime = moment();

    constructor(
        public homeService: HomeService,
        public dataAuthService: AuthService,
        private alertService: AlertService
    ) {}

    dataHotlineEmail = this.dataAuthService.dataHotline;

    ngOnInit() {
        this.getInfor();
        this.getData();
        this.getDataShopid();
    }
    numberWithCommas(x: number) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0";
    }
    getInfor() {
        this.loading.setPending(true);
        this.homeService.loadDashboard().subscribe(
            (res) => {
                if (res.status == "success") {
                    if (res.data.isCreated) {
                        this.isRegister = true;
                        this.data.order = res.data.order;
                        this.data.product = res.data.product;
                        this.data.profit = res.data.profit;
                        this.data.events = res.data.events;
                        this.loading.setResult(true);
                    } else {
                        this.alertService.warn("Bạn chưa đăng kí cửa hàng");
                        this.isRegister = false;
                        this.loading.setResult(false);
                    }
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

    checkEvent(item) {
        let current_time = new Date().getTime();
        if (item.start_time * 1000 <= current_time) {
            return "Đang diễn ra";
        } else {
            return "Sự kiện sắp tới";
        }
    }

    getData() {
        this.loading.setPending(true);
        this.homeService.getChart().subscribe(
            (res) => {
                if ((res.status = "success")) {
                    const DataChart = res.data;
                    let times = [];
                    let clicks = [];
                    let impressions = [];
                    DataChart.forEach((element) => {
                        times.push(moment(element.time * 1000).format("L"));
                        clicks.push(element.click);
                        impressions.push(element.impression);
                    });
                    this.ChartProductTimes = times;
                    this.ChartProductClick = clicks;
                    this.ChartProductImpressions = impressions;
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

    getDataShopid() {
        this.loading.setPending(true);
        this.homeService.getChartShopId().subscribe(
            (res) => {
                if ((res.status = "success")) {
                    const DataShopId = res.data;
                    let times = [];
                    let clicks = [];
                    let impressions = [];
                    DataShopId.forEach((element) => {
                        times.push(moment(element.time * 1000).format("L"));
                        clicks.push(element.click);
                        impressions.push(element.impression);
                    });
                    this.ChartShopTimes = times;
                    this.ChartShopClick = clicks;
                    this.ChartShopImpressions = impressions;
                    this.initChartShop();
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
        this.chartOption = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {},
            xAxis: [
                {
                    type: "category",
                    data: this.ChartProductTimes,
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "Click",
                    type: "bar",
                    data: this.ChartProductClick,
                    color: "#1565c0 ",
                },
                {
                    name: "Hiển thị",
                    type: "line",
                    data: this.ChartProductImpressions,
                    smooth: true,
                    lineStyle: {
                        width: 2,
                    },
                    color: "#f44336",
                },
            ],
        };
    }

    initChartShop() {
        this.chartOptionShop = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {},
            xAxis: [
                {
                    type: "category",
                    data: this.ChartShopTimes,
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "Click",
                    type: "bar",
                    data: this.ChartShopClick,
                    color: "#4caf50 ",
                },
                {
                    name: "Hiển thị",
                    type: "line",
                    data: this.ChartShopImpressions,
                    smooth: true,
                    lineStyle: {
                        width: 2,
                    },
                    color: "#f44336",
                },
            ],
        };
    }
}
