import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UtilitiesService} from '../utilities.service';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-po-status',
  templateUrl: './po-status.component.html',
  styleUrls: ['./po-status.component.css']
})
export class PoStatusComponent implements OnInit {
  
  startDate:Date;
  endDate:Date;
  orderType:any;
  code:any;
  options:any;
  isIssuedContract:boolean;
  isReceivedContract:boolean;
  poType:any;
  displaybox:boolean;
  statusTableData:any;
  showDateError:boolean;
  headerArray: any;
  loader: boolean;
  newstatsuTableData: any;
  showPoStatus:boolean;
  showStatusTable:boolean;
  username:any;
  generalInfo:any;
  ar:any;
  name:any;
  listMenu:any;
  group:any;
  showHome:boolean;

  constructor(private dataservice: DataService,private utilities: UtilitiesService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    
    this.username = this.dataservice.getUserName();

    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.username = this.dataservice.getUserName();
    this.ar = this.dataservice.getListMenu();
    this.name = this.ar[this.ar.length - 1];

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
  this.showPoStatus = true;
  this.getPOstatus();
  this.listMenu = this.dataservice.getListMenu();

  this.group = this.listMenu[this.listMenu.length - 2];

  if(this.group.length > 1){
    this.showHome = true;
  }
  }

  getPOstatus() {
 

  

    this.dataservice.getPurchaseOrderType().subscribe(data => {
      if (data) {
        this.orderType = data;
        this.code = data[1].code;//default code STD
      }
    });
    this.dataservice.getEventDescription().subscribe(data => {
      this.options = data;
    })
  }
  getIssuedContract() {
    this.isIssuedContract = true;
  }
  getReceivedContract() {
    this.isReceivedContract = true;
  }
  poStatus() {
    if (this.poType == "PO Received From FMHACA") {
      this.displaybox = true;
    } else {
      this.isReceivedContract = false;
      this.isIssuedContract = false;
      this.displaybox = false;
    }
  }
  public getCode(d) {
    var poCode = this.orderType.filter(function (obj) {
      return obj.name.includes(d);
    });
    return poCode[0]['code'];
  }
  public getPoType(d) {
    var poType = this.options.filter(function (obj) {
      return obj.name.includes(d);
    });
    return poType[0]['code'];
  }
  public getPoStatusForPreag() {
  


    if ((this.startDate['year'] > this.endDate['year']) || (this.startDate['year'] == this.endDate['year'] && this.startDate['month'] > this.endDate['month']) || (this.startDate['year'] == this.endDate['year'] && this.startDate['month'] == this.endDate['month'] && this.startDate['day'] > this.endDate['day'])) {
      this.showDateError = true;
    }
    else {
      this.showDateError = false;
    }

    if (!this.showDateError) {
      this.statusTableData = []; 
      this.headerArray = [];
      this.loader = true;
      this.showStatusTable = false;
      this.dataservice.getPragPoStatusReport(this.getPoType(this.poType), this.dataservice.dateFormatWithHyphen(this.startDate), this.dataservice.dateFormatWithHyphen(this.endDate), this.getCode(this.code), this.isIssuedContract, this.isReceivedContract).subscribe(data => {
        if (data) {
          this.loader = false;
          this.statusTableData = data;
          this.showStatusTable = true;
          for (var i = 0; i < this.statusTableData.length; i++) {
            for (var p in this.statusTableData[0]) {
              this.statusTableData[i][p] = this.dataservice.ifdate(this.statusTableData[i][p]);
            }
          }
          if (this.statusTableData.length < 1) {
            this.loader = false;
          }
          else {
            this.loader = false;
        
          }
          for (var property in this.statusTableData[0]) {
            if (this.statusTableData[0].hasOwnProperty(property)) {
              //give a space before Capital letters
              // var myProp = this.dataservice.giveSpaceBeforeUppercaseLetters(property);
              this.headerArray.push([property]);
            }
          }
        }
        this.newstatsuTableData = this.statusTableData;
      });
    }
  }
  searchPoStatus(value: string) {
    if (value) {
      var newPurchaseList = this.newstatsuTableData.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.TenderNumber.toLowerCase().includes(value) || obj.Supplier.toLowerCase().includes(value) || obj.ResponsiblePerson.toLowerCase().includes(value);
      });
      this.statusTableData = newPurchaseList;
    }
    if (value === "") {
      this.statusTableData = this.newstatsuTableData;
    }
  }

  

  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
