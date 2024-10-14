import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from 'src/app/core/entities/produto.entity';
import ProdutoHttpRepository from 'src/app/data/repositores/ProdutoHttp.repository';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  constructor(private produtoHttp: ProdutoHttpRepository) {}

  pesquisarProdutos(
    sFiltrar: string,
    sTipo: string,
    sCampo: string
  ): Observable<Produto[]> {
    return this.produtoHttp.pesquisarProdutos(sFiltrar, sTipo, sCampo);
  }
}
