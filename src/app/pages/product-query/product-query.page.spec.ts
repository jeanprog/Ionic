import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductQueryPage } from './product-query.page';

describe('ProductQueryPage', () => {
  let component: ProductQueryPage;
  let fixture: ComponentFixture<ProductQueryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductQueryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
