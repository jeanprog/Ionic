import { LoginService } from 'src/app/auth/login.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { SellerService } from './getSellers.service';
import { HttpClientModule } from '@angular/common/http';
import { presentToast } from '../toastError';

@Component({
  selector: 'app-modal-select-seller',
  templateUrl: './modal-select-seller.page.html',
  styleUrls: ['./modal-select-seller.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [SellerService],
})
export class ModalSelectSellerPage implements OnInit {
  constructor(
    public router: Router,
    private sellerService: SellerService,
    private loginService: LoginService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}
  loginData: any;
  sellers: any[] = [];
  icodLoja!: number;
  sNomeFunc!: string | null;
  iCodFunc!: string | null;

  ngOnInit() {
    this.loginData = this.loginService.getLoginData();
    this.icodLoja = this.loginData.parametros.iCodLoja;
    console.log(this.icodLoja);

    this.sellerService.setApiUrl(this.icodLoja);
    this.loadSellers();
  }
  async loadSellers() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });
    loading.present();
    this.sellerService.getSellers().subscribe(
      (data: any) => {
        this.sellers = data;
        console.log('Vendedores carregados:', data);
        loading.dismiss();
      },
      (error: any) => {
        presentToast(
          this.toastController,
          'não foi possivel encontrar vendedores',
          'top'
        );
        loading.dismiss();
      }
    );
  }

  selectSeller(sNomeFunc: string, iCodFunc: number) {
    // Navegar para a página de carrinho e passar as informações do vendedor como parâmetros
    const seller = {
      sNomeFunc: sNomeFunc,
      iCodFunc: iCodFunc,
    };
    this.modalController.dismiss(seller);
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
