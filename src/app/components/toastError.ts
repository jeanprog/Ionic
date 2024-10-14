import { ToastController } from '@ionic/angular';

export async function presentToast(
  toastController: ToastController,
  message: string,
  position: 'top' | 'middle' | 'bottom'
) {
  const toast = await toastController.create({
    message: message,
    duration: 1500,
    position: position,
  });

  await toast.present();
}
