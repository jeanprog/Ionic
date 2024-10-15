import { Injectable } from '@angular/core';
import { Loja } from '../core/entities/Loja.entity';
import { throwError } from 'rxjs';
import { ParametrosLoja } from '../core/entities/ParametrosLoja.entity';

@Injectable({
  providedIn: 'root',
})
export class LojaConfig {
  vendedorPadrao: boolean = false;
  UserPrinter: boolean = false;

  constructor() {}

  public getConfigLoja() {
    const infoConfig = localStorage.getItem('config');

    if (infoConfig) {
      const config = JSON.parse(infoConfig);

      this.vendedorPadrao = config.sellerDefault;
      return config;
    }
    return console.log('sem informações de loja');
  }

  public getParamsLoja() {
    const parametros = localStorage.getItem('LOJA');
    if (parametros) {
      const parametrosLoja = JSON.parse(parametros);

      return parametrosLoja;
    }
  }

  public setParametrosLoja(parametrosLoja: Loja) {
    if (!parametrosLoja) {
      console.log('sem acesso aos parametros de loja');
    }

    const paramSellerDefault = parametrosLoja.parametros.iCodVendedorPadrao;
    // configurando se a loja está com vendedor padrão com isso a escolha de como será o parametro do icodvendedor no json de parametros da loja
    if (paramSellerDefault > 0) {
      localStorage.setItem('LOJA', JSON.stringify(parametrosLoja));
    }

    if (this.vendedorPadrao === true) {
      console.log(parametrosLoja.iCodFunc);
      let iCodFunc = parametrosLoja.iCodFunc;
      parametrosLoja.iCodVendedorPadrao = iCodFunc;
      localStorage.setItem('LOJA', JSON.stringify(parametrosLoja));
    } else {
      console.log(parametrosLoja);
      localStorage.setItem('LOJA', JSON.stringify(parametrosLoja));
    }
  }
  public setConfigLoja(config: Loja) {
    localStorage.setItem('config', JSON.stringify(config));
  }

  verificaCaixaAberto(parametrosLoja: Loja) {
    if (ParametrosLoja) {
      const iQtdDispositivos = parametrosLoja.parametros.iQtdDispositivos;
      if (iQtdDispositivos > 0 && parametrosLoja.iCodCaixa > 0) {
        return 1;
      } else {
        if (parametrosLoja.iCodCaixa <= 0) {
          localStorage.removeItem('LOJA');
          return 2;
        }
      }
    }
    return;
  }

  existPrinterUser() {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.UserPrinter = config.preSales;
    }
    return this.UserPrinter;
  }
}
