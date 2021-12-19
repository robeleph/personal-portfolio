import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoStatusComponent } from './po-status.component';

describe('PoStatusComponent', () => {
  let component: PoStatusComponent;
  let fixture: ComponentFixture<PoStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
