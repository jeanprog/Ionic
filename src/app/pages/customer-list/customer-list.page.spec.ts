import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerListPage } from './customer-list.page';

describe('CustomerListPage', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
