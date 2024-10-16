import { DateModalComponent } from 'src/app/components/date-modal/date-modal.page';
import { Observable, observable } from 'rxjs';
import { PreVendaItem } from './../../../model/PreVendaItem';
import { ItemTroca } from './../../../model/itemTroca';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonicModule,
  LoadingController,
  ModalController,
  NavParams,
  ToastController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { LoginService } from 'src/app/auth/login.service';
import { CustomerListPage } from '../customer-list/customer-list.page';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalSelectSellerPage } from 'src/app/components/modal-select-seller/modal-select-seller.page';
import { presentToast } from 'src/app/components/toastError';

import { PreVenda } from 'src/model/preVenda';
import { ProductQueryPage } from '../product-query/product-query.page';
import { ModalDescontoPage } from 'src/app/components/modal-desconto/modal-desconto.page';
import { ModalQtdFracionadaPage } from 'src/app/components/modal-qtd-fracionada/modal-qtd-fracionada.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { ExchangeTicketPage } from '../exchange-ticket/exchange-ticket.page';
import { Device } from '@capacitor/device';
import AcessoMobileService from 'src/app/auth/AcessoMobile.service';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { ProdutosService } from 'src/app/core/Services/Produtos.service';
import { PreVendaService } from 'src/app/core/Services/PreVendaservice';

