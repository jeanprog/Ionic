import { Observable } from 'rxjs';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';

export default interface preVendaGateway {
  listarTodasAsPreVendas(): Observable<PreVenda[]>;
  listarPreVendasVendedor(iCodVendedor: number): Observable<PreVenda[]>;

  salvarPreVenda(preVenda: PreVenda): Observable<PreVenda>;

  alterarPreVenda(preVenda: PreVenda): Observable<PreVenda>;
}
