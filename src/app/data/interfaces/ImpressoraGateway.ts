// comentário testando o principio dip de inversão de dependencia

import { Observable } from 'rxjs';

import { Impressora } from 'src/app/core/entities/Impressora.entity';
import { InjectionToken } from '@angular/core';
import { PreVenda } from 'src/model/preVenda';

export const IMPRESSORA_GATEWAY = new InjectionToken<ImpressoraGateway>(
  'ImpressoraGateway'
);

export interface ImpressoraGateway {
  obterImpressora(): Observable<Impressora[]>;
  onImprimirPreVenda(preVenda: PreVenda): Observable<Impressora>;
}
