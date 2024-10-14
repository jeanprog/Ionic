import { Observable } from 'rxjs';
import { PreVendaItem } from 'src/model/PreVendaItem';

export interface PreVendaItemGateway {
  adicionarPreVendaItem(): Observable<PreVendaItem>;
  alterarPreVendaItem(): Observable<PreVendaItem>;
  consultarPreVendaItem(): Observable<PreVendaItem>;
  listarPreVendaItem(): Observable<PreVendaItem[]>;
  excluirPreVendaItem(): Observable<PreVendaItem>;
}
