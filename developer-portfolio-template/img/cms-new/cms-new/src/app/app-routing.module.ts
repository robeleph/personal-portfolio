import { NgModule} from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';



import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SelectedPosComponent } from './selected-pos/selected-pos.component';
import { PurchaseOrderEventComponent } from './purchase-order-event/purchase-order-event.component';
//last six
import { PoStatusComponent } from './po-status/po-status.component';
import { PoLeadTimeComponent } from './po-lead-time/po-lead-time.component'; 
import { NavbarReportComponent } from './navbar-report/navbar-report.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';



//parents
import { PreagreementComponent } from './preagreement/preagreement.component';
import { PostagreementComponent } from './postagreement/postagreement.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { LoginComponent } from './login/login.component';

import { LetterModalComponent } from './letter-modal/letter-modal.component';
import { SelectedInvoiceComponentComponent } from './selected-invoice-component/selected-invoice-component.component';
import { InvoicePoEventComponent } from './invoice-po-event/invoice-po-event.component';
import { InvoicePoDetailComponent } from './invoice-po-detail/invoice-po-detail.component';
import {IssueContractComponent} from './issue-contract/issue-contract.component'
import{PerformanceBondComponent} from './performance-bond/performance-bond.component';
import{BankAndInsuranceComponent} from './bank-and-insurance/bank-and-insurance.component'
import {ShipmentReportComponent} from './shipment-report/shipment-report.component';
import {ClearedPOComponent} from './cleared-po/cleared-po.component';
import {ItemSummaryComponent} from './item-summary/item-summary.component';
import { HeaderComponent } from './header/header.component';
import { LcExtensionComponent } from './modals/lc-extension/lc-extension.component';
import { CadExtensionComponent } from './modals/cad-extension/cad-extension.component';
import { LcOpenComponent } from './modals/lc-open/lc-open.component';
import { ReleasePerformanceComponent } from './modals/release-performance/release-performance.component';




export let routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainMenuComponent,
  canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'Pre Agreement', component: PreagreementComponent,
  canActivate: [AuthGuard]},
  { path: 'Letter Modal', component: LetterModalComponent,
  canActivate: [AuthGuard]},
  { path: 'Post Agreement', component: PostagreementComponent,
  canActivate: [AuthGuard]},
  { path: 'Shipment', component: ShipmentComponent,
  canActivate: [AuthGuard]},


  { path: 'statusreport', component: StatusReportComponent,
  canActivate: [AuthGuard], children:[
    { path: 'poleadtime', component: PoLeadTimeComponent,
    canActivate: [AuthGuard]},
    { path: 'poStatus', component: PoStatusComponent,
    canActivate: [AuthGuard]},
    { path: 'issueContract', component: IssueContractComponent,
    canActivate: [AuthGuard]},
    { path: 'performanceBond', component: PerformanceBondComponent,
    canActivate: [AuthGuard]},
    { path: 'bankAndInsurance', component: BankAndInsuranceComponent,
    canActivate: [AuthGuard]},
    { path: 'shipmentReport', component: ShipmentReportComponent,
    canActivate: [AuthGuard]},
    { path: 'clearedPO', component: ClearedPOComponent,
    canActivate: [AuthGuard]},
    { path: 'itemSummary', component: ItemSummaryComponent,
    canActivate: [AuthGuard]},
  ] },



  
  { path: '**', component: AppComponent }
];    


export let componentsArray = [   
   AppComponent,
  MainMenuComponent,
  NavBarComponent,
  SelectedPosComponent,
  PurchaseOrderEventComponent,
  PurchaseOrderDetailsComponent,
  NavbarReportComponent,
  PoLeadTimeComponent,
  PoStatusComponent,
  PreagreementComponent,
  PostagreementComponent,
  ShipmentComponent,
  StatusReportComponent,
  LoginComponent,
  LetterModalComponent,
  SelectedInvoiceComponentComponent,
  InvoicePoEventComponent,
  IssueContractComponent,
  PerformanceBondComponent,
  BankAndInsuranceComponent,
  ShipmentReportComponent,
  ClearedPOComponent,
  ItemSummaryComponent,
  InvoicePoDetailComponent,
  HeaderComponent,

  LcExtensionComponent,

  CadExtensionComponent,

  LcOpenComponent,

  ReleasePerformanceComponent,]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
     [RouterModule.forChild(routes)],
  ],
  exports: [
    RouterModule,
    
    
  ]

})


export class AppRoutingModule {
  
 }
