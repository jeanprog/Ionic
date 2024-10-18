import { Observable } from 'rxjs';
import { Impressora } from 'src/app/core/entities/Impressora.entity';
import { ImpressoraGateway } from '../interfaces/ImpressoraGateway';
import { HttpClient } from '@angular/common/http';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImpressoraRepositoryHttp implements ImpressoraGateway {
  ipServer!: string;
  iCodLoja!: number;
  constructor(private http: HttpClient, private lojaConfig: LojaConfig) {
    const configPadrao = this.lojaConfig.getConfigLoja();
    const paramsLoja = this.lojaConfig.getParamsLoja();
    if (configPadrao) {
      this.ipServer = configPadrao.ip;
      this.iCodLoja = paramsLoja.parametros.iCodLoja;
    }
  }
  obterImpressora(): Observable<Impressora[]> {
    console.log('bateu aqui', this.ipServer, this.iCodLoja);

    let url = `http://${this.ipServer}/api/ObterImpressora?iCodLoja=${this.iCodLoja}`;
    let data: Observable<any> = this.http.get(url);

    return data;
  }
}
