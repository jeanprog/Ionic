import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeTicketPage } from './exchange-ticket.page';

describe('ExchangeTicketPage', () => {
  let component: ExchangeTicketPage;
  let fixture: ComponentFixture<ExchangeTicketPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExchangeTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
