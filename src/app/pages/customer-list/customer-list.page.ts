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
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from './../../auth/login.service';
import { NavParams } from '@ionic/angular';
import { AttendanceCartPage } from '../attendance-cart/attendance-cart.page';
import { presentToast } from 'src/app/components/toastError';
import { Observable } from 'rxjs';
import AcessoMobileService from 'src/app/auth/AcessoMobile.service';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { ClienteService } from 'src/app/core/Services/Clientes.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService, LoginService, NavParams],
})
export class CustomerListPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  selectedTipo: string = 'Somente no inicio';
  selectedOption: string = 'Nome';
  inputClient!: string;
  sFitrar!: string;
  clientes: any[] = [];
  infoLoja!: string | null;
  iCodRede!: number;
  sTipo!: string;
  loginData: any;
  openedFromModal: boolean = false;
  iQtdDispositivos!: number;
  resultQtdDispositivos!: number;
  labelSearch: string = 'Nome';

  constructor(
    public menuCtrl: MenuController,
    public AuthService: AuthService,
    public router: Router,
    private clienteService: ClienteService,
    private lojaConfig: LojaConfig,
    private modalController: ModalController,
    private navParams: NavParams,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private mobile: AcessoMobileService
  ) {}

  async ngOnInit() {
    console.log(this.navParams.data);
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

  async searchClient() {
    if (this.inputClient) {
      const filtro = this.clienteService.escolhaFiltro(this.selectedOption);
      const tipo = this.selectedTipo === 'Em qualquer posição' ? '%' : '';

      const loading = await this.loadingController.create({
        message: 'Carregando...',
        spinner: 'circles',
        translucent: true,
        backdropDismiss: false,
      });
      loading.present();
      this.clienteService
        .listarTodosOsClientes(this.inputClient, filtro, tipo)
        .subscribe({
          next: (clientes) => {
            this.clientes = clientes || [];
            loading.dismiss();
          },
          error: (error) => {
            console.error(error);
            loading.dismiss();
            presentToast(
              this.toastController,
              'não foi possivel localizar clientes',
              'top'
            );
          },
        });
    }
  }

  openModal() {
    this.modal.present();
  }
  closeModal() {
    if (this.selectedOption) {
      this.labelSearch = this.selectedOption;
    }
    this.modal.dismiss();
  }
  backPage() {
    if (this.openedFromModal) {
      this.modalController.dismiss({
        someData: 'Hello from modal!',
      });
    } else {
      this.router.navigate(['/before-sales']);
      this.selectedOption = 'nome'; // Redireciona normalmente
    }
  }

  async selectCliente(cliente: any) {
    if (this.verificaAcessoMobileSilmutaneos() === true) {
      const modalData = {
        sCodPessoa: cliente.sCodPessoa,
        sNomeCliente: cliente.sNomeCliente,
      };

      if (this.openedFromModal === false) {
        this.router.navigate(['/attendance-cart'], {
          queryParams: modalData,
        });
      } else {
        this.modalController.dismiss(modalData);
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
