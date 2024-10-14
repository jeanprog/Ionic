import { Observable } from 'rxjs';

export interface AcessoMobileGateway {
  consultaAcessoMobile(): Observable<number>;
}
