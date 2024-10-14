import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalQtdFracionadaPage } from './modal-qtd-fracionada.page';

describe('ModalQtdFracionadaPage', () => {
  let component: ModalQtdFracionadaPage;
  let fixture: ComponentFixture<ModalQtdFracionadaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalQtdFracionadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
