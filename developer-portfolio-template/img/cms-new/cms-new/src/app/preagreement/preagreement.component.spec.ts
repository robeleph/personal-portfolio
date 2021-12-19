import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreagreementComponent } from './preagreement.component';

describe('PreagreementComponent', () => {
  let component: PreagreementComponent;
  let fixture: ComponentFixture<PreagreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreagreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});