import { Observable } from 'rxjs';
import { Clientes } from 'src/app/core/entities/Clientes.entity';
import ClienteGateway from '../interfaces/ClienteGateway';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesHttpRepository implements ClienteGateway {
  private ipServer!: string;
  private iCodRede!: number;
  private iCodLoja!: number;
  constructor(private http: HttpClient, private lojaConfig: LojaConfig) {
    const configData = this.lojaConfig.getConfigLoja();
    const paramsLoja = this.lojaConfig.getParamsLoja();
    if (configData && paramsLoja) {
      this.ipServer = configData.ip;
      this.iCodRede = paramsLoja.parametros.iCodRede;
      this.iCodLoja = paramsLoja.parametros.iCodLoja;
    } else {
      console.error(' não foi possível obter as configurações da loja');
      this.ipServer = 'default_ip';
    }
  }
  criarCliente(cliente: Clientes): Observable<Clientes> {
    const url = `http://${this.ipServer}/api/InserirPessoa?iCodLoja=${this.iCodLoja}`;
    return this.http.post<any>(url, cliente);
  }
  listarTodosOsClientes(
    inputClient: string,
    sFitrar: string,
    sTipo: string
  ): Observable<Clientes[]> {
    const url = `http://${this.ipServer}/api/clientes?sCampo=${inputClient}&sFitrar=${sFitrar}&sTipo=${sTipo}&iCodRede=${this.iCodRede}`;

    return this.http.get<Clientes[]>(url);
  }
}
