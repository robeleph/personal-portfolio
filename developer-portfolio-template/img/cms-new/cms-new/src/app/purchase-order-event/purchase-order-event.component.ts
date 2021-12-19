import { Component, OnInit, EventEmitter, Output, ApplicationRef, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LcExtensionComponent } from '../modals/lc-extension/lc-extension.component';
import { CadExtensionComponent } from '../modals/cad-extension/cad-extension.component';
import { LcOpenComponent } from '../modals/lc-open/lc-open.component';
import { ReleasePerformanceComponent } from '../modals/release-performance/release-performance.component'
import { Event } from '../field';



@Component({
  providers: [NavBarComponent, NgbModalConfig, NgbModal],
  selector: 'app-purchase-order-event',
  templateUrl: './purchase-order-event.component.html',
  styleUrls: ['./purchase-order-event.component.css'],

})
export class PurchaseOrderEventComponent implements OnInit {

  selectedPO: any;
  eventMenu: string;
  purchaseOrderID: string[];
  timerId;

  checker: number = 0; // check whether purchaseOrderID[] is not null
  isCAD: boolean = false;
  eventDay: any;
  eventMonth: any;
  eventYear: any;
  eventDate: any;
  message: String;
  message2: String;

  eventBeingEdited: string;
  model: any;
  model2: any;
  showLetterModal: boolean = false;
  lettername: string;
  letterNumber: string;
  performanceBondExpiryDate: string;
  bankName: string;
  cadNumber;
  latestShipmentDate;
  bankPermitNumber: string;
  firstCommonFields;
  listMenu: string[];
  userId: string;
  id: number;
  //lc and cad fields
  lcEventDate;
  lcNumber: string;
  lcOpeningDate;
  lcExpiryDate;
  lcCadNumber: string;
  cadExpiryDate;
  //


  event: Event[] = [];

  orderType: any;
  code: any;
  eventMenuCode: any;
  lastRecord = 0;
  pageSize = 50;
  purchaseList: any;

  bank;
  selectedPo: object[];
  addCadExtension: boolean = false;
  addLcExtension: boolean;
  loading: boolean = true;
  loadingT: boolean = true;
  RPBND: boolean = false;
  closeModal: boolean = false;
  showError: boolean = false;
  loadingSave: boolean = false;
  param: any;
  displayPo: object[];
  eventName: String;
  reset: boolean;


  @Output() eventClicked = new EventEmitter<Event>();


  constructor(private dataservice: DataService, private toastr: ToastrService, private router: Router,
    public navBar: NavBarComponent, private modalService: NgbModal, public appRef: ApplicationRef) { }

  ngOnInit() {
    this.param = this.router.url; // read current url for eventMenucode
    switch (this.param) {
      case "/Pre%20Agreement":
        this.eventMenuCode = "PRAG";
        this.eventName = "Pre Agreement";
        this.reset = true;
        break;
      case "/Post%20Agreement":
        this.eventMenuCode = "POAG"
        this.eventName = "Post Agreement";
        this.reset = false;
        break;
      case "/Shipment":
        this.eventMenuCode = "SHP";
        this.eventName = "Shipment";
        this.reset = false;
        break;
    }
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    // this.dataservice.currentPoList.subscribe(message => this.purchaseList = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);
    this.timerId = setInterval(() => this.parseTemplate(), 1000);
    this.dataservice.updateEvent.subscribe(message => this.event = message);
    this.dataservice.currentMessage.subscribe(message => this.displayPo = message);

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    this.userId = this.dataservice.getUserID(); this.dataservice.getBankNames().subscribe(data => {
      if (data) {
        this.bank = data;
      }
    });
  }

  parseTemplate() {
    var i = this.purchaseOrderID.length;
    if (this.purchaseOrderID.length && (i != this.checker)) {
      this.loadingT = true;
      this.showError = false;
      if (this.purchaseOrderID.includes('checker')) { this.purchaseOrderID.pop(); }
      this.dataservice.getPurchaseOrderEvents(this.purchaseOrderID, this.eventMenu).subscribe(data => {
        if (data) {
          this.loadingT = false;
          const lcOnlyCodes = ['LCNTFN', 'LCEXTN', 'LCAMDMT', 'LCAPP'];
          const cadOnlyCodes = ['CADEXTN', 'CADNTFN'];
          const cadAndLcOnly = 'LCOPCADRV';
          const currentTermOfPayment = localStorage.getItem('termOfPayment');
          const currentEvent = data['eventCategories'][0]['eventDescriptions'];
          const eventsOnTable: any[] = [];
          this.dataservice.changeEvent(currentEvent);
          for (i = 0; i < currentEvent.length; i++) {
            if (lcOnlyCodes.includes(currentEvent[i]['code']) && currentTermOfPayment === 'CAD') {
              continue;
            }
            if (cadOnlyCodes.includes(currentEvent[i]['code']) && currentTermOfPayment === 'LC') {
              continue;
            }
            if (cadAndLcOnly === currentEvent[i]['code'] && currentTermOfPayment === 'LC') {
              currentEvent[i]['name'] = 'LC Open';
            }
            if (cadAndLcOnly === currentEvent[i]['code'] && currentTermOfPayment === 'CAD') {
              currentEvent[i]['name'] = 'CAD Reserve';
            }

            this.letterNumber = currentEvent[i].letterNumber;
            this.performanceBondExpiryDate = currentEvent[i].performanceBondExpiryDate;
            this.bankName = currentEvent[i].bankName;
            this.cadNumber = currentEvent[i].cadNumber;
            this.cadExpiryDate = currentEvent[i].cadExpiryDate;
            this.lcNumber = currentEvent[i].lcNumber;
            this.lcExpiryDate = currentEvent[i].lcExpiryDate;
            this.lcOpeningDate = currentEvent[i].lcOpeningDate;
            this.latestShipmentDate = currentEvent[i].latestShipmentDate;
            this.bankPermitNumber = currentEvent[i].bankPermitNumber;
            eventsOnTable.push(currentEvent[i]);
          }
          this.selectedPO = eventsOnTable;
        }
      }, error => {
        this.message2 = this.dataservice.errorCode(error.status);
        this.showError = true;
        this.loadingT = false;
      });
    }
    this.checker = i;
  }

