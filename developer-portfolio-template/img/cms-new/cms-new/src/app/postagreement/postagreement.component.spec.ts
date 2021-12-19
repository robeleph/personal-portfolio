import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostagreementComponent } from './postagreement.component';

describe('PostagreementComponent', () => {
  let component: PostagreementComponent;
  let fixture: ComponentFixture<PostagreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostagreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
