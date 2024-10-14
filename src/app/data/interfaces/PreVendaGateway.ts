import { Observable } from 'rxjs';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';

export default interface preVendaGateway {
  adicionarPreVenda(): Observable<PreVenda>;

  listarTodasAsPreVendas(): Observable<PreVenda[]>;
  listarPreVendasVendedor(iCodVendedor: number): Observable<PreVenda[]>;

  alterarPreVenda(): Observable<PreVenda>;
}
