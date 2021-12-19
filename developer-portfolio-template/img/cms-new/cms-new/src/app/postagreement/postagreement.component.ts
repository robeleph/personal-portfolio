import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-postagreement',
  templateUrl: './postagreement.component.html',
  styleUrls: ['./postagreement.component.css']
})
export class PostagreementComponent implements OnInit {
  name: string;
  ar: any;
  generalInfo:string;
  group:any;

  showHome:boolean;


  constructor(private dataservice: DataService,  private router: Router, private route: ActivatedRoute, location: PlatformLocation) { 
//     location.onPopState(() => {
//     this.ar = this.dataservice.getListMenu();
//     this.group = this.ar[this.ar.length - 2];

//     if(this.group.length < 2){
//       this.dataservice.logout();

//     }
// });
  }
  ngOnInit() {
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });

    this.ar  = this.dataservice.getListMenu();

    this.name = this.ar[this.ar.length - 1];
    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    this.group = this.ar[this.ar.length - 2];


    if(this.group.length > 1){
      this.showHome = true;
    }

  }
  logout(): void {
    this.dataservice.logout()
    //decide which user goes where depending on the eventMenus
    this.router.navigate(['login']);
  }
  ngOnDestroy(){
  }
}
