// comentário testando o principio dip de inversão de dependencia

import { Observable } from 'rxjs';
import { Loja } from 'src/app/core/entities/Loja.entity';

import { Impressora } from 'src/app/core/entities/Impressora.entity';
import { InjectionToken } from '@angular/core';

export const IMPRESSORA_GATEWAY = new InjectionToken<ImpressoraGateway>(
  'ImpressoraGateway'
);

export interface ImpressoraGateway {
  obterImpressora(): Observable<Impressora[]>;
}
