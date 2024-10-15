import { AttendanceCartPage } from './../attendance-cart/attendance-cart.page';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subscription, observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { format } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { presentToast } from 'src/app/components/toastError';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { PreVendaService } from 'src/app/core/Services/PreVendaservice';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import AcessoMobileService from 'src/app/auth/AcessoMobile.service';
import { formatDate } from '../../utils/formatDate';

@Component({
  selector: 'app-before-sales',
  templateUrl: './before-sales.page.html',
  styleUrls: ['./before-sales.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [BarcodeScanner],
})
export class BeforeSalesPage implements OnInit {
  private preVendaService = inject(PreVendaService);
  private lojaConfig = inject(LojaConfig);

  allPreVenda: any[] = [];
  preVenda: any[] = [];
  subscription!: Subscription;
  filtro: string = '';
  isLoggedIn!: boolean;
  ipServer!: string;
  UserPrinter!: boolean;
  isAuthenticated: boolean = true;
  iQtdDispositivos!: number;
  iCodVendedor!: number;
  resultQtdDispositivos!: number;
  ticketTroca!: string;
  configData = this.lojaConfig.getConfigLoja();
  configLoja = this.lojaConfig.getConfigLoja();

  constructor(
    public menuCtrl: MenuController,
    public AuthService: AuthService,
    private lojaService: LojaConfig,
    private mobile: AcessoMobileService,
    public router: Router,
    private modal: ModalController,
    private toastcontroller: ToastController /*   private BarcodeScanner: BarcodeScanner */
  ) {}

  formatDate(dateString: string): string {
    return formatDate(dateString);
  }
  formatNumber(value: number): string {
    return value.toFixed(2); // Define 2 casas decimais
  }

  ngOnInit(): void {
    if (this.configData.sellerDefault === true) {
      this.listarPreVendaVendedor(this.configLoja?.infoLoja.iCodVendedorPadrao);
    }

    // this.authService.getUser();
    this.existPrinterUser();
    this.menuCtrl.enable(true);
    this.listarPreVendas();
    this.consultaMobile();
  }

  consultaMobile() {
    this.mobile.consultaMobileService().subscribe({
      next: (data) => {
        this.resultQtdDispositivos = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  listarPreVendaVendedor(icodVendedor: number) {
    this.preVendaService.listarPreVendasVendedor(icodVendedor).subscribe({
      next: (data) => {
        this.allPreVenda = data;
        this.filtrarProdutos();
      },
      error(error) {
        console.log(error, 'não foi possivel buscar as pré vendas');
      },
    });
  }

  listarPreVendas() {
    this.preVendaService.listarTodasPreVenda().subscribe({
      next: (data) => {
        this.allPreVenda = data;
        this.filtrarProdutos();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  filtrarProdutos(): void {
    console.log(this.allPreVenda);
    if (this.filtro.trim() !== '') {
      this.preVenda = this.allPreVenda.filter((item) => {
        return (
          item.sNomeCliente &&
          item.sNomeCliente.toLowerCase().indexOf(this.filtro.toLowerCase()) >
            -1
        );
      });
      console.log(this.preVenda);
    } else {
      this.preVenda = [...this.allPreVenda];
    }
  }

  existPrinterUser() {
    return this.lojaService.existPrinterUser();
  }

  logout() {
    localStorage.removeItem('LOJA');
    this.router.navigateByUrl('/');
  }
  async consultaCarrinho(
    iCodVenda: number,
    iSeqVendaDia: number,
    modeloTela: string
  ) {
    this.iQtdDispositivos =
      this.lojaService.getParamsLoja().parametros.iQtdDispositivos;

    if (this.iQtdDispositivos > this.resultQtdDispositivos) {
      let profileModal = await this.modal.create({
        component: AttendanceCartPage,
        componentProps: {
          openedFromModal: true,
          iCodVenda: iCodVenda,
          iSeqVendaDia: iSeqVendaDia,
          modeloTela: modeloTela,
        },
        cssClass: 'customModalCart',
      });
      profileModal.present();
    } else {
      presentToast(
        this.toastcontroller,
        'Número de acessos silmutâneos excedidos',
        'top'
      );
    }
  }

  AbrirCarrinho() {
    this.iQtdDispositivos =
      this.lojaService.getParamsLoja().parametros.iQtdDispositivos;
    if (this.iQtdDispositivos > this.resultQtdDispositivos) {
      this.router.navigateByUrl('/attendance-cart');
    } else {
      presentToast(
        this.toastcontroller,
        'Número de acessos silmutâneos excedidos',
        'top'
      );
    }
  }
}

/* 
  openScannerTicketDeTroca() {
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        this.ticketTroca = barcodeData.text;
      })
      .catch((err) => {
        console.log('Error', err);
      });
  } */
