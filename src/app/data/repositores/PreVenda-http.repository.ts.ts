// src/app/data/repositories/user-http.repository.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import preVendaGateway from '../interfaces/PreVendaGateway';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Injectable({
  providedIn: 'root',
})
export class PreVendaHttpRepository implements preVendaGateway {
  private ipServer!: string;
  private iCodLoja!: number;
  private iCodRede!: number;
  private lojaConfig = inject(LojaConfig);
  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    const paramsLoja = this.lojaConfig.getParamsLoja();
    if (configData && paramsLoja) {
      this.ipServer = configData?.ip;
      this.iCodLoja = paramsLoja.parametros.iCodLoja;
      this.iCodRede = paramsLoja.parametros.iCodRede;
    } else {
      console.error('Não foi possível obter as configurações da loja.');
    }
  }

  salvarPreVenda(preVenda: PreVenda): Observable<PreVenda> {
    const url = `http://${this.ipServer}/api/SalvarPreVenda`;
    return this.http.post<PreVenda>(url, preVenda);
  }

  listarPreVendasVendedor(iCodVendedor: number): Observable<PreVenda[]> {
    return this.http.get<PreVenda[]>(
      `http://${this.ipServer}/api/PreVendaVendedor?iCodVendedor=${iCodVendedor}`
    );
  }

  listarTodasAsPreVendas(): Observable<PreVenda[]> {
    return this.http
      .get<PreVenda[]>(`http://${this.ipServer}/api/prevenda`)
      .pipe(
        map((data: PreVenda[]) => data),
        catchError((error) => {
          console.error('Erro ao listar pré-vendas:', error);
          return of([]);
        })
      );

    // Retornando um Observable vazio só como exemplo, ajuste conforme necessário
    return of([]); // Placeholder
  }
  alterarPreVenda(preVenda: PreVenda): Observable<PreVenda> {
    const url = `http://${this.ipServer}/api/UpdatePreVenda`;
    console.log('teste da saida final', preVenda);
    return this.http.post<PreVenda>(url, preVenda);
  }

  consultaPreVendaRegistrada(
    iSeqVendaDia: number,
    iCodVenda: number
  ): Observable<PreVenda[]> {
    let url = `http://${this.ipServer}/api/ConsultarPreVenda?iCodLoja=${this.iCodLoja}&iCodVenda=${iCodVenda}&iSeqVendaDia=${iSeqVendaDia}&iCodRede=${this.iCodRede}`;
    console.log(url);
    return this.http.get<PreVenda[]>(url);
  }
}
