import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';
import { PreVendaHttpRepository } from 'src/app/data/repositores/PreVenda-http.repository.ts';

@Injectable({
  providedIn: 'root',
})
export class PreVendaService {
  constructor(private preVendaHttp: PreVendaHttpRepository) {}

  listarTodasPreVenda() {
    return this.preVendaHttp.listarTodasAsPreVendas();
  }

  listarPreVendasVendedor(icodVendedor: number) {
    return this.preVendaHttp.listarPreVendasVendedor(icodVendedor);
  }
}
