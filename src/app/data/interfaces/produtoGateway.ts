import { Observable } from 'rxjs';
import { Produto } from 'src/app/core/entities/produto.entity';

export default interface ProdutoGateway {
  pesquisarProdutos(
    sFiltrar: string,
    sTipo: string,
    sCampo: string
  ): Observable<Produto[]>;
}
