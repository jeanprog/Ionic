import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-qtd-fracionada',
  templateUrl: './modal-qtd-fracionada.page.html',
  styleUrls: ['./modal-qtd-fracionada.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ModalQtdFracionadaPage implements OnInit {
  constructor(private modalcontroller: ModalController) {}

  qtdFracionada!: number;
  qtdFracionadaAlteracao!: number;

  ngOnInit() {}

  closeModal() {
    this.modalcontroller.dismiss();
  }

  addQtdFracionada() {
    console.log(this.qtdFracionada);
    this.modalcontroller.dismiss(this.qtdFracionada);
  }
}
