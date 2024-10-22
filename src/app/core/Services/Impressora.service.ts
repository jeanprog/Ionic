import { Observable } from 'rxjs';
import {
  IMPRESSORA_GATEWAY,
  ImpressoraGateway,
} from 'src/app/data/interfaces/ImpressoraGateway';
import { Impressora } from '../entities/Impressora.entity';
import { Inject, Injectable } from '@angular/core';
import { PreVenda } from '../entities/PreVenda.entity';

@Injectable({
  providedIn: 'root',
})
export class ImpressoraService {
  constructor(
    @Inject(IMPRESSORA_GATEWAY) private impressoraGateway: ImpressoraGateway
  ) {}

  obterImpressora(): Observable<Impressora[]> {
    return this.impressoraGateway.obterImpressora();
  }
  onImprimirPreVenda(preVenda: PreVenda) {
    return this.impressoraGateway.onImprimirPreVenda(preVenda);
  }
}
