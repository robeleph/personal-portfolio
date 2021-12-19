import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPosComponent } from './selected-pos.component';

describe('SelectedPosComponent', () => {
  let component: SelectedPosComponent;
  let fixture: ComponentFixture<SelectedPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
