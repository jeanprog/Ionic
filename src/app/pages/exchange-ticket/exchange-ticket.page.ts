import { ItemTroca } from './../../../model/itemTroca';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { PreVenda } from 'src/model/preVenda';

import { HttpClient } from '@angular/common/http';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { LoginService } from 'src/app/auth/login.service';
import { Observable, map, observable } from 'rxjs';
import { formatarData } from 'src/app/utils/formatDateBR';
import { presentToast } from 'src/app/components/toastError';

@Component({
  selector: 'app-exchange-ticket',
  templateUrl: './exchange-ticket.page.html',
  styleUrls: ['./exchange-ticket.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [BarcodeScanner],
})
export class ExchangeTicketPage implements OnInit {
  constructor(
    private loginService: LoginService,
    private loadingController: LoadingController,
    private BarcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private modalcontroller: ModalController,
    private toastController: ToastController,
    public router: Router
  ) {
    this.PreVenda = new PreVenda();
    this.PreVenda.listaPrevendaItem = [];
    this.PreVenda.listaPrevendaItemTroca = [];
    this.PreVenda.nValDesconto = 0;
  }

  iCodRede!: number;
  iCodLoja!: number;
  ipServer!: string;
  ticketTroca!: string;
  PreVenda!: PreVenda;
  ItemTroca!: ItemTroca;
  sUsuario!: string;
  valorTotal: number = 0;
  lista!: any;
  sTatetTroca!: any;

  listTicketTroca: any;
  JaExisteTicketAdd!: number;

  ngOnInit() {
    console.log(this.lista);
    if (this.lista) {
      this.PreVenda.listaPrevendaItemTroca = this.lista;

      this.calcularTotalVenda();
    }
    console.log(this.sTatetTroca, 'verificando estado');
    if (this.sTatetTroca) {
      this.PreVenda.listaPrevendaItemTroca = this.sTatetTroca;

      this.calcularTotalVenda();
    }
  }

  closeModalSubmit(ticketProduct: string) {
    console.log(ticketProduct);
    this.modalcontroller.dismiss(ticketProduct);
  }
  closeModal() {
    this.modalcontroller.dismiss(this.PreVenda.listaPrevendaItemTroca);
  }
  async onLoadProductTicketDeTroca(sTicketDeTroca: string) {
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
      this.sUsuario = loginData.sLogin;

      const infoConfig = localStorage.getItem('config');
      if (infoConfig) {
        const config = JSON.parse(infoConfig);
        this.ipServer = config.ip;
        //teste do ticket

        /* sTicketDeTroca = '0001000000021449500002000000414000005400'; */
        console.log(sTicketDeTroca);

        const url = `http://${this.ipServer}/api/TicketDeTroca?sTicketDeTroca=${sTicketDeTroca}&iCodRede=${this.iCodRede}&_iCodLoja=${this.iCodLoja}`;
        let data: Observable<any> = this.http.get(url);
        data.subscribe({
          next: (result) => {
            console.log(result, 'endpoint consultaticket');
            //gato pra teste

            if (result.toString() !== '') {
              if (
                result[0].nQtdSaldoRestante > 0 ||
                result[0].iCodVenda == -1
              ) {
                if (
                  result[0].sChaveAcesso != null ||
                  result[0].iCodVenda == -1
                ) {
                  console.log(
                    'case chave de acesso e icod venda -1 ',
                    this.sUsuario
                  );
                  console.log(result[0].sChaveAcesso);
                  this.sUsuario;
                  let iCodProduto = result[0].iCodProduto;
                  console.log(iCodProduto);

                  this.consultaSeJaTemTroca(sTicketDeTroca).subscribe(
                    (valorRestante) => {
                      if (valorRestante > 0) {
                        // Adicionar o produto aqui
                        this.addProdutoTroca(
                          result[0].referenciaCompleta,
                          sTicketDeTroca,
                          result[0].sChaveAcesso,
                          this.sUsuario,
                          result[0].dataVenda,
                          result[0].iCodVenda
                        );
                      } else {
                        console.log('ticket já adicionado');
                      }
                    }
                  );
                }
              } else {
                presentToast(
                  this.toastController,
                  'TICKET JÁ FOI UTILIZADO',
                  'top'
                );
              }

              loading.dismiss();
            } else {
              presentToast(
                this.toastController,
                'Error ao encontrar ticket',
                'top'
              );
              return;
            }
          },
          error: () => {
            presentToast(
              this.toastController,
              'Error ao encontrar ticket3',
              'top'
            );
            loading.dismiss();

            return;
          },
        });
      }
    }
  }

  addProdutoTroca(
    referenciaCompleta: string,
    sTicketDeTroca: string,
    sChaveAcesso: string,
    sUsuario: string,
    dDataAtendimento: Date,
    iCodVenda: number
  ) {
    console.log(
      referenciaCompleta,
      sTicketDeTroca,
      sChaveAcesso,
      sUsuario,
      dDataAtendimento,
      iCodVenda
    );
    if (referenciaCompleta != '') {
      const loginData = this.loginService.getLoginData();
      if (loginData) {
        this.iCodRede = loginData.parametros.iCodRede;
        this.iCodLoja = loginData.parametros.iCodLoja;

        const infoConfig = localStorage.getItem('config');
        if (infoConfig) {
          const config = JSON.parse(infoConfig);
          this.ipServer = config.ip;
          const url = `http://${this.ipServer}/api/produtos?sRefCompleta=${referenciaCompleta}&iCodRede=${this.iCodRede}&iCodLoja=${this.iCodLoja}`;
          let data: Observable<any> = this.http.get(url);
          data.subscribe({
            next: (result) => {
              console.log(result, 'info produto');
              if (result.length != 0) {
                let iOrdem = this.PreVenda.listaPrevendaItemTroca.length + 1;

                //PrevendaItem
                this.ItemTroca = result[0];
                this.ItemTroca.nQtdProduto = 1;
                this.ItemTroca.iOrdem = iOrdem;
                this.ItemTroca.iCodVenda = parseInt(iCodVenda.toString());
                this.ItemTroca.sTerminal = this.sUsuario;
                this.ItemTroca.sTicketDeTroca = sTicketDeTroca;
                this.ItemTroca.schave = sChaveAcesso;
                this.ItemTroca.iCodLoja = this.iCodLoja;
                this.ItemTroca.dDataAtendimento = dDataAtendimento;

                console.log(this.JaExisteTicketAdd, this.ItemTroca.nQtdProduto);

                // aqui verifico se o ticket já esta na lista .
                let estadoTicketJaUtilizado =
                  this.PreVenda.listaPrevendaItemTroca.some((element) => {
                    return element.sTicketDeTroca === sTicketDeTroca;
                  });
                console.log(estadoTicketJaUtilizado);
                if (estadoTicketJaUtilizado === true) {
                  console.log('ticket já adficionado');
                } else {
                  this.PreVenda.listaPrevendaItemTroca.push(this.ItemTroca);
                  this.calcularTotalVenda();
                  console.log(this.PreVenda.listaPrevendaItemTroca);
                  if (iCodVenda != -1) {
                    console.log(sChaveAcesso);
                    let url =
                      'http://' +
                      this.ipServer +
                      '/api/addTicketDeTroca?sChaveAcesso=' +
                      sChaveAcesso +
                      '&sTerminal=' +
                      sUsuario +
                      '&iCodProduto=' +
                      result[0].iCodProduto +
                      '&iOrder=' +
                      iOrdem;
                    let data: Observable<any> = this.http.get(url);
                    console.log(url);
                    data.subscribe((result) => {
                      console.log('deu tudo certo', this.ticketTroca, result);
                      this.ticketTroca = '';
                    });
                  } else {
                    console.log('error ao add produto');
                  }
                }
              } else {
                console.log('error ao add produto');
              }
            },
          });
        } else {
          console.log('sem acesso do serviço de informações da loja ');
        }
      } else {
        console.log('sem acesso do servidor ');
      }
    } else {
      console.log('error ao add produto referencia não encontrada');
    }
  }
  consultaSeJaTemTroca(sTicketDeTroca: string): Observable<number> {
    let url =
      'http://' +
      this.ipServer +
      '/api/ConsultaSeTemTroca?&sTicketDeTroca=' +
      sTicketDeTroca;
    return this.http.get(url).pipe(
      map((result: any) => {
        console.log(result);
        const valorRestante = result[0].nValRestante;
        console.log(valorRestante);
        return valorRestante;
      })
    );
  }

  calcularTotalVenda() {
    this.valorTotal = 0;
    this.PreVenda.listaPrevendaItemTroca.forEach((element) => {
      element.nValTot = element.nValUnit * element.nQtdProduto;
      this.valorTotal += element.nValTot;
      this.PreVenda.nValTroca = this.valorTotal;
    });
  }
  onRemoveTroca(index: number, sTerminal: string, iOrdem: number) {
    let url =
      'http://' +
      this.ipServer +
      '/api/removeTicketDeTroca?sTerminal=' +
      sTerminal +
      '&iOrdem=' +
      iOrdem;
    console.log(url);
    let data: Observable<any> = this.http.get(url);
    data.subscribe((result) => {
      console.log(result);
      this.PreVenda.listaPrevendaItemTroca.splice(index, 1);
      this.calcularTotalVenda();
    });
  }

  formatarDataUtil(data: string): string {
    return formatarData(data);
  }

  openScannerTicketTroca() {
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        this.onLoadProductTicketDeTroca(barcodeData.text);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }
}
