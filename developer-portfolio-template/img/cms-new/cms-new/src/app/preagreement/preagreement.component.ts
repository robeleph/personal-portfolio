import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ComponentRef } from '@angular/core/src/render3';
import { PurchaseOrderDetailsComponent } from '../purchase-order-details/purchase-order-details.component';
import { PlatformLocation } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-preagreement',
  templateUrl: './preagreement.component.html',
  styleUrls: ['./preagreement.component.css']
})
export class PreagreementComponent implements OnInit {
  name: string;
  feedback: string;
  listMenu: any;
  generalInfo: string;
  group: any;
  showHome: boolean;
  ar: any;
  poId: any;
  private dynamicComponentRef: ComponentRef<PurchaseOrderDetailsComponent>;
  param: String;
  eventMenuCode: string;
  constructor(private dataservice: DataService, private router: Router, private route: ActivatedRoute, location: PlatformLocation, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.param = this.router.url;//read current url for eventMenucode 
    switch (this.param) {
      case "/Pre%20Agreement":
        this.eventMenuCode = "PRAG";
        break;
      case "/Post%20Agreement":
        this.eventMenuCode = "POAG"
        break;
      case "/Shipment":
        this.eventMenuCode = "SHP";
        break;
    }
    // console.log(this.toggler())
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.listMenu = this.dataservice.getListMenu();
    this.group = this.listMenu[this.listMenu.length - 2];
    this.name = this.listMenu[this.listMenu.length - 1];
    this.dataservice.updateId.subscribe(message => this.poId = message);

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    if (this.group.length > 1) {
      this.showHome = true;
    }


  }
  logout(): void {
    this.dataservice.logout()
    //decide which user goes where depending on the eventMenus
    this.router.navigate(['login']);
    // console.log(this.listMenu);
  }



  destroyIt() {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
    }
    else {
      this.feedback = "Unable to destroy dynamic component";
    }
  }
  
}

