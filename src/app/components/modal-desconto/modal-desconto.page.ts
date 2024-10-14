import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { presentToast } from '../toastError';

@Component({
  selector: 'app-modal-desconto',
  templateUrl: './modal-desconto.page.html',
  styleUrls: ['./modal-desconto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ModalDescontoPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  escolha!: string;
  valDesconto!: number;
  isInputFocused!: boolean;
  percentMaxDesc!: number;
  ValorTotal!: number;
  DescontoProporcional!: number;

  ngOnInit() {
    this.escolha = 'Valor';
  }

  capturarOpcao() {
    console.log(this.escolha);
  }
  converteValor() {
    let objectDescPorcent;
    if (this.escolha === 'Porcentagem') {
      console.log('verificando input', this.valDesconto);
      /*     valorConvertido = (this.valDesconto / 100) * this.ValorTotal; */
      objectDescPorcent = {
        tipo: 'porcentagem',
        desconto: this.valDesconto,
      };
    } else if (this.escolha === 'Valor') {
      /*  let valor = this.valDesconto; */
      objectDescPorcent = {
        tipo: 'valor',
        desconto: this.valDesconto,
      };
    }
    return objectDescPorcent;
  }

  submitValor() {
    const objectDesc = this.converteValor();

    if (objectDesc) {
      console.log(objectDesc);
      this.modalController.dismiss(objectDesc);
    } else {
      presentToast(
        this.toastController,
        'DETERMINE O VALOR DE DESCONTO',
        'top'
      );
    }
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
