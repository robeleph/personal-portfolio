import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


import { componentsArray } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { LcExtensionComponent } from './modals/lc-extension/lc-extension.component';
import { CadExtensionComponent } from './modals/cad-extension/cad-extension.component';
import { LcOpenComponent } from './modals/lc-open/lc-open.component';
import { ReleasePerformanceComponent } from './modals/release-performance/release-performance.component';



@NgModule({     
  declarations: [

    componentsArray,

     ],

  imports: [

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule, BrowserAnimationsModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
    }) // ToastrModule added

  ],
  providers: [],
  bootstrap: [componentsArray[0]],
  entryComponents: [LcExtensionComponent,

    CadExtensionComponent,

    LcOpenComponent,

    ReleasePerformanceComponent]
    
})
export class AppModule { }