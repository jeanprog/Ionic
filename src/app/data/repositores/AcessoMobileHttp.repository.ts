import { HttpClient } from '@angular/common/http';
import { AcessoMobileGateway } from '../interfaces/AcessoMobileGateway';
import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Injectable({
  providedIn: 'root',
})
export class AcessoMobileHttpRepository implements AcessoMobileGateway {
  private apiUrl!: string;
  private ipServer!: string;
  private lojaConfig = inject(LojaConfig);
  private iQtdDispositivos!: number;

  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    const configLoja = this.lojaConfig.getParamsLoja();
    if (configData) {
      this.ipServer = configData.ip;
      this.iQtdDispositivos = configLoja.parametros.iQtdDispositivos;
    } else {
      console.error(' não foi possível obter as configurações da loja');
      this.ipServer = 'default_ip';
    }
  }
  consultaAcessoMobile(): Observable<number> {
    let url = `http://${this.ipServer}/api/ConsultaQtdAcessoMobile`;
    let data: Observable<any> = this.http.get(url);
    return data;
  }

  consultaInfoDispositivo(serial: string) {
    let url =
      'http://' +
      this.ipServer +
      '/api/' +
      'ConsultaAcessoMobile?serial=' +
      serial;
    let data: Observable<any> = this.http.get(url);

    return data;
  }

  atualizaInfoDispositivoMobile(serial: string) {
    let url =
      'http://' +
      this.ipServer +
      '/api/' +
      'AtualizarAcessoMobile?serial=' +
      serial;
    let data: Observable<any> = this.http.get(url);
    return data;
  }

  insereDispositivo(
    serial: string,
    model: string,
    cordova: string,
    platform: string,
    version: string,
    manufacturer: string
  ) {
    let url =
      'http://' +
      this.ipServer +
      '/api/' +
      'InserirAcessoMobile?model=' +
      model +
      '&cordova=' +
      cordova +
      '&platform=' +
      platform +
      '&version=' +
      version +
      '&manufacturer=' +
      manufacturer +
      '&serial=' +
      serial;
    let data: Observable<any> = this.http.get(url);

    return data;
  }

  deleteSerialDispositivo(serial: string) {
    let url =
      'http://' +
      this.ipServer +
      '/api/' +
      'DeletaAcessoMobile?serial=' +
      serial;
    let data: Observable<any> = this.http.get(url);
    return data;
  }
}
