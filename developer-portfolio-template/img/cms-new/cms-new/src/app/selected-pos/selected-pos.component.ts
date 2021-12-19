import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-pos',
  templateUrl: './selected-pos.component.html',
  styleUrls: ['./selected-pos.component.css']
})
export class SelectedPosComponent implements OnInit {
  displayPo: object[];
  menu: string;
  poId: string[];
  param: any;
  invoice: boolean = false;
  selectedPoInvoice: object[];
  selectedPoInvoiceId: string[] = [];
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.param = this.router.url;//read current url for eventMenucode 
    if (this.param == "/Shipment") {
      this.invoice = true;
    }
    if(this.dataService.isExpired()) {
      this.dataService.logout();
    }
    this.dataService.currentMessage.subscribe(message => this.displayPo = message);
    this.dataService.menuCode.subscribe(message => this.menu = message);
    this.dataService.updateId.subscribe(message => this.poId = message);
    this.dataService.currentPoInvoice.subscribe(message => this.selectedPoInvoice = message);
    this.dataService.updateInvoicePo.subscribe(message => this.selectedPoInvoiceId = message);

  }

  close(po) {
    if (!this.invoice) {
      let checkBox: HTMLElement = document.getElementById(po.purchaseOrderNumber) as HTMLElement;
      var index = this.displayPo.indexOf(po);
      if (index > -1) {
        this.displayPo.splice(index, 1);
        this.poId.splice(index, 1);
      }
      checkBox.click();
      this.dataService.changeMessage(this.displayPo, this.menu, this.poId);
    } else {
      let checkBoxInvoice: HTMLElement = document.getElementById(po.invoiceNumber) as HTMLElement;
      var index = this.selectedPoInvoice.indexOf(po);
      if (index > -1) {
        this.selectedPoInvoice.splice(index, 1);
        this.selectedPoInvoiceId.splice(index, 1);
            

      }
      checkBoxInvoice.click();
      this.dataService.changePoInvoice(this.selectedPoInvoice, this.selectedPoInvoiceId);
    }
  }
}