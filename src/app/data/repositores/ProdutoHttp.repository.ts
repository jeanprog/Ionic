import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import ProdutoGateway from '../interfaces/produtoGateway';
import { Observable } from 'rxjs';
import { Produto } from 'src/app/core/entities/produto.entity';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';

@Injectable({
  providedIn: 'root',
})
export default class ProdutoHttpRepository implements ProdutoGateway {
  private lojaConfig = inject(LojaConfig);
  ipServer!: string;
  iCodRede!: number;
  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    const paramsLoja = this.lojaConfig.getParamsLoja();
    if (configData && paramsLoja) {
      this.ipServer = configData?.ip;
      this.iCodRede = paramsLoja.parametros.iCodRede;
    } else {
      console.error('Não foi possível obter as configurações da loja.');
    }
  }
  pesquisarProdutos(
    sFiltrar: string,
    sTipo: string,
    sCampo: string
  ): Observable<Produto[]> {
    const url = `http://${this.ipServer}/api/FitroProdutos?sFitro=${sFiltrar}&stipo=${sTipo}&sCampo=${sCampo}&iCodRede=${this.iCodRede}`;
    console.log(url);
    let data: Observable<any> = this.http.get(url);
    return data;
  }
}
