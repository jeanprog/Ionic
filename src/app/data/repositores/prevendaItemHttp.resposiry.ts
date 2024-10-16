// src/app/data/repositories/user-http.repository.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PreVenda } from 'src/app/core/entities/PreVenda.entity';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { PreVendaItemGateway } from '../interfaces/PreVendaItemGateway';
import { PreVendaItem } from 'src/model/PreVendaItem';

@Injectable({
  providedIn: 'root',
})
export class PreVendaitemHttpRepository implements PreVendaItemGateway {
  private ipServer!: string;
  private icodRede!: number;
  private iCodLoja!: number;
  private lojaConfig = inject(LojaConfig);
  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    const lojaParams = this.lojaConfig.getParamsLoja();
    if (!configData) {
      console.log('sem parametros');
    }
    this.ipServer = configData?.ip;
    this.icodRede = lojaParams.parametros.iCodRede;
    this.iCodLoja = lojaParams.parametros.iCodLoja;
  }
  buscarPreVendaItem(sRef: string): Observable<PreVendaItem> {
    const url = `http://${this.ipServer}/api/produtos?sRefCompleta=${sRef}&iCodRede=${this.icodRede}&iCodLoja=${this.iCodLoja}`;

    return this.http.get<PreVendaItem>(url);
  }
}
