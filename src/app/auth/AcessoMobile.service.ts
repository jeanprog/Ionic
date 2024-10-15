import { Injectable } from '@angular/core';
import { AcessoMobileHttpRepository } from '../data/repositores/AcessoMobileHttp.repository';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AcessoMobileService {
  constructor(private mobileHttp: AcessoMobileHttpRepository) {}
  consultaMobileService(): Observable<number> {
    return this.mobileHttp.consultaAcessoMobile();
  }

  consultaInfoDispositivo(serial: string): Observable<any> {
    return this.mobileHttp.consultaInfoDispositivo(serial);
  }

  atualizaInfoDispositivoMobile(serial: string): Observable<any> {
    return this.mobileHttp.atualizaInfoDispositivoMobile(serial);
  }

  insereDispositivo(
    serial: string,
    model: string,
    cordova: string,
    platform: string,
    version: string,
    manufacturer: string
  ): Observable<any> {
    return this.mobileHttp.insereDispositivo(
      serial,
      model,
      cordova,
      platform,
      version,
      manufacturer
    );
  }

  deleteSerialDispositivo(serial: string): Observable<any> {
    return this.mobileHttp.deleteSerialDispositivo(serial);
  }
}