  ngOnDestroy() {
    this.selectedPO = [];
    this.purchaseOrderID = [];
    this.dataservice.changeMessage(this.selectedPO, this.eventMenu, this.purchaseOrderID);
    clearInterval(this.timerId);
  }

  editEvent(i) {
    this.dataservice.setCurrentEvent(i);
    this.id = i.id;
    this.letterNumber = i.letterNumber;
    this.lcEventDate = this.dataservice.dateFormatWithHyphen(i.eventDate);
    this.lcExpiryDate = i.lcExpiryDate;
    this.lcNumber = i.lcNumber;
    this.lcOpeningDate = i.lcOpeningDate;
    this.cadExpiryDate = i.cadExpiryDate;
    this.bankName = i.bankName;
    this.performanceBondExpiryDate = i.performanceBondExpiryDate;
    localStorage.setItem('eventId', i.id);

    if (i.code === "LCOPCADRV") {
      this.modalService.open(LcOpenComponent);
    } else if (i.code === "LCEXTN") {
      this.modalService.open(LcExtensionComponent);
    } else if (i.code === "RPBND") {
      this.modalService.open(ReleasePerformanceComponent);
    } else if (i.code === "CADEXTN") {
      this.modalService.open(CadExtensionComponent);
    } else {
      return this.eventBeingEdited = i.id;
    }
  }

  saveEvent(i) {
    this.listMenu = this.dataservice.getListMenu();
    this.lettername = i.name;
    this.letterNumber = i.letterNumber;
    if (!this.model) {
      this.message = "Date required";
    }
    if (this.model) {
      this.eventDay = this.model.day;
      if (this.eventDay < 10) {
        this.eventDay = "0" + this.eventDay;
      }
      this.eventMonth = this.model.month;
      if (this.eventMonth < 10) {
        this.eventMonth = "0" + this.eventMonth;
      }
      this.eventYear = this.model.year;
      this.eventDate = this.eventYear + '-' + this.eventMonth + '-' + this.eventDay;
      var finalData = {
        eventDescriptionId: i.id,
        letterNumber: this.letterNumber,
        eventDate: this.eventDate,
        userId: this.userId,
        purchaseOrderIds: this.purchaseOrderID.map(Number),
        isCad: null,
        // performanceBondExpiryDate: 'df',
        // bankName: 'df',
        // cadNumber: 'df',
        // cadExpiryDate: 'df',
        // lcNumber: 'df',
        // lcExpiryDate: 'df',
        // lcOpeningDate: 'df',
        // latestShipmentDate: 'df',
        // bankPermitNumber: 'df'
      };


      if (finalData) {
        this.loadingSave = true;
        this.dataservice.saveEvent(finalData).subscribe(data => {
          i.eventDate = data['eventDate']
          i.letterNumber = data['letterNumber'];
          this.cancelEvent(i);
          this.showSuccess();
          // this.purchaseList = this.poList;
          // this.dataservice.changPoList(this.purchaseList)
          this.dataservice.getPurchaseOrderType().subscribe(data => {
            if (data) {
              this.orderType = "STD";
              this.orderType = data;
              this.code = data[1].code; // def
            }
          });
          this.dataservice.getPurchaseOrderList(this.eventMenuCode, "STD", this.pageSize, this.lastRecord).subscribe(data => {
            this.purchaseList = data;
            this.dataservice.changPoList(this.purchaseList);
          }, error => {
            this.showFailure('Refresh Failed');
          });

        }, error => {
          this.showFailure('Saving Failed, Try again');
        });
      }
    }
  }




  cancelEvent(i) {
    return this.eventBeingEdited = null;
  }
  showSuccess() {
    this.toastr.success('Saved Successfully!', '');
  }
  showLoad() {
    this.toastr.info('Saving...', '');
  }


  showFailure(msg: string) {
    this.toastr.warning(msg, 'Please try again');
  }

