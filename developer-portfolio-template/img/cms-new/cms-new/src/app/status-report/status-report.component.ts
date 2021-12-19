import { Component, OnInit, EventEmitter, Output, ApplicationRef } from '@angular/core';

import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { PlatformLocation } from '@angular/common';
import { LocationStrategy } from '@angular/common';


import {BankAndInsuranceComponent} from '../bank-and-insurance/bank-and-insurance.component';
import {ClearedPOComponent} from '../cleared-po/cleared-po.component';
import {IssueContractComponent} from '../issue-contract/issue-contract.component';
import {ItemSummaryComponent} from '../item-summary/item-summary.component';
import {PerformanceBondComponent} from '../performance-bond/performance-bond.component';
import {ShipmentReportComponent} from '../shipment-report/shipment-report.component';
import {PoStatusComponent} from '../po-status/po-status.component';
import {PoLeadTimeComponent} from '../po-lead-time/po-lead-time.component';

@Component({
  providers: [StatusReportComponent, PoLeadTimeComponent,PoStatusComponent, BankAndInsuranceComponent, ClearedPOComponent, IssueContractComponent, ItemSummaryComponent, PerformanceBondComponent, ShipmentReportComponent],

  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.css']
})
export class StatusReportComponent implements OnInit {

  name: string;
  ar: any;
  generalInfo: string;
 
  username: any;
  group:any;
  showHome:boolean;
  showSelectMessage:boolean = true;
  listMenu:any;
  show:boolean = false;
  param:any;
  timerId:any;

  constructor(private dataservice: DataService, private router: Router, private route: ActivatedRoute, private locationStrategy: LocationStrategy)  { 
  }

  ngOnInit() {
    
    
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.listMenu = this.dataservice.getListMenu();
    // this.timerId = setInterval(() => this.check(), 1000);

    this.group = this.listMenu[this.listMenu.length - 2];

    this.username = this.dataservice.getUserName();
    this.ar = this.dataservice.getListMenu();
    this.name = this.ar[this.ar.length - 1];
    // this.showSelectMessage = true;

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    if(this.group.length > 1){
      this.showHome = true;
    }
 
  }
  
 
  logout(): void {
    this.dataservice.logout()
    //decide which user goes where depending on the eventMenus
    this.router.navigate(['login']);
    // console.log(this.listMenu);
  }
  
  
}
