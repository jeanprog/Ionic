import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalTicketTrocaPage } from './modal-ticket-troca.page';

describe('ModalTicketTrocaPage', () => {
  let component: ModalTicketTrocaPage;
  let fixture: ComponentFixture<ModalTicketTrocaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalTicketTrocaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
