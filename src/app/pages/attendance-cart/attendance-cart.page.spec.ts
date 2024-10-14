import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceCartPage } from './attendance-cart.page';

describe('AttendanceCartPage', () => {
  let component: AttendanceCartPage;
  let fixture: ComponentFixture<AttendanceCartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AttendanceCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
