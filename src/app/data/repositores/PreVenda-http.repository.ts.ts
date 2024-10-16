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
  private lojaConfig = inject(LojaConfig);
  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    if (configData) {
      this.ipServer = configData?.ip;
    } else {
      console.error('Não foi possível obter as configurações da loja.');
    }
  }
  listarPreVendasVendedor(iCodVendedor: number): Observable<PreVenda[]> {
    return this.http.get<PreVenda[]>(
      `http://${this.ipServer}/api/PreVendaVendedor?iCodVendedor=${iCodVendedor}`
    );
  }

  adicionarPreVenda(): Observable<PreVenda> {
    console.log(this.lojaConfig);
    throw new Error('Method not implemented.');
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
  alterarPreVenda(): Observable<PreVenda> {
    throw new Error('Method not implemented.');
  }
}
