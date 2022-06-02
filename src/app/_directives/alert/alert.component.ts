/****************************************************/
// Filename: aler.component.ts
// Created: Tran Duy Phong
// Change history:
// 29.06.2008 / Phong
//
/****************************************************/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
 
import { AlertService } from '../../services/alert.service';
import { Alert, AlertType } from '../../model/alert.model';
 
@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.scss']
})
 
export class AlertComponent {
    alerts: Alert[] = [];
 
    constructor(private alertService: AlertService) { }
 
    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }
 
            // add alert to array
            this.alerts.push(alert);
            
            // Auto remove alert
            setTimeout(() => {
                alert.hidden = true;
                console.log('run');
            }, 5000);
            setTimeout(() => this.removeAlert(alert), 8000);
        });
    }
 
    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }
 
    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
 
        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}