import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message,
      backdropDismiss: false,
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();
    return loading;
  }

  async dismissLoading(loading: HTMLIonLoadingElement) {
    await loading.dismiss();
  }
}
