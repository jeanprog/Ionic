import { Observable } from 'rxjs';
import { PreVendaItem } from 'src/model/PreVendaItem';

export interface PreVendaItemGateway {
  buscarPreVendaItem(sRef: string): Observable<PreVendaItem>;
}
