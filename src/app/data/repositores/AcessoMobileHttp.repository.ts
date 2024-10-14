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
}
