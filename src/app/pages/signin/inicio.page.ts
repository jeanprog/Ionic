import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SettingsPage } from '../settings/settings.page';
import { ModalController } from '@ionic/angular';
import { presentToast } from 'src/app/components/toastError';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [AuthService],
})
export class InicioPage implements OnInit {
  login!: string;
  senha!: string;

  isLoggedIn!: boolean;
  userSeller!: Boolean;
  paramSellerDefault!: number;
  iQtdDispositivos!: number;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    public router: Router,
    private authService: AuthService,
    private lojaConfig: LojaConfig,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    /* this.menuCtrl.enable(false); */
  }

  async fazerLogin() {
    if (!this.login || !this.senha) {
      presentToast(
        this.toastController,
        'OS CAMPOS LOGIN E SENHA NÃO PODEM ESTAR EM BRANCO',
        'top'
      );
      return;
    }
    const loading = await this.presentLoading();

    try {
      this.authService.autenticarUsuario(this.login, this.senha).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response === null) {
            presentToast(
              this.toastController,
              'USUARIO E SENHA INCORRETOS',
              'top'
            );
            return;
          }
          this.lojaConfig.setParametrosLoja(response);
          const virificarCaixa = this.lojaConfig.verificaCaixaAberto(response);

          if (virificarCaixa === 1) {
            this.router.navigateByUrl('/before-sales');
          } else if (virificarCaixa === 2) {
            this.router.navigateByUrl('/');
            presentToast(this.toastController, 'CAIXA AINDA FECHADO', 'top');
          }
        },
        error: (error) => {
          console.log('não chamou a autenticação', error);
        },
      });
    } catch (error) {
      console.log(error);
      presentToast(
        this.toastController,
        'NÃO FOI POSSÍVEL ENCONTRAR O SERVIDOR',
        'top'
      );
    } finally {
      await loading.dismiss();
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });

    await loading.present();
    return loading;
  }

  async openModalSettings() {
    const modal = await this.modalController.create({
      component: SettingsPage,
      cssClass: 'settings-modal', // Adicione uma classe CSS personalizada se desejar
    });

    await modal.present();
  }
}
