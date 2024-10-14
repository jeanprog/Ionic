import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductsPage } from './list-preVenda.page';

describe('ListProductsPage', () => {
  let component: ListProductsPage;
  let fixture: ComponentFixture<ListProductsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function async(arg0: () => void): jasmine.ImplementationCallback {
  throw new Error('Function not implemented.');
}

