import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDash } from './seller-dash';

describe('SellerDash', () => {
  let component: SellerDash;
  let fixture: ComponentFixture<SellerDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerDash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
