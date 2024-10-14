import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeforeSalesPage } from './before-sales.page';

describe('BeforeSalesPage', () => {
  let component: BeforeSalesPage;
  let fixture: ComponentFixture<BeforeSalesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BeforeSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
