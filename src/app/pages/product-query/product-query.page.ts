import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonModal,
  IonicModule,
  LoadingController,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './../../auth/login.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { presentToast } from 'src/app/components/toastError';
import { Observable } from 'rxjs/internal/Observable';
import { ProdutosService } from 'src/app/core/Services/Produtos.service';
import AcessoMobileService from 'src/app/auth/AcessoMobile.service';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Component({
  selector: 'app-product-query',
  templateUrl: './product-query.page.html',
  styleUrls: ['./product-query.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [BarcodeScanner, AuthService],
})
export class ProductQueryPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  sTipo: string = 'Somente no início';
  sFitrar: string = 'Descrição';
  inputValue: string = '';
  products: any[] = [];
  iCodRede!: number;
  ipServer!: string;
  openedFromModalProduct: boolean = false;
  iQtdDispositivos!: number;
  resultQtdDispositivos!: number;

  filtroMap: { [key: string]: () => void } = {
    Descrição: () => {
      this.sFitrar = 'Descrição';
    },
    Referência: () => {
      this.sFitrar = 'Referência';
    },
  };

  sTipoMap: { [key: string]: () => void } = {
    Igual: () => {
      this.sTipo = 'Igual';
    },
    'Somente no início': () => {
      this.sTipo = 'Somente no início';
    },
    'Em qualquer posição': () => {
      this.sTipo = 'Em qualquer posição';
    },
  };

  constructor(
    public menuCtrl: MenuController,
    public authService: AuthService,
    private produtoService: ProdutosService,
    private mobile: AcessoMobileService,
    private lojaConfig: LojaConfig,
    public router: Router,
    private BarcodeScanner: BarcodeScanner,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
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
  verificaAcessoMobileSilmutaneos() {
    this.iQtdDispositivos =
      this.lojaConfig.getParamsLoja().parametros.iQtdDispositivos;

    if (this.iQtdDispositivos > this.resultQtdDispositivos) {
      return true;
    }
    return false;
  }

  formatNumber(value: number): string {
    return value.toFixed(2); // Define 2 casas decimais
  }
  openScannerProduct() {
    this.BarcodeScanner.scan()
      .then((barcodeData) => {
        console.log('Barcode data', JSON.stringify(barcodeData, null, 2));
        this.inputValue = barcodeData.text;
        this.searchProduct();
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  async searchProduct() {
    if (!this.inputValue) {
      return this.showToast('Produto por descrição somente abrindo a consulta');
    }

    if (/^\d+$/.test(this.inputValue)) {
      this.sFitrar = 'Referência';
    }

    const filtro = this.filtroMap[this.sFitrar];
    const tipo = this.sTipoMap[this.sTipo];

    if (!filtro || !tipo) return;

    filtro();
    tipo();

    const loading = await this.createLoading('Carregando...');
    this.fetchProducts(loading);
  }

  async createLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });
    await loading.present();
    return loading;
  }

  fetchProducts(loading: HTMLIonLoadingElement) {
    try {
      this.produtoService
        .pesquisarProdutos(this.sFitrar, this.sTipo, this.inputValue)
        .subscribe({
          next: (data) => {
            this.handleProductResponse(data);
          },
        });
    } catch (error) {
      this.handleError(error);
    } finally {
      loading.dismiss();
    }
  }

  handleProductResponse(data: any[]) {
    this.inputValue = '';
    if (data.length > 0) {
      this.products = data;
    } else {
      this.showToast('Produto não encontrado');
    }
  }

  handleError(error: any) {
    console.error(error);
    this.showToast('Erro na consulta da API');
    this.inputValue = '';
  }

  showToast(message: string) {
    presentToast(this.toastController, message, 'top');
  }

  openModal() {
    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }
  backPage() {
    if (this.openedFromModalProduct) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/before-sales']); // Redireciona normalmente
    }
  }
  selectProductModal(product: any) {
    if (this.verificaAcessoMobileSilmutaneos()) {
      if (this.openedFromModalProduct && product) {
        this.modalController.dismiss(product);
      } else {
        console.log('evento não veio do modal com isso retorne nenhma ação');
        return;
      }
    } else {
      presentToast(
        this.toastController,
        'Número de acessos silmutâneos excedidos',
        'top'
      );
    }
  }
}
