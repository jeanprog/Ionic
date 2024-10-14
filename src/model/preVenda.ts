import { PreVendaItem } from './PreVendaItem';
import { ItemTroca } from './itemTroca';

export class PreVenda {
  sNomePessoa!: string | null;
  iCodVenda!: number;
  iSeqVendaDia!: number;
  iCodLoja!: number;
  iCodCaixa!: number;
  iCodOperador!: number | null;
  iCodVendedor!: number | null;
  sCodPessoa!: string | null;
  nValVenda!: number;
  nValTroca!: number;
  nValDesconto!: number;
  sApelido!: string;
  sCaminhoImpressora!: string;
  DatCri!: string;
  iModelo!: number;
  iTipo!: number;
  sFlgDecimalQtdProd!: string;
  sFlgTipoPreVenda!: string;
  nValVale!: number;
  iImprimirPreVenda!: number;
  listaPrevendaItem!: Array<PreVendaItem>;
  listaPrevendaItemTroca!: Array<ItemTroca>;
  sNomeCliente!: string | null;
}
