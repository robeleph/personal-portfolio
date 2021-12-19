import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import {UtilitiesService} from '../utilities.service';
import { saveAs } from 'file-saver'



@Component({
  selector: 'app-shipment-report',
  templateUrl: './shipment-report.component.html',
  styleUrls: ['./shipment-report.component.css']
})
export class ShipmentReportComponent implements OnInit {
  lastRecord = 0;
  pageSize = 100;

  loader:boolean;
  shipmentReport:any;
  newShipmentReport:any;
  load:boolean;
  username:string;
  generalInfo:any;
  ar:any;
  name:any;
  listMenu:any;
  showHome:boolean;
  group:any;

  constructor(private dataservice: DataService, private utilities: UtilitiesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loader = true;
    this.username = this.dataservice.getUserName();

    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.listMenu = this.dataservice.getListMenu();

    this.group = this.listMenu[this.listMenu.length - 2];

    if(this.group.length > 1){
      this.showHome = true;
    }
    this.username = this.dataservice.getUserName();
    this.ar = this.dataservice.getListMenu();
    this.name = this.ar[this.ar.length - 1];

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    this.getShipmentStatusReport();
    
  }

  getShipmentStatusReport() {
  


    this.dataservice.getShipmentReport(this.lastRecord, this.pageSize).subscribe(data => {
      if (data) {
        this.loader = false;
        this.shipmentReport = data;

      }
      this.newShipmentReport = this.shipmentReport;
    });

  }

  getSearchShipmentResult(value: String) {
    if (value) {
      var newPurchaseList = this.newShipmentReport.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.FundingSource.toLowerCase().includes(value) || obj.Supplier.toLowerCase().includes(value) || obj.FullItemName.toLowerCase().includes(value);
      });
      this.shipmentReport = newPurchaseList;
    }
    if (value === "") {
      this.shipmentReport = this.newShipmentReport;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 
    // console.log(event.target)
    // console.log(event.target.offsetHeight)
    // console.log(event.target.scrollTop)
    // console.log(event.target.scrollHeight)
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {

        this.load = true;
        this.dataservice.getShipmentReport(this.lastRecord, this.pageSize).subscribe(data => {
          if (data) {
            this.load = false;
            this.shipmentReport = data;
  
          }
          this.newShipmentReport = this.shipmentReport;
        });
        this.pageSize = this.pageSize + 50;


      // if(this.showClearedReport){
      //   this.load = true;
      //   this.dataservice.getClearedReport(this.lastRecord2, this.pageSize2).subscribe(data => {
      //     if (data) {
      //       this.load = false;
      //       this.shipmentReport = data;
  
      //       this.showShipmentTable = true;
      //     }
      //     this.newClearedReport = this.shipmentReport;
      //   });
      //   this.pageSize2 = this.pageSize2 + 50;
      // }


      }

    
  }
  

  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
