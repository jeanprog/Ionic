import { ItemTroca } from './../../../model/itemTroca';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/auth/login.service';
import { LoadingController } from '@ionic/angular';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { presentToast } from '../toastError';

@Component({
  selector: 'app-modal-ticket-troca',
  templateUrl: './modal-ticket-troca.page.html',
  styleUrls: ['./modal-ticket-troca.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [BarcodeScanner],
})
export class ModalTicketTrocaPage implements OnInit {
  constructor(
    private loginService: LoginService,
    private loadingController: LoadingController,
    private BarcodeScanner: BarcodeScanner,
    private http: HttpClient,
    public router: Router,
    private toastController: ToastController
  ) {}

  iCodRede!: number;
  iCodLoja!: number;
  ipServer!: string;

  ticketTroca!: string;
  listTicketTroca: any;
  ngOnInit() {
    this.openScannerTicketDeTroca();
  }

  async onLoadTicketDeTroca() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });

    loading.present();
    const loginData = this.loginService.getLoginData();
    if (loginData) {
      this.iCodRede = loginData.parametros.iCodRede;
      this.iCodLoja = loginData.parametros.iCodLoja;

      const infoConfig = localStorage.getItem('config');
      if (infoConfig) {
        const config = JSON.parse(infoConfig);
        this.ipServer = config.ip;
        //teste do ticket

        /*  this.ticketTroca = '0001000000021449500002000000414000005400'; teste de ticket consulta */
        console.log(this.ticketTroca);

        const url = `http://${this.ipServer}/api/TicketDeTroca?sTicketDeTroca=${this.ticketTroca}&iCodRede=${this.iCodRede}&_iCodLoja=${this.iCodLoja}`;
        let data: Observable<any> = this.http.get(url);
        data.subscribe({
          next: (result) => {
            if (result) {
              this.listTicketTroca = result;

              loading.dismiss();
            } else {
              presentToast(
                this.toastController,
                'Error ao encontrar ticket',
                'top'
              );
              loading.dismiss();
              return;
            }
          },
          error: () => {
            loading.dismiss();
            presentToast(
              this.toastController,
              'Error ao encontrar ticket',
              'top'
            );

            return;
          },
        });
      }
    }
  }

  openScannerTicketDeTroca() {
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        this.ticketTroca = barcodeData.text;
        this.onLoadTicketDeTroca();
      })
      .catch((err) => {
        console.log('Error', err);
        this.onLoadTicketDeTroca();
      });
  }
}
