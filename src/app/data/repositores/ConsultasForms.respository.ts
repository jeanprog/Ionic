import { catchError, map, Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import ConsultaFormsGateway from '../interfaces/ConsultaFormsGateway';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class consultaFormsHttp implements ConsultaFormsGateway {
  ipServer!: string;

  constructor(private http: HttpClient, private lojaConfig: LojaConfig) {
    const configData = this.lojaConfig.getConfigLoja();
    if (configData) {
      this.ipServer = configData.ip;
    } else {
      console.error(' não foi possível obter as configurações da loja');
      this.ipServer = 'default_ip';
    }
  }

  consultaCpf(cpf: string): Observable<number> {
    const url = `http://${this.ipServer}/api/ConsultaCPFCNPJCadastrado?CPNJCPF=${cpf}`;
    return this.http.get<number>(url);
  }

  getMunicipios(uf: string): Observable<any[]> {
    const url = `http://${this.ipServer}/api/ConsultarMunicipio?sUF=${uf}`;
    return this.http.get<any[]>(url).pipe(
      map((data) => data) // Mapeia os dados para retornar diretamente a lista de municípios
    );
  }

  loadStates(): Observable<any[]> {
    const url = `http://${this.ipServer}/api/estado`;
    return this.http.get<any[]>(url).pipe(
      map((data) => data),
      // Mapear os dados da resposta (opcionalmente pode fazer tratamentos aqui)
      catchError((error) => {
        console.log(error); // Tratar erro (opcionalmente pode lançar um erro customizado aqui)
        return throwError(error);
      })
    );
  }

  consultarCep(uf: string, cep: string): Observable<any> {
    const url = `http://${this.ipServer}/api/ConsultarCep?sCep=${cep}&sUF=${uf}`;
    return this.http.get<any>(url);
  }
}
