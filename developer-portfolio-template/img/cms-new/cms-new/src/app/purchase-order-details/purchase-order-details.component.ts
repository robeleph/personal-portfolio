import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  purchaseOrderDetails: any;
  eventMenu: string;
  purchaseOrderID: string[] = [];
  commonDetail: string[];
  checker: number = 0;
  disp: boolean = false; // check whether purchaseOrderID[] is not null
  purchaseOrderDetailID: string;
  interval;
  error: boolean = false;
  message2:String;

  constructor(private dataservice: DataService) { }
  ngOnInit() {
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);

    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    this.interval = setInterval(() => {
      if (this.purchaseOrderID.length > 0) {
        this.parseTemplate();
      } else {
        this.disp = false;
        this.error = false;
      }
    }, 1000);
  }

  parseTemplate() {
    if (this.purchaseOrderID.length > 0) {
      var i = this.purchaseOrderID.length;
      if (i != this.checker) {
        var j = this.purchaseOrderID[i - 1].length;
        this.purchaseOrderDetailID = this.purchaseOrderID[i - 1][j - 1];
        this.dataservice.getPurchaseOrderDetails(this.purchaseOrderDetailID).subscribe(data => {
          if (data && (Object.keys(data).length != 0)) {
            this.commonDetail = data[0];
            this.purchaseOrderDetails = data;
            this.error = false;
          }
        }, error => {
          this.error = true;
          this.message2 = this.dataservice.errorCode(error.status);
        });
      }
      this.checker = i;
      if (this.purchaseOrderDetails && !this.error) {
        this.disp = true;
      } else {
        this.disp = false;
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}