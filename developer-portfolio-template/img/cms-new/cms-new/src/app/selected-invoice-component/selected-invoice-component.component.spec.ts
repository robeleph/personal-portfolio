import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedInvoiceComponentComponent } from './selected-invoice-component.component';

describe('SelectedInvoiceComponentComponent', () => {
  let component: SelectedInvoiceComponentComponent;
  let fixture: ComponentFixture<SelectedInvoiceComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedInvoiceComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedInvoiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
