import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinterRegistrationPage } from './printer-registration.page';

describe('PrinterRegistrationPage', () => {
  let component: PrinterRegistrationPage;
  let fixture: ComponentFixture<PrinterRegistrationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrinterRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
