import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Event } from './field';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private router: Router) {}
  private apiUrl = 'http://192.168.2.175:5023/api/';
  private apiUrlLocal = 'http://192.168.2.194:8068/api';
  private docUrl =
    'https://getdocument.herokuapp.com/api/containers/container/';
  public listMenu: any;
  public ourListMenu: any;
  purchaseOrderType: any;
  cond: boolean;
  param: any;
  message: String;
  currentEvent: any;

  // menucode and selected pos data communication
  private poId = new BehaviorSubject<string[]>([]);
  updateId = this.poId.asObservable();

  private invoiceId = new BehaviorSubject<string[]>([]);
  updateInvoicePo = this.invoiceId.asObservable();

  private messageSource = new BehaviorSubject<object[]>([]);
  currentMessage = this.messageSource.asObservable();

  private eventMenuPass = new BehaviorSubject('Default');
  menuCode = this.eventMenuPass.asObservable();
  //
  private event = new BehaviorSubject<Event[]>([]);
  updateEvent = this.event.asObservable();
  //

  private poInvoice = new BehaviorSubject<object[]>([]);
  currentPoInvoice = this.poInvoice.asObservable();

  private poList = new BehaviorSubject<object[]>([]);
  currentPoList = this.poList.asObservable();

  private invoiceList = new BehaviorSubject<object[]>([]);
  currentInvoiceList = this.invoiceList.asObservable();

  changInvoiceList(invoiceList: object[]) {
    this.invoiceList.next(invoiceList);
  }

  changPoList(poList: object[]) {
    this.poList.next(poList);
  }

  changePoInvoice(invoice: object[], invoiceId: string[]) {
    this.poInvoice.next(invoice);
    this.invoiceId.next(invoiceId);
  }

  changeEvent(event: Event[]) {
    this.event.next(event);
  }

  changeMessage(pos: object[], eventmenucode: string, poId: string[]) {
    this.poId.next(poId);
    this.messageSource.next(pos);
    this.eventMenuPass.next(eventmenucode);
  }

  login(username: string, password: string): Observable<any> {
    var response = this.http.post(this.apiUrl + 'Users/Login', {
      username,
      password,
    });
    response.subscribe(
      (data) => {},
      (error) => {}
    );
    this.setSession(response);
    return response;
  }

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  getPurchaseOrderType() {
    // to be called inside sidebar components
    return this.http.get(this.apiUrl + 'Lookups/PurchaseOrderTypes');
  }

  getPurchaseOrderList(
    eventMenuCode: string,
    purchaseOrderType: string,
    pageSize: number,
    lastRecord: number
  ) {
    // for prag, poag, shp
    return this.http.get(
      this.apiUrl +
        'PurchaseOrders?eventMenuCode=' +
        eventMenuCode +
        '&purchaseOrderType=' +
        purchaseOrderType +
        '&pageSize=' +
        pageSize +
        '&lastRecord=' +
        lastRecord
    );
  }

  getListMenu() {
    this.sleep(1000);
    this.ourListMenu = JSON.parse(localStorage['listMenu']);
    return this.ourListMenu;
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('listMenu');
  }

  public isLoggedIn() {
    return !this.isExpired;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private setSession(authResult) {
    localStorage.setItem(
      'id_token',
      String(Math.floor(Math.random() * 1553000413837 + 1))
    );
    // const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('expires_at', this.setExpiration());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(
        ` Backend returned code ${error.status},` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error.status);
  }

  isExpired() {
    let expiresAt = parseInt(localStorage.getItem('expires_at'));
    const now = new Date();
    if (!(expiresAt / 3600000 < now.getTime() / 3600000)) {
      expiresAt = expiresAt / 3600000 + 3600000;
      return false;
    } else {
      return expiresAt / 3600000 < now.getTime() / 3600000;
    }
  }

  setExpiration() {
    const expiry = new Date();
    const sessionExpire = expiry.getTime() + 3600000;
    return String(sessionExpire);
  }

  public isAuthenticated(): boolean {
    if (localStorage['id_token'] != null && !this.isExpired()) {
      return true;
    }
    return false;
  }
  getSearchResult(
    purchaseOrderNumber: string,
    purchaseOrderType: string,
    eventMenuCode: string
  ) {
    return this.http
      .get(
        this.apiUrl +
          'Searchs/PurchaseOrders?purchaseOrderNumber=' +
          purchaseOrderNumber +
          '&purchaseOrderType=' +
          purchaseOrderType +
          '&eventMenuCode=' +
          eventMenuCode
      )
      .pipe(catchError(this.handleError));
  }
  getGeneralInfo() {
    return this.http.get(this.apiUrl + 'GeneralInfo');
  }
  getPurchaseOrderEvents(purchaseOrderId: string[], eventMenuCode: string) {
    var ids = '';
    for (var i = 0; i < purchaseOrderId.length; i++) {
      for (var j = 0; j < purchaseOrderId[i].length; j++) {
        if (i != 0) {
          ids += '&';
        }
        ids += 'purchaseOrderIds=' + purchaseOrderId[i][j];
      }
    }
    return this.http.get(
      this.apiUrl +
        'Events/PurchaseOrder?' +
        ids +
        '&eventMenuCode=' +
        eventMenuCode
    );
  }
  saveEvent(finalData) {
    return this.http.post(this.apiUrl + 'Events/PurchaseOrder', finalData);
  }

  getPurchaseOrderDetails(purchaseOrderId: string) {
    const response = this.http.get(
      this.apiUrl +
        'PurchaseOrders/' +
        purchaseOrderId +
        '/PurchaseOrderDetails'
    );
    response.subscribe(
      (data) => {},
      (error) => {
        console.log(error);
      }
    );
    return response;
  }

  getLetterFields(id: number, purchaseOrderId: string) {
    return this.http.get(
      this.apiUrl +
        'Letters/Fields?eventDescriptionId=' +
        id +
        '&purchaseOrderId=' +
        purchaseOrderId
    );
  }

  generateLetter(finalFields: Object) {
    return this.http.post(this.apiUrl + 'Letters/PurchaseOrder', finalFields, {
      responseType: 'arraybuffer',
    });
  }

  getUserID() {
    const id = JSON.parse(localStorage.getItem('listMenu'));
    return id[id.length - 3];
  }

  getUserName() {
    const string = JSON.parse(localStorage.getItem('listMenu'));
    return string[string.length - 1];
  }

  uploadToStorageSite(fileName) {
    return this.http.post(this.docUrl + 'upload/', fileName);
  }

  deleteFromStorageSite(fileName: string) {
    return this.http.delete(this.docUrl + 'files/' + fileName + 'Letter.docx');
  }

  getBankNames() {
    return this.http.get(this.apiUrl + 'Lookups/BankNames');
  }

  getInvoiceList(poID) {
    return this.http.get(this.apiUrl + 'Invoices?purchaseOrderId=' + poID);
  }
  getInvoiceEvent(selectedPoInvoiceId: string[]) {
    let ids = '';
    for (let i = 0; i < selectedPoInvoiceId.length; i++) {
      if (i !== 0) {
        ids += '&';
      }
      ids += 'invoiceIds=' + selectedPoInvoiceId[i];
    }
    return this.http.get(this.apiUrl + 'Events/Invoice?' + ids);
  }

  getPurchaseOrderDetailsShipment(selectedPoInvoiceId: string) {
    const response = this.http.get(
      this.apiUrl + 'Invoices/' + selectedPoInvoiceId + '/InvoiceDetails'
    );
    response.subscribe(
      (data) => {},
      (error) => {}
    );
    return response;
  }

  giveSpaceBeforeUppercaseLetters(value: any) {
    // starts from the second char in the value upt n-1
    var str;
    var myProp = '' + value;
    for (var j = 1; j < myProp.length; j++) {
      if (myProp[j] === myProp[j].toUpperCase()) {
        str = myProp.replace(myProp[j], ' ' + myProp[j]);
      }
    }
    return str;
  }

  ifdate(isDate: any) {
    if (typeof isDate === 'string') {
      var piped = new Date(isDate);
      if (!isNaN(piped.getTime()) && piped.getDate() > 1) {
        return piped
          .toDateString()
          .replace(piped.toDateString().substring(0, 3), '');
      } else {
        return isDate;
      }
    } else {
      return isDate;
    }
  }

  dateFormatWithHyphen(model) {
    if (model != undefined && typeof model != 'string') {
      var eventDay = model.day;
      if (eventDay < 10) {
        eventDay = '0' + eventDay;
      }
      var eventMonth = model.month;
      if (eventMonth < 10) {
        eventMonth = '0' + eventMonth;
      }
      var eventYear = model.year;
      return eventYear + '-' + eventMonth + '-' + eventDay;
    } else if (typeof model === 'string' && model.length > 10) {
      return model.substring(0, 10);
    } else if (typeof model === 'string' && model.length === 10) {
      return model;
    } else if (model === undefined) {
      return '';
    } else {
      return '';
    }
  }

  saveEventShipment(finalData) {
    return this.http.post(this.apiUrl + 'Events/Invoice', finalData);
  }

  generateLetterShipment(finalFields: Object) {
    return this.http.post(this.apiUrl + 'Letters/Invoice', finalFields, {
      responseType: 'arraybuffer',
    });
  }

  getPOstatus() {
    return this.http.get(
      this.apiUrl +
        'Reports/PreAgreementLeadTimeReport?purchaseOrderTypeCode=std'
    );
  }

  getEventDescription() {
    return this.http.get(this.apiUrl + 'Lookups/PreAgreementEventDescriptions');
  }

  getPerformanceBondReport() {
    return this.http.get(this.apiUrl + 'Reports/PerformanceBondReport');
  }

  getBankandInsurance(cad) {
    return this.http.get(
      this.apiUrl + 'Reports/BankAndInsuranceReport?isCad=' + cad
    );
  }

  changePo(pos: object[]) {
    this.messageSource.next(pos);
  }

  getPragPoStatusReport(
    eventCode: string,
    startDate: string,
    endDate: string,
    purchaseOrderTypeCode: string,
    isIssuedContract: boolean,
    isReceivedContract: boolean
  ) {
    return this.http.get(
      this.apiUrl +
        'Reports/PreAgreementStatusReport?eventCode=' +
        eventCode +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate +
        '&purchaseOrderTypeCode=' +
        purchaseOrderTypeCode +
        '&isIssuedContract=' +
        isIssuedContract +
        '&isReceivedContract=' +
        isReceivedContract
    );
  }

  getIssueContract(
    startDateIssueContract: string,
    endDateIssueContract: string
  ) {
    return this.http.get(
      this.apiUrl +
        'Reports/GetIssueContractReport?startDate=' +
        startDateIssueContract +
        '&endDate=' +
        endDateIssueContract
    );
  }

  // GetShipmentStatusReport?lastRecord=0&pageSize=100
  getShipmentReport(lastRecord: Number, pageSize: Number) {
    return this.http.get(
      this.apiUrl +
        'Reports/GetShipmentStatusReport?lastRecord=' +
        lastRecord +
        '&pageSize=' +
        pageSize
    );
  }

  getClearedReport(lastRecord: Number, pageSize: Number) {
    return this.http.get(
      this.apiUrl +
        'Reports/GetClearedPoReport?lastRecord=' +
        lastRecord +
        '&pageSize=' +
        pageSize
    );
  }

  getItemSummary(searchKey: String, mode: String) {
    return this.http.get(
      this.apiUrl +
        'Reports/GetItemStatusSummaryReport?itemNameSearchKey=' +
        searchKey +
        '&mode=' +
        mode
    );
  }

  getAccountModes() {
    return this.http.get(this.apiUrl + 'Lookups/AccountModes');
  }

  errorCode(statusCode: Number) {
    if (statusCode === 404) {
      // this.message = 'Given username ' + username + ' does not exist.';
    } else if (statusCode === 500) {
      this.message = 'There is a Network Error. Please Try Again.';
    } else if (statusCode === 401) {
      this.message = 'Incorrect Password or Username';
    } else {
      this.message = 'Please Try Again';
    }
    return this.message;
  }

  setCurrentEvent(event: object) {
    this.currentEvent = event;
  }

  getCurrentEvent(): object[] {
    return this.currentEvent;
  }

  returnPreAgreement(purchaseOrderId: string[]) {
    var ids = '';
    for (var i = 0; i < purchaseOrderId.length; i++) {
      for (var j = 0; j < purchaseOrderId[i].length; j++) {
        if (i != 0) {
          ids += '&';
        }
        ids += 'purchaseOrderIds=' + purchaseOrderId[i][j];
      }
    }
    return this.http.get(this.apiUrl + 'Events/ReturnPreAgreement?' + ids);
  }
}