@Component({
  selector: 'app-attendance-cart',
  templateUrl: './attendance-cart.page.html',
  styleUrls: ['./attendance-cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService, LoginService, NavParams, BarcodeScanner],
})
export class AttendanceCartPage implements OnInit {
  sNomeFunc!: string | null;
  iCodFunc!: number | null;
  sNomeCliente!: string | null;
  sCodPessoa!: string | null;
  loginData!: any;
  userSeller!: boolean;
  paramSellerDefault!: boolean;
  PreVendaItemTroca!: ItemTroca;
  PreVendaItem!: PreVendaItem;
  PreVenda!: PreVenda;
  sCodProduto!: string;
  iCodRede!: number;
  iCodLoja!: number;
  products: any[] = [];
  ipServer!: string;
  sRef!: string;
  selectProductModal: any;
  valorTotal: number = 0;
  iCodCaixa!: number;
  openedFromModal!: boolean;
  iCodVenda!: number;
  iSeqVendaDia!: number;
  modeloTela!: string;
  sCaminhoImpressora!: string;
  iModelo!: number;
  iTipo!: number;
  sEstado!: string;
  utilPreVenda!: boolean;
  percentMaxDesc!: number;
  selectValorDesc: any;
  descontoJaAplicado: boolean = false;
  valorDescontoPermitido!: number;
  openedFromModalProduct: boolean = false;
  checkoutPreVenda: boolean = false;
  sFlgDecimalQtdProd!: string;
  qtdFracionada!: number;
  qtdFracionadaTelaAlteracao!: number | null;
  option!: {};
  alteraEstilo!: boolean;
  valorTotalTroca!: number;
  lista!: any;
  StateTroca!: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private BarcodeScanner: BarcodeScanner,
    private mobile: AcessoMobileService,
    private preVendaService: PreVendaService,
    private lojaConfig: LojaConfig
  ) {
    this.PreVenda = new PreVenda();
    this.PreVenda.listaPrevendaItem = [];
    this.PreVenda.listaPrevendaItemTroca = [];
    this.PreVenda.nValDesconto = 0;
  }

  ngOnInit() {
    const configParamsPadrao = this.lojaConfig.getConfigLoja();
    const paramsLoja = this.lojaConfig.getParamsLoja();
    console.log(paramsLoja, configParamsPadrao);
    if (!paramsLoja && !configParamsPadrao) {
      throw new Error('sem parametros ');
    }
    this.iCodRede = paramsLoja.parametros.iCodRede;
    this.iCodLoja = paramsLoja.parametros.iCodLoja;
    this.percentMaxDesc = paramsLoja.parametros.nPercMaxDesc;
    this.iCodCaixa = paramsLoja.iCodCaixa;
    this.sFlgDecimalQtdProd = paramsLoja.parametros.sFlgDecimalQtdProd;
    this.utilPreVenda = configParamsPadrao.preSales;
    /*  'N';  */
    // variavel que define se o modal será de preenchido com informaçoes
    if (this.openedFromModal) {
      this.preencherTelaPreVenda();
    }
    if (this.utilPreVenda === true) {
      this.obterImpressora();
    }

    // aqui colocar a chamada do método !.

    this.onLoadParamsSeller();
    this.recuperaVendedorModal();
    this.recuperacaClienteModal();

    this.carregaAcessoMobile();
  }
  recuperacaClienteModal() {
    this.route.queryParams.subscribe((params) => {
      const selectedCliente = {
        sCodPessoa: params['sCodPessoa'],
        sNomeCliente: params['sNomeCliente'],
        sNomeFunc: params['sNomeFunc'] || null,
        iCodFunc: +params['iCodFunc'] || null,
      };
      this.sCodPessoa = selectedCliente.sCodPessoa;
      this.sNomeCliente = selectedCliente.sNomeCliente;
      this.sNomeFunc = selectedCliente.sNomeFunc;
      this.iCodFunc = selectedCliente.iCodFunc;

      console.log('Selected Cliente já no cart:', selectedCliente);

      // Aqui você pode usar os dados recebidos como desejar
    });
  }

  recuperaVendedorModal() {
    this.route.queryParams.subscribe((params) => {
      this.sNomeFunc = params['sNomeFunc'] || null;

      this.iCodFunc = +params['iCodFunc'] || null;
      // Converte para número, ou mantém null
    });
  }
  async carregaAcessoMobile() {
    const info = await Device.getInfo();
    const serial = await Device.getId();

    if (info && serial) {
      let model = info.model;
      let cordova = info.operatingSystem;
      let platform = info.platform;
      let version = info.osVersion;
      let manufacturer = info.manufacturer;
      let Serial = serial.identifier;

      this.consultaACessoMobileInfoDevice(
        model,
        cordova,
        platform,
        version,
        manufacturer,
        Serial
      );
    }
  }

  consultaACessoMobileInfoDevice(
    model: string,
    cordova: string,
    platform: string,
    version: string,
    manufacturer: string,
    serial: string
  ) {
    this.mobile.consultaInfoDispositivo(serial).subscribe({
      next: (result) => {
        if (result > 0) {
          this.mobile.atualizaInfoDispositivoMobile(serial);
        } else {
          this.mobile.insereDispositivo(
            serial,
            model,
            cordova,
            platform,
            version,
            manufacturer
          );
        }
      },
    });
  }

  deletaSerialMobile() {
    let serial = localStorage.getItem('_capuid');

    if (serial) {
      this.mobile.deleteSerialDispositivo(serial);
    }
  }
  formatNumber(value: number): string {
    return value.toFixed(2); // Define 2 casas decimais
  }

  async openhome(event: Event) {
    event.stopPropagation(); // Interrompe a propagação do evento
    // gambiarra, comportamento esquisito que eu nao consegui identificar porque.

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message:
        'Deseja realmente voltar para a página principal? Todos os itens serão perdidos.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: () => {
            // Limpar a lista e outras variáveis aqui
            console.log('testando aqui fechando modal', this.openedFromModal);
            if (this.openedFromModal) {
              this.modalController.dismiss().then(() => {
                this.deletaSerialMobile();
              });
            } else {
              this.PreVenda.listaPrevendaItem = [];
              this.sRef = '';
              this.valorTotal = 0;
              this.PreVenda.nValDesconto = 0;
              this.descontoJaAplicado = false;
              this.selectValorDesc = '';
              // Limpar outras variáveis
              this.router.navigateByUrl('/before-sales').then(() => {
                this.deletaSerialMobile();
              }); // Redireciona normalmente
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async openPage() {
    const modal = await this.modalController.create({
      component: CustomerListPage,
      componentProps: {
        openedFromModal: true,
      },
    });

    modal.onWillDismiss().then((data) => {
      if (data && data.data) {
        const selectedCliente = data.data;
        console.log('Selected Cliente:', selectedCliente);

        this.sNomeCliente = selectedCliente.sNomeCliente;
        this.sCodPessoa = selectedCliente.sCodPessoa;
      }
    });

    await modal.present();
  }

  async openSeller() {
    const modal = await this.modalController.create({
      component: ModalSelectSellerPage,
      componentProps: {},
    });
    modal.onWillDismiss().then((data) => {
      if (data && data.data) {
        const selectSeller = data.data;
        this.iCodFunc = selectSeller.iCodFunc;
        this.sNomeFunc = selectSeller.sNomeFunc;
      }
    });
    await modal.present();
  }

  async openListProducts() {
    const modal = await this.modalController.create({
      component: ProductQueryPage,
      componentProps: {
        openedFromModalProduct: true,
      },
      cssClass: 'customModalProducts',
    });
    modal.onWillDismiss().then((data) => {
      if (data && data.data) {
        const selectProduct = data.data;
        console.log('atendence cart está aqui ', selectProduct);
        if (selectProduct) {
          this.PreVendaItem = selectProduct;
          this.PreVendaItem.nQtdProduto = 1;
          this.PreVendaItem.bBalancaDigital = false;
          this.PreVendaItem.iCodLoja = this.iCodLoja;
          console.log(this.PreVendaItem, 'aqui resultado');
          if (this.PreVenda.nValDesconto > 0 && this.openedFromModal === true) {
            this.PreVenda.nValDesconto = 0;
            console.log(
              'verificando valor aqui na hora de preencher a variavel',
              this.PreVenda.nValDesconto
            );
            this.descontoJaAplicado = false;
            presentToast(this.toastController, 'DESCONTO REMOVIDO', 'top');
          }

          if (this.PreVenda.listaPrevendaItem.length == 0) {
            this.PreVenda.listaPrevendaItem.push(this.PreVendaItem);
          } else {
            let existe: boolean = false;
            this.PreVenda.listaPrevendaItem.forEach((element) => {
              if (element.iCodProduto == this.PreVendaItem.iCodProduto) {
                element.nQtdProduto = element.nQtdProduto + 1;
                existe = true;
              }
            });
            if (!existe) {
              this.PreVenda.listaPrevendaItem.push(this.PreVendaItem);
            }
          }

          this.calcularTotalVenda();
          console.log('lista de itens ', this.PreVenda.listaPrevendaItem);
        } else {
          return;
        }
      } else {
        return;
      }
    });
    await modal.present();
  }

  onLoadParamsSeller() {
    const infoConfig = localStorage.getItem('config');
    const sellerDefault =
      this.lojaConfig.getParamsLoja().parametros.iCodVendedorPadrao;

    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.userSeller = config.sellerDefault;
    }

    if (this.userSeller === true) {
      this.sNomeFunc = this.loginData.sApelido;
    }

    if (sellerDefault > 0) {
      this.paramSellerDefault = true;
      this.sNomeFunc =
        this.lojaConfig.getParamsLoja().parametros.sApelidoVendedorPadrao;
    }
    return this.userSeller;
  }

  addProduct() {
    if (this.sRef) {
      this.preVendaService.BuscarPreVendaItem(this.sRef).subscribe({
        next: (result: PreVendaItem) => {
          console.log(result, 'bateu aqui');
          if (result.sRefProduto) {
            const newProduct: PreVendaItem = result;
            newProduct.nQtdProduto = 1;
            newProduct.bBalancaDigital = false;
            newProduct.iCodLoja = this.iCodLoja;

            this.PreVenda.listaPrevendaItem =
              this.preVendaService.atualizarListaPreVenda(
                this.PreVenda.listaPrevendaItem,
                newProduct
              );
            this.preVendaService.RetornarValorTotalProdutos(
              this.PreVenda.listaPrevendaItem
            );
            this.sRef = '';
          } else {
            presentToast(
              this.toastController,
              'produto por descrição somente abrindo a consulta',
              'top'
            );
            this.sRef = '';
            return;
          }
        },
        error: () => {
          presentToast(this.toastController, 'Erro ao buscar produto', 'top');
        },
      });
    }
  }
  async removeItem(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Deseja realmente remover o item?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: () => {
            if (
              this.PreVenda.nValDesconto > 0 &&
              this.openedFromModal === true
            ) {
              this.PreVenda.nValDesconto = 0;
              console.log(
                'verificando valor aqui na hora de preencher a variavel',
                this.PreVenda.nValDesconto
              );
              this.descontoJaAplicado = false;
              presentToast(this.toastController, 'DESCONTO REMOVIDO', 'top');
            }
            this.PreVenda.listaPrevendaItem.splice(index, 1);
            this.calcularTotalVenda();
          },
        },
      ],
    });

    await alert.present();
  }

  RetornarValorTotalProdutos(): number {
    let valor = 0;
    this.PreVenda.listaPrevendaItem.forEach((element) => {
      this.valorTotal = 0;
      element.nValTot = element.nValUnit * element.nQtdProduto;
      valor += element.nValTot;
    });
    console.log('valor total dos produtos', this.valorTotal);
    this.valorTotal = valor;

    return valor;
  }
  RetornaValorTotalTroca() {
    let valor = 0;
    this.PreVenda.listaPrevendaItemTroca.forEach((element) => {
      this.valorTotal = 0;
      element.nValTot = element.nValUnit * element.nQtdProduto;
      valor += element.nValTot;
    });
    return valor;
    console.log('valor total dos produtos troca', valor);
  }
  calcularTotalVenda() {
    this.valorTotal = 0;
    this.valorTotalTroca = 0;

    let ValorTotalProdutos = this.RetornarValorTotalProdutos();
    let valorTotalTroca = this.RetornaValorTotalTroca();
    console.log('troca:', valorTotalTroca, 'produto:', ValorTotalProdutos);
    if (ValorTotalProdutos >= valorTotalTroca) {
      console.log('estou nesa condição');
      this.valorTotal = ValorTotalProdutos - valorTotalTroca;
      this.alteraEstilo = false;
      console.log(this.valorTotal, 'saida quando cai na condição problemática');
    } else {
      this.valorTotal = valorTotalTroca - ValorTotalProdutos;
      this.alteraEstilo = true;
      console.log(
        this.valorTotal,
        'saida quando cai na condição problemática 2 '
      );
    }
    if (this.PreVenda.nValDesconto > 0) {
      this.valorTotal = this.valorTotal - this.PreVenda.nValDesconto;
    }

    console.log('função de calcular', this.PreVenda.nValDesconto);
    if (this.sFlgDecimalQtdProd === 'S') {
      let ValorTotalProdutos = this.RetornarValorTotalProdutos();
      console.log('calculo balança digital', ValorTotalProdutos);
    }

    /* this.PreVenda.nValVenda = ValorTotalProdutos; */
    this.PreVenda.nValVenda = ValorTotalProdutos;
    this.PreVenda.nValTroca = valorTotalTroca;
    console.log(this.PreVenda.nValVenda);
    console.log('valor total', this.valorTotal);
    // refatorar este método, pos está com duas responsabilidades , depois refatorar e só chama lo dentro da função!

    if (this.selectValorDesc) {
      if (
        typeof this.selectValorDesc.desconto === 'undefined' &&
        this.descontoJaAplicado === true
      ) {
        this.PreVenda.nValDesconto = 0;
        this.valorTotal = this.valorTotal - this.PreVenda.nValDesconto;
        this.PreVenda.nValVenda = this.valorTotal;
        this.descontoJaAplicado = false;
        console.log('neste case soltar o toast', this.valorTotal);
        presentToast(this.toastController, 'DESCONTO ZERADO', 'top');
      }
      if (
        this.selectValorDesc.tipo === 'valor' &&
        typeof this.selectValorDesc.desconto !== 'undefined'
      ) {
        // só um teste mas da pra não repetir esse código abaixo;
        this.valorDescontoPermitido =
          (this.percentMaxDesc / 100) * this.RetornarValorTotalProdutos();
        console.log(
          'testando a porcentagem max desc',
          this.valorDescontoPermitido
        );
        this.valorTotal = this.valorTotal - this.selectValorDesc.desconto;
        this.descontoJaAplicado = true;
        /* if (typeof this.selectValorDesc.desconto !== 'undefined') {
          console.log('cai no case');
          this.valorTotal = this.valorTotal - this.selectValorDesc.desconto;
          this.descontoJaAplicado = true;
        } */
      } else if (
        this.selectValorDesc.tipo === 'porcentagem' /* &&
        typeof this.selectValorDesc.desconto !== 'undefined' */
      ) {
        this.valorDescontoPermitido =
          (this.percentMaxDesc / 100) * this.RetornarValorTotalProdutos();
        console.log(
          'testando a porcentagem max desc',
          this.valorDescontoPermitido
        );
        let descontoConvertido =
          (this.selectValorDesc.desconto / 100) * this.valorTotal;
        console.log(
          'testando valor convertido da porcetagem pelo user',
          descontoConvertido
        );
        this.valorTotal = this.valorTotal - descontoConvertido;
        this.descontoJaAplicado = true;
      }
    }
  }

  addQuantidade(iCodProduto: number) {
    if (this.PreVenda.nValDesconto > 0 && this.openedFromModal === true) {
      this.PreVenda.nValDesconto = 0;
      console.log(
        'verificando valor aqui na hora de preencher a variavel',
        this.PreVenda.nValDesconto
      );
      this.descontoJaAplicado = false;
      presentToast(this.toastController, 'DESCONTO REMOVIDO', 'top');
    }
    this.PreVenda.listaPrevendaItem.forEach((element) => {
      if (element.iCodProduto == iCodProduto) {
        element.nQtdProduto = element.nQtdProduto + 1;
      }
    });
    this.RetornarValorTotalProdutos();
    this.calcularTotalVenda();
  }
  async removeQuatidade(iCodProduto: number, index: number) {
    if (this.PreVenda.nValDesconto > 0 && this.openedFromModal === true) {
      this.PreVenda.nValDesconto = 0;
      console.log(
        'verificando valor aqui na hora de preencher a variavel',
        this.PreVenda.nValDesconto
      );
      this.descontoJaAplicado = false;
      presentToast(this.toastController, 'DESCONTO REMOVIDO', 'top');
    }
    this.PreVenda.listaPrevendaItem.forEach(async (element) => {
      if (element.iCodProduto == iCodProduto) {
        if (element.nQtdProduto > 1) {
          element.nQtdProduto = element.nQtdProduto - 1;
        } else if (element.nQtdProduto === 1) {
          console.log('estou aqui');

          const alert = await this.alertController.create({
            header: 'Confirmar',
            message: 'Deseja Remover o produto do carrinho ? ',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
              },
              {
                text: 'OK',
                handler: () => {
                  this.PreVenda.listaPrevendaItem.splice(index, 1);
                  this.RetornarValorTotalProdutos();
                  this.calcularTotalVenda();
                  // Limpar a lista e outras variáveis aqui
                },
              },
            ],
          });
          await alert.present();
        }
      }
    });

    this.calcularTotalVenda();
  }
  obterImpressora() {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;

      let url1 = `http://${this.ipServer}/api/ObterImpressora?iCodLoja=${this.iCodLoja}`;
      let data2: Observable<any> = this.http.get(url1);
      data2.subscribe((result) => {
        console.log(result);
        this.sCaminhoImpressora = result[0].sCaminho;
        this.iModelo = result[0].iModelo;
        this.iTipo = result[0].iTipo;
        this.sEstado = result[0].sFlgSituacao;
      });
    }
  }
  async onSavePreVenda() {
    if (this.sNomeFunc !== null && this.PreVenda.listaPrevendaItem.length > 0) {
      // Configuração dos campos da PreVenda com base nos dados atuais
      this.PreVenda.iCodVendedor = this.iCodFunc;
      this.PreVenda.iCodLoja = this.iCodLoja;
      this.PreVenda.iCodCaixa = this.iCodCaixa;
      this.PreVenda.iCodOperador = this.iCodFunc;
      this.PreVenda.sCodPessoa = this.sCodPessoa;
      this.PreVenda.sNomePessoa = this.sNomeCliente;
      this.PreVenda.sNomeCliente = this.sNomeCliente;
      this.PreVenda.sCaminhoImpressora = this.sCaminhoImpressora;
      this.PreVenda.iModelo = this.iModelo;
      this.PreVenda.iTipo = this.iTipo;

      // Define o código do vendedor para cada item da lista de PreVenda
      this.PreVenda.listaPrevendaItem.forEach((element) => {
        element.iCodVendedor = this.PreVenda.iCodVendedor;
      });

      // Verifica se o desconto é do tipo 'valor'
      if (this.selectValorDesc) {
        if (
          this.selectValorDesc.tipo === 'valor' &&
          this.selectValorDesc.desconto !== undefined
        ) {
          if (this.selectValorDesc.desconto <= this.valorDescontoPermitido) {
            let valorDesconto = this.selectValorDesc.desconto;
            console.log('atribuindo desconto a classe prevenda', valorDesconto);
            this.PreVenda.nValDesconto = valorDesconto;

            this.descontoJaAplicado = true;
          } else {
            presentToast(
              this.toastController,
              `DESCONTO MAX PERMITIDO É ${this.valorDescontoPermitido.toFixed(
                2
              )}`,
              'bottom'
            );
            return;
          }
        }
        if (
          this.selectValorDesc.tipo === 'porcentagem' &&
          this.selectValorDesc.desconto !== undefined
        ) {
          // Calcula o valor do desconto em porcentagem
          let valorDesconto =
            (this.selectValorDesc.desconto / 100) *
            this.RetornarValorTotalProdutos();

          console.log('teste valor desconto em relação a qtd %', valorDesconto);
          this.PreVenda.nValDesconto = valorDesconto;

          if (valorDesconto <= this.valorDescontoPermitido) {
            this.PreVenda.nValDesconto = parseFloat(valorDesconto.toFixed(2));
            this.descontoJaAplicado = true;

            this.calcularTotalVenda();
          } else {
            presentToast(
              this.toastController,
              `PORCETAGEM MAX DE DESCONTO É ${this.percentMaxDesc}%`,
              'bottom'
            );
            this.calcularTotalVenda();
            return;
          }
        }
      }

      // Verifica se a utilPreVenda é verdadeira
      console.log(this.PreVenda);
      if (this.utilPreVenda === true) {
        const alert = await this.alertController.create({
          header: 'Confirmar',
          message: ' Deseja imprimir pré-venda ? ',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                this.PreVenda.iImprimirPreVenda = 0;
                this.onPostPreVenda();
                this.deletaSerialMobile();
              },
            },
            {
              text: 'OK',
              handler: () => {
                this.PreVenda.iImprimirPreVenda = 1;
                this.onPostPreVenda();
                this.deletaSerialMobile();
                console.log(
                  'resultado tem que ser 1',
                  'teste dentro do handler',
                  this.PreVenda
                );
              },
            },
          ],
        });
        await alert.present();
      } else {
        this.PreVenda.iImprimirPreVenda = 0;
        this.onPostPreVenda();
        this.deletaSerialMobile();
      }
    } else {
      // Caso nenhuma das condições seja atendida, mostra uma mensagem de erro
      presentToast(
        this.toastController,
        'Adicione um produto ou vendedor',
        'top'
      );
    }

    // Calcula o total da venda
    this.calcularTotalVenda();
  }
  onPostPreVenda() {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;
      this.checkoutPreVenda = config.checkoutPreVenda;
    }

    if (this.openedFromModal === true && this.modeloTela === 'alteracao') {
      const url = `http://${this.ipServer}/api/UpdatePreVenda`;
      console.log('teste da saida final', this.PreVenda);
      this.http.post(url, this.PreVenda).subscribe(() => {
        presentToast(
          this.toastController,
          'PRE VENDA ALTERADA COM SUCESSO',
          'top'
        );
        if (this.checkoutPreVenda === true) {
          this.execCheckoutPreVenda().then(() => {
            this.modalController.dismiss().then(() => {
              /*    window.location.reload(); */
            });
          });
        } else {
          this.modalController.dismiss().then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      const url = `http://${this.ipServer}/api/SalvarPreVenda`;
      this.http.post(url, this.PreVenda).subscribe(() => {
        presentToast(
          this.toastController,
          'PRE VENDA ADICIONADA COM SUCESSO',
          'top'
        );
        if (this.checkoutPreVenda === true) {
          this.execCheckoutPreVenda().then(() => {});
        } else {
          this.router.navigateByUrl('/before-sales').then(() => {
            window.location.reload();
          });
        }
      });
    }
  }

  async preencherTelaPreVenda() {
    console.log('teste chamando preencher tela');
    const loading = await this.loadingController.create({
      message: 'Carregando...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });

    loading.present();

    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;
      let url = `http://${this.ipServer}/api/ConsultarPreVenda?iCodLoja=${this.iCodLoja}&iCodVenda=${this.iCodVenda}&iSeqVendaDia=${this.iSeqVendaDia}&iCodRede=${this.iCodRede}`;
      console.log(url);
      let data: Observable<any> = this.http.get(url);
      data.subscribe((result) => {
        this.PreVenda = result[0];
        console.log('saida do data', this.PreVenda.listaPrevendaItemTroca);

        if (result[0].sNomeCliente != null || result[0] !== null) {
          this.sNomeCliente = result[0].sNomeCliente;

          this.sNomeFunc = result[0].sApelido;

          /*   this.iCodVendedorPadrao = AppModule.iCodVendedorPadrao; */

          //PreVenda
          this.PreVenda.iCodLoja = this.iCodLoja;
          this.PreVenda.iCodCaixa = this.iCodCaixa;
          this.iCodFunc =
            this.PreVenda.listaPrevendaItem.find((icod) => icod.iCodVendedor)
              ?.iCodVendedor || null;
          this.qtdFracionadaTelaAlteracao =
            this.PreVenda.listaPrevendaItem.find((item) => item.nQtdProduto)
              ?.nQtdProduto || null;

          this.sCodPessoa = result[0].sCodPessoa;
          console.log(
            'verificando sainda aqui',
            this.qtdFracionadaTelaAlteracao

            /*  this.PreVendaItem.bBalancaDigital */
          );
          this.lista = this.PreVenda.listaPrevendaItemTroca;
          console.log('props', this.lista);

          this.calcularTotalVenda();
        }

        loading.dismiss();
      });
    }
  }
  onImprimirPreVenda() {
    try {
      let url = `http://${this.ipServer}/api/ImprimirPreVendaImpressoraNaoFiscalEditar`;
      if (this.sCaminhoImpressora != '' && this.sEstado === 'A') {
        this.PreVenda.sCaminhoImpressora = this.sCaminhoImpressora;
        this.PreVenda.iModelo = this.iModelo;
        this.PreVenda.iTipo = this.iTipo;
        let data: Observable<any> = this.http.post(
          url,
          this.PreVenda /* {headers: headers} */
        );
      }
    } catch (error) {
      presentToast(
        this.toastController,
        'NÃO FOI POSSIVEL IMPRIMIR PRÉVENDA',
        'top'
      );
    }
  }

  async openModalDesconto() {
    if (this.PreVenda.listaPrevendaItem.length > 0) {
      const modal = await this.modalController.create({
        component: ModalDescontoPage,
        componentProps: {
          percentMaxDesc: this.percentMaxDesc,
          ValorTotal: this.valorTotal,
        },
      });
      modal.onWillDismiss().then((data) => {
        if (data && data.data) {
          const selectValorDesc = data.data;
          console.log('valor de desconto', selectValorDesc);
          this.selectValorDesc = selectValorDesc;
          this.calcularTotalVenda();
        }
      });
      await modal.present();
    } else {
      presentToast(
        this.toastController,
        'PRIMEIRO INSIRA PRODUTOS NO ATENDIMENTO',
        'bottom'
      );
    }
    this.calcularTotalVenda();
  }

  async execCheckoutPreVenda() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: ' Deseja volta ao login ? ',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('/before-sales').then(() => {
              window.location.reload();
            });
          },
        },
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async openAddModalQtdFracionada() {
    // O objeto PreVendaItem existe e nQtdProduto é definido
    // Faça o que você precisa com PreVendaItem.nQtdProduto

    if (this.modeloTela === 'alteracao') {
      const modal = await this.modalController.create({
        component: ModalQtdFracionadaPage,
        componentProps: {
          qtdFracionada: this.qtdFracionadaTelaAlteracao,
        },
      });
      modal.onWillDismiss().then((data) => {
        // capturar informações do desconto
        if (data && data.data) {
          this.qtdFracionada = data.data;
          /*  this.PreVendaItem.nQtdProduto = this.qtdFracionada; */
          this.PreVenda.listaPrevendaItem.forEach((element) => {
            element.nQtdProduto = this.qtdFracionada;
          });
          this.PreVenda.listaPrevendaItem.forEach((element) => {
            element.bBalancaDigital = true;
          });
          /*   this.PreVendaItem.bBalancaDigital = true; */
        }
        this.calcularTotalVenda();
      });
      await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: ModalQtdFracionadaPage,
        componentProps: {
          qtdFracionada: this.PreVendaItem.nQtdProduto,
        },
      });
      modal.onWillDismiss().then((data) => {
        // capturar informações do desconto
        if (data && data.data) {
          this.qtdFracionada = data.data;
          this.PreVendaItem.nQtdProduto = this.qtdFracionada;

          console.log('valor de desconto', this.qtdFracionada);
          this.PreVenda.listaPrevendaItem.forEach((element) => {
            element.nQtdProduto = this.qtdFracionada;
          });
          this.PreVendaItem.bBalancaDigital = true;
          /*  this.PreVenda.sFlgDecimalQtdProd = this.sFlgDecimalQtdProd; */
        }
        this.calcularTotalVenda();
      });
      await modal.present();
    }
  }

  scan() {
    this.option = {
      prompt: 'scanner de código de barras',
      showTorchButton: true,
    };
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        barcodeData.text = '2000164029023002121';
        let vReferencia = barcodeData.text;
        if (vReferencia.substring(0, 1) == '2' && vReferencia.length) {
          let vRef = vReferencia.substring(1, 13);
          this.addProdutoBalancaDigital(vRef, vReferencia);
        } else {
          this.sRef = barcodeData.text;
          this.addProduct();
          console.log(this.sRef);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  addProdutoBalancaDigital(vRef: any, vReferencia: any) {
    console.log(vRef);
    console.log(vReferencia);

    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;
      const url = `http://${this.ipServer}/api/produtos?sRefCompleta=${vRef}&iCodRede=${this.iCodRede}&iCodLoja=${this.iCodLoja}`;

      let data: Observable<any> = this.http.get(url);
      data.subscribe((result) => {
        if (result && result.length > 0) {
          this.PreVendaItem = result[0];

          let iQtdRef =
            parseFloat(vReferencia.substring(vReferencia.length - 6)) / 10000;
          console.log(iQtdRef);
          console.log(parseFloat(vReferencia.substring(13, 5)));

          this.PreVendaItem.nQtdProduto = parseFloat(iQtdRef.toFixed(3));
          this.PreVendaItem.bBalancaDigital = true;
          this.PreVendaItem.iCodLoja = this.iCodLoja;
          console.log(this.PreVendaItem, 'aqui resultado');

          if (this.PreVenda.listaPrevendaItem.length == 0) {
            this.PreVenda.listaPrevendaItem.push(this.PreVendaItem);
          } else {
            let existe: boolean = false;
            this.PreVenda.listaPrevendaItem.forEach((element) => {
              if (element.iCodProduto == this.PreVendaItem.iCodProduto) {
                element.nQtdProduto = element.nQtdProduto + 1;
                existe = true;
              }
            });
            if (!existe) {
              this.PreVenda.listaPrevendaItem.push(this.PreVendaItem);
            }
          }
          this.RetornarValorTotalProdutos();
          this.sRef = '';
        } else {
          presentToast(
            this.toastController,
            'produto por descrição somente abrindo a consulta',
            'top'
          );
          this.sRef = '';
          return;
        }
        console.log(
          'testando movimento final',
          this.PreVenda.listaPrevendaItem
        );
      });
    } else {
      presentToast(
        this.toastController,
        'erro ao buscar produto tente novamente',
        'top'
      );
      return;
    }
  }

  async openModalTroca() {
    if (this.sNomeCliente != undefined) {
      console.log('cai aqui');
      const modal = await this.modalController.create({
        component: ExchangeTicketPage,
        componentProps: {
          lista: this.lista,
          sTatetTroca: this.StateTroca,
        },
      });
      modal.onWillDismiss().then((data) => {
        if (data.data) {
          this.PreVenda.listaPrevendaItemTroca = data.data;
        }
        console.log(
          this.PreVenda.listaPrevendaItemTroca.length,
          'verificando tamanho da lista na volta'
        );
        if (this.PreVenda.listaPrevendaItemTroca.length > 0) {
          this.StateTroca = this.PreVenda.listaPrevendaItemTroca;
          console.log(
            this.PreVenda.listaPrevendaItemTroca.length,
            'verificando tamanho da lista dentro da condição'
          );
        } else {
          this.PreVenda.listaPrevendaItemTroca = data.data;
        }

        this.calcularTotalVenda();
      });
      await modal.present();
    } else {
      presentToast(this.toastController, 'Primeiro Associe um Cliente', 'top');
    }
  }
}