  dateFormat(model) {
    if (model) {
      var eventDay = model.day;
      if (eventDay < 10) {
        eventDay = "0" + eventDay;
      }
      var eventMonth = model.month;
      if (eventMonth < 10) {
        eventMonth = "0" + eventMonth;
      }
      var eventYear = model.year;
      return eventDay + '/' + eventMonth + '/' + eventYear;
    } else { return ""; }
  }

  lcCad(event) {
    if (event.target.checked) {
      this.isCAD = true;
    } else {
      this.isCAD = false;
    }
  }
  lcExtension(event) {
    if (event.target.checked) {
      this.addLcExtension = true;
      this.isCAD = false;
    }
  }
  cadExtension(event) {
    if (event.target.checked) {
      this.addCadExtension = true;
      this.isCAD = null;
    }
  }
  saveEventUnique() {
    this.RPBND = true;
    var lcEventDate = this.dataservice.dateFormatWithHyphen(this.lcEventDate);
    var lcOpeningDate = this.dataservice.dateFormatWithHyphen(this.lcOpeningDate);
    var lcLatestShipmentDate = this.dataservice.dateFormatWithHyphen(this.latestShipmentDate);
    var lcExpiryDate = this.dataservice.dateFormatWithHyphen(this.lcExpiryDate);
    var cadExpiryDate = this.dataservice.dateFormatWithHyphen(this.cadExpiryDate);
    var performanceBondExpiryDate = this.dataservice.dateFormatWithHyphen(this.performanceBondExpiryDate);
    // if (!cadExpiryDate) { cadExpiryDate = ""; }
    // if (!lcExpiryDate || this.isCAD) { lcExpiryDate = ""; }
    // if (!lcLatestShipmentDate) { lcLatestShipmentDate = ""; }
    // if (!lcOpeningDate || this.isCAD) { lcOpeningDate = ""; }
    // if (!this.cadNumber) { this.cadNumber = ""; }
    // if (!this.bankPermitNumber) { this.bankPermitNumber = ""; }
    // if (!performanceBondExpiryDate) { performanceBondExpiryDate = null }
    for (var i = 0; i < this.selectedPo.length; i++) {
      if (this.selectedPo[i]['termOfPayment'] == "LC" && this.isCAD) {
        this.showFailure("Term of Payment should be of same type");
        this.RPBND = false;
        return;
      }
      if (this.selectedPo[i]['termOfPayment'] == "CAD" && !this.isCAD) {
        this.showFailure("Term of Payment should be of same type");
        this.RPBND = false;
        return;
      }
    }

    var finalData = {
      eventDescriptionId: this.id,
      letterNumber: this.letterNumber,
      eventDate: lcEventDate,
      userId: this.userId,
      isCad: this.isCAD,
      purchaseOrderIds: this.purchaseOrderID.map(Number),
      cadExpiryDate: cadExpiryDate,
      lcNumber: this.lcNumber,
      cadNumber: this.cadNumber,
      lcExpiryDate: lcExpiryDate,
      lcOpeningDate: lcOpeningDate,
      latestShipmentDate: lcLatestShipmentDate,
      bankPermitNumber: this.bankPermitNumber,
      bankName: this.bankName,
      performanceBondExpiryDate: performanceBondExpiryDate,
      addLcExtension: this.addLcExtension,
      addCadExtension: this.addCadExtension
    };

    if (finalData) {
      this.showLoad();
      this.dataservice.saveEvent(finalData).subscribe(data => {
        if (data) {
          this.RPBND = false;
          this.purchaseOrderID.push('checker');
          this.showSuccess();
          this.closeModal = true;
          if (this.closeModal) {
            let button: HTMLElement = document.getElementById('close') as HTMLElement;
            let button1: HTMLElement = document.getElementById('close1') as HTMLElement;
            let button2: HTMLElement = document.getElementById('close2') as HTMLElement;
            let button3: HTMLElement = document.getElementById('close3') as HTMLElement;
            button.click(); button1.click(); button3.click(); button2.click();
          }
        }
      }, error => {
        var n = error;
        this.RPBND = false;
        this.showFailure("There is a problem in the network ");
      });
    }
  }

  showModal(i) {
    this.event.push(i);
    this.dataservice.changeEvent(this.event);
    this.showLetterModal = true;
  }

  resetFailure() {
    this.toastr.error('Reset is not allowed for the selected Purchase Order');
  }

  resetSuccessful() {
    this.toastr.success('Reset Successful', '');
  }

  ReturnPOEvents() {
    this.dataservice.getPurchaseOrderEvents(this.purchaseOrderID, this.eventMenu).subscribe(data => {
      var event = data;
      var eventDescription = event['eventCategories'][0]['eventDescriptions'];
      for (var i = 0; i < eventDescription.length; i++) {
        var evt = eventDescription[i];
        if (evt.code == "DCMTTRFCNTMNGT") {
          if (evt.eventDate != null) {
            this.resetFailure();
          } else {
            this.dataservice.returnPreAgreement(this.purchaseOrderID).subscribe(data => {
              this.resetSuccessful();
            });
          }
        }
      }
    });

  }
}
