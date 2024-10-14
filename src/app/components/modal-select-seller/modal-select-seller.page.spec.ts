import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSelectSellerPage } from './modal-select-seller.page';

describe('ModalSelectSellerPage', () => {
  let component: ModalSelectSellerPage;
  let fixture: ComponentFixture<ModalSelectSellerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalSelectSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
