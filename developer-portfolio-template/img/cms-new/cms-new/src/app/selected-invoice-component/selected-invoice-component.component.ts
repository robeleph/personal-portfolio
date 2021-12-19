import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-selected-invoice-component',
  templateUrl: './selected-invoice-component.component.html',
  styleUrls: ['./selected-invoice-component.component.css']
})
export class SelectedInvoiceComponentComponent implements OnInit {


  purchaseOrderID: string[];

  timerId;

  checker: number = 0; // check whether purchaseOrderID[] is not null

  selectedPoInvoice: Object[] = [];

  invoiceNumber: string;

  selectedPo: Object[] = [];

  invoiceList;

  selectedPoInvoiceId: string[] = [];
  displayPo: object[];
  loader: boolean = false;

  constructor(private dataservice: DataService, private toastr: ToastrService, private sanitizer: DomSanitizer) { }


  ngOnInit() {
    

    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(message => this.displayPo = message);
    this.dataservice.currentPoInvoice.subscribe(message => this.selectedPoInvoice = message);
    this.dataservice.updateInvoicePo.subscribe(message => this.selectedPoInvoiceId = message);
    this.dataservice.currentInvoiceList.subscribe(message =>this.invoiceList = message);


    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    this.timerId = setInterval(() => this.parseInvoiceList(), 1000)
  }
  parseInvoiceList() {
    var i = this.purchaseOrderID.length;
    if (this.purchaseOrderID.length && (i != this.checker)) {
      this.loader = true;
      if (this.purchaseOrderID.includes('checker')) { this.purchaseOrderID.pop(); }
      this.dataservice.getInvoiceList(Number(this.purchaseOrderID[this.purchaseOrderID.length - 1])).subscribe(data => {
        this.loader = false;
        this.invoiceList = data;
        // console.log(this.invoiceList)
        this.selectedPoInvoiceId = [];
      });
    }
    if(this.purchaseOrderID.length == 0){
      this.invoiceList = [];

    }
    this.checker = i;

    // this.dataservice.changePo(this.displayPo);
    // if (this.displayPo.length) {
    //   this.displayPo = [this.displayPo[this.displayPo.length - 1]];
    //   this.dataservice.changePo(this.displayPo);
    // }
  }


  selectInvoicePo(e2, poInvoice) {
    if (e2.target.checked) {
      //call the event details api based on these arrays
      // this.selectedPoInvoice = []
      this.selectedPoInvoice.push(poInvoice);
      this.selectedPoInvoiceId.push(this.getIdFromPurchaseList(poInvoice['invoiceNumber']));
    }
    if (!e2.target.checked) {
      var index = this.selectedPoInvoice.indexOf(poInvoice);
      if (index > -1) {
        this.selectedPoInvoice.splice(index, 1);
        this.selectedPoInvoiceId.splice(index, 1);
      }
    }
    this.dataservice.changePoInvoice(this.selectedPoInvoice, this.selectedPoInvoiceId);

  }


  getIdFromPurchaseList(po) {
    var newPurchaseList = this.invoiceList.filter(function (obj) {
      return obj.invoiceNumber.includes(po);
    });
    this.selectedPo.push(newPurchaseList[0]);
    var officersIds = newPurchaseList.map(function (officer) {
      return String(officer.id)
    });
    return (officersIds);
  }


}