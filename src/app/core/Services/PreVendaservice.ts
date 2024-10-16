import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';
import { PreVendaHttpRepository } from 'src/app/data/repositores/PreVenda-http.repository.ts';
import { PreVendaitemHttpRepository } from 'src/app/data/repositores/prevendaItemHttp.resposiry';
import { PreVendaItem } from '../entities/preVendaItem.entity';

@Injectable({
  providedIn: 'root',
})
export class PreVendaService {
  constructor(
    private preVendaHttp: PreVendaHttpRepository,
    private PreVendaItemHttp: PreVendaitemHttpRepository
  ) {}

  listarTodasPreVenda() {
    return this.preVendaHttp.listarTodasAsPreVendas();
  }

  listarPreVendasVendedor(icodVendedor: number) {
    return this.preVendaHttp.listarPreVendasVendedor(icodVendedor);
  }
  BuscarPreVendaItem(sRef: string) {
    return this.PreVendaItemHttp.buscarPreVendaItem(sRef);
  }
  atualizarListaPreVenda(
    preVendaItems: PreVendaItem[],
    newItem: PreVendaItem
  ): PreVendaItem[] {
    let itemExiste = false;

    preVendaItems.forEach((item) => {
      if (item.iCodProduto === newItem.iCodProduto) {
        item.nQtdProduto += 1;
        itemExiste = true;
      }
    });

    if (!itemExiste) {
      newItem.nQtdProduto = 1;
      preVendaItems.push(newItem);
    }

    return preVendaItems;
  }

  RetornarValorTotalProdutos(preVendaItems: PreVendaItem[]): number {
    let valorTotal = 0;

    preVendaItems.forEach((item) => {
      item.nValTot = item.nValUnit * item.nQtdProduto;
      valorTotal += item.nValTot;
    });

    console.log('Valor total dos produtos:', valorTotal);
    return valorTotal;
  }
}
