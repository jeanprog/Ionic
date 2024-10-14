import { presentToast } from 'src/app/components/toastError';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { is } from 'date-fns/locale';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [BarcodeScanner],
})
export class SettingsPage implements OnInit {
  constructor(
    public router: Router,
    public modalController: ModalController,
    private BarcodeScanner: BarcodeScanner,
    private toastController: ToastController
  ) {}
  ipServer!: string;
  preSales: boolean = false; // Inicializa como falso
  sellerDefault: boolean = false; // Inicializa como falso
  checkoutPreVenda: boolean = false;

  ngOnInit() {
    this.stateToggle();
    this.stateSeller();
  }

  stateSeller() {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.preSales = config.preSales;
      this.checkoutPreVenda = config.checkoutPreVenda;
    }
    console.log('quando iniciou componente', this.preSales);
  }
  stateToggle() {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.sellerDefault = config.sellerDefault;
    }
    console.log('quando iniciou componente', this.sellerDefault);
  }

  eventPreSales(event: any) {
    this.preSales = event.detail.checked; // Define o valor do toggle
    console.log('Toggle value:', this.preSales);
  }

  eventSellerDefault(event: any) {
    this.sellerDefault = event.detail.checked; // Define o valor do toggle
    console.log('Vendedor padrão:', this.sellerDefault);
  }
  eventCheckoutPreVenda(event: any) {
    this.checkoutPreVenda = event.detail.checked; // Define o valor do toggle
    console.log('Vendedor padrão:', this.sellerDefault);
  }

  openScannerServer() {
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        this.ipServer = barcodeData.text;
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  submitConfig() {
    const ip =
      '192.168.1.200:8080'; /* '192.168.1.108:8081' */ /* this.ipServer */

    if (ip) {
      console.log('IP do Servidor:', this.ipServer);

      const objectConfig = {
        ip: '192.168.1.200:8080' /* '192.168.1.108:8081' */ /* this.ipServer */,
        sellerDefault: this.sellerDefault,
        preSales: this.preSales,
        checkoutPreVenda: this.checkoutPreVenda,
      };
      console.log('Configurações:', objectConfig);
      localStorage.setItem('config', JSON.stringify(objectConfig));
      presentToast(
        this.toastController,
        'configurações salva com sucesso',
        'top'
      );
    } else {
      console.log('Error ao salvar configurações');
      presentToast(
        this.toastController,
        'Error ao salvar configurações',
        'top'
      );
    }
  }

  async back() {
    if (await this.modalController.getTop()) {
      // A página de configurações foi aberta como um modal
      this.modalController.dismiss();
    } else {
      // A página de configurações foi aberta de outra forma (não como um modal)
      this.router.navigateByUrl('/before-sales');
    }
  }
}
