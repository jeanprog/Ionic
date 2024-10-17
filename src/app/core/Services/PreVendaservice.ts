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

  addQuantidade(
    iCodProduto: number,
    preVenda: PreVenda,
    openedFromModal: boolean,
    limparDesconto: boolean
  ) {
    console.log(preVenda.nValDesconto, 'teste aqui');
    // Remove o desconto se estiver abrindo a partir do modal
    if (preVenda.nValDesconto > 0) {
      console.log('caindo sempre no mesmo lugar ');
      preVenda.nValDesconto = 0;
      limparDesconto = true;
      this.calcularTotalVenda(
        preVenda,
        { tipo: '', desconto: 0 },
        preVenda.sFlgDecimalQtdProd
      );

      console.log('Desconto removido na adição de quantidade');
    } else {
      limparDesconto === false;
    }

    // Atualiza a quantidade do produto específico
    preVenda.listaPrevendaItem.forEach((preVendaItem: PreVendaItem) => {
      if (preVendaItem.iCodProduto === iCodProduto) {
        preVendaItem.nQtdProduto += 1;
      }
    });

    // Atualiza o total de produtos
    this.RetornarValorTotalProdutos(preVenda);

    // Retorna o estado atualizado
    return { preVenda, limparDesconto };
  }

  async removeQuantidade(
    iCodProduto: number,
    preVenda: PreVenda,
    index: number,
    openedFromModal: boolean,
    descontoAplicado: boolean
  ): Promise<{ preVenda: PreVenda; descontoAplicado: boolean }> {
    // Se houver desconto e o modal estiver aberto, reseta o desconto
    if (preVenda.nValDesconto > 0 && openedFromModal) {
      preVenda.nValDesconto = 0;
      descontoAplicado = false;
      console.log('Desconto removido na remoção de quantidade');
    }

    // Verifica se o produto existe na lista e ajusta a quantidade
    for (const element of preVenda.listaPrevendaItem) {
      if (element.iCodProduto === iCodProduto) {
        if (element.nQtdProduto > 1) {
          element.nQtdProduto -= 1; // Reduz a quantidade
        } else if (element.nQtdProduto === 1) {
          // Produto com 1 unidade, precisa ser removido (interação com UI deve acontecer na página)
          return { preVenda, descontoAplicado }; // Retorna aqui para remover na página
        }
      }
    }

    // Atualiza o total de produtos e recalcula o total da venda
    this.RetornarValorTotalProdutos(preVenda);
    this.calcularTotalVenda(
      preVenda,
      { tipo: '', desconto: 0 },
      preVenda.sFlgDecimalQtdProd
    );

    // Retorna o estado atualizado
    return { preVenda, descontoAplicado };
  }

  calcularTotalVenda(
    preVenda: PreVenda,
    selectValorDesc: { tipo: string; desconto: number },

    sFlgDecimalQtdProd: string
  ) {
    let valorTotalProdutos = this.RetornarValorTotalProdutos(preVenda);
    let valorTotalTroca = this.RetornaValorTotalTroca(preVenda);

    let valorFinal = this.calcularDiferencaValores(
      valorTotalProdutos,
      valorTotalTroca
    );
    console.log('state', selectValorDesc?.desconto);
    if (selectValorDesc?.desconto > 0) {
      valorFinal = this.aplicarDescontoSelecionado(
        valorFinal,
        selectValorDesc,
        valorTotalProdutos
      );
      preVenda.nValDesconto = valorTotalProdutos - valorFinal;
      console.log(preVenda.nValDesconto);
    }

    if (sFlgDecimalQtdProd === 'S') {
      console.log('Cálculo para balança digital', valorTotalProdutos);
    }

    /*     valorFinal = PreVenda.nValVenda;
     */
    console.log(valorFinal, 'verificando a saida aqui ');
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
    return valorProdutos - valorTroca;
  }

  private aplicarDesconto(valor: number, desconto: number): number {
    return valor - desconto;
  }

  private aplicarDescontoSelecionado(
    valorFinal: number,
    selectValorDesc: { tipo: string; desconto: number },
    valorTotalProdutos: number
  ): number {
    if (!selectValorDesc) {
      return valorFinal;
    }

    if (selectValorDesc.tipo === 'valor') {
      return valorTotalProdutos - selectValorDesc.desconto;
    } else if (selectValorDesc.tipo === 'porcentagem') {
      const descontoConvertido = (selectValorDesc.desconto / 100) * valorFinal;

      return valorTotalProdutos - descontoConvertido;
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

  verificaDescontoPermitido(
    valorDescontoMaximo: number,
    descontoConvertido: number
  ) {
    if (valorDescontoMaximo > descontoConvertido) {
      return true;
    }
    return false;
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
