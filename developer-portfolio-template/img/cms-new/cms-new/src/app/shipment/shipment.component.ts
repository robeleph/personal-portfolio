import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  name: string;
  ar: any;
  purchaseOrderID: string[];
  generalInfo: string; timerId; displayList: boolean = false;
  showHome:boolean;
  group:any;
  constructor(private dataservice: DataService, private router: Router, private route: ActivatedRoute, location: PlatformLocation) { 
//     location.onPopState(() => {
//     this.ar = this.dataservice.getListMenu();
//     this.group = this.ar[this.ar.length - 2];

//     if(this.group.length < 2){
//       this.dataservice.logout();

//     }else{

//     }
// });
  }
  ngOnInit() {
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.timerId = setInterval(() => this.checkList(), 1000);
    this.ar = this.dataservice.getListMenu();
    this.group = this.ar[this.ar.length - 2];
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.name = this.ar[this.ar.length - 1];
 
   if(this.dataservice.isExpired()) {
     this.dataservice.logout();
   }



   if(this.group.length > 1){
     this.showHome = true;
   }

    

  }

  checkList() {
    if (this.purchaseOrderID.length > 0) {
      this.displayList = true; 
    }
  }
  logout(): void {

    this.dataservice.logout()
    //decide which user goes where depending on the eventMenus

    this.router.navigate(['login']);
    // console.log(this.listMenu);

  }

}
