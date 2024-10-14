import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDescontoPage } from './modal-desconto.page';

describe('ModalDescontoPage', () => {
  let component: ModalDescontoPage;
  let fixture: ComponentFixture<ModalDescontoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalDescontoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
