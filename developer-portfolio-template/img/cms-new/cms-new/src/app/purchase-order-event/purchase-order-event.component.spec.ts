import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderEventComponent } from './purchase-order-event.component';

describe('PurchaseOrderEventComponent', () => {
  let component: PurchaseOrderEventComponent;
  let fixture: ComponentFixture<PurchaseOrderEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
