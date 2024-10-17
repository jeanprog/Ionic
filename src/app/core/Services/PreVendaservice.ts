import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PreVenda } from '../entities/PreVenda.entity';

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

  calcularTotalVenda(
    preVenda: PreVenda,
    selectValorDesc: { tipo: string; desconto: number },
    percentMaxDesc: number,
    sFlgDecimalQtdProd: string
  ) {
    let valorTotalProdutos = this.RetornarValorTotalProdutos(preVenda);
    let valorTotalTroca = this.RetornaValorTotalTroca(preVenda);

    let valorFinal = this.calcularDiferencaValores(
      valorTotalProdutos,
      valorTotalTroca
    );

    if (preVenda.nValDesconto > 0) {
      valorFinal = this.aplicarDesconto(valorFinal, preVenda.nValDesconto);
    }

    if (sFlgDecimalQtdProd === 'S') {
      console.log('Cálculo para balança digital', valorTotalProdutos);
    }

    valorFinal = this.aplicarDescontoSelecionado(
      valorFinal,
      selectValorDesc,
      percentMaxDesc,
      valorTotalProdutos
    );

    return {
      valorFinal,
      valorTotalTroca,
      valorTotalProdutos,
    };
  }

  private calcularDiferencaValores(
    valorProdutos: number,
    valorTroca: number
  ): number {
    return Math.abs(valorProdutos - valorTroca);
  }

  private aplicarDesconto(valor: number, desconto: number): number {
    return valor - desconto;
  }

  private aplicarDescontoSelecionado(
    valorFinal: number,
    selectValorDesc: { tipo: string; desconto: number },
    percentMaxDesc: number,
    valorTotalProdutos: number
  ): number {
    if (!selectValorDesc) {
      return valorFinal;
    }

    if (selectValorDesc.tipo === 'valor') {
      return valorFinal - selectValorDesc.desconto;
    } else if (selectValorDesc.tipo === 'porcentagem') {
      const valorDescontoMaximo = (percentMaxDesc / 100) * valorTotalProdutos;
      const descontoConvertido = (selectValorDesc.desconto / 100) * valorFinal;
      // math.min retorna o menor numero aplicando a regra do desconto permitido
      return valorFinal - descontoConvertido;
    }

    return valorFinal;
  }

  RetornarValorTotalProdutos(preVenda: PreVenda): number {
    let valorTotal = 0;

    preVenda.listaPrevendaItem.forEach((item) => {
      item.nValTot = item.nValUnit * item.nQtdProduto;
      valorTotal += item.nValTot;
    });

    console.log('Valor total dos produtos:', valorTotal);
    return valorTotal;
  }

  private RetornaValorTotalTroca(preVenda: PreVenda): number {
    let valor = 0;
    preVenda.listaPrevendaItemTroca.forEach((element) => {
      element.nValTot = element.nValUnit * element.nQtdProduto;
      valor += element.nValTot;
    });
    return valor;
  }

  VerificaDesconto(
    nValDesconto: number,
    openedFromModal: boolean
  ): { desconto: number; descontoAplicado: boolean } {
    let descontoAplicado = nValDesconto > 0;
    // corrigir essa logica amanha
    if (descontoAplicado === true && openedFromModal === true) {
      console.log('Discount removed because modal is open');
      return { desconto: 0, descontoAplicado: false };
    }
    console.log(' passei nessa ', nValDesconto, descontoAplicado);
    return { desconto: nValDesconto, descontoAplicado };
  }
}
