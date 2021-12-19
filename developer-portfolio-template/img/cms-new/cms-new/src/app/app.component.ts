import { Component } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataService } from './data.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
ar:any;
group:any;
param:any;
constructor(public dataservice: DataService,location: PlatformLocation, private router: Router) {
  
  
  
}
}
