// domain/entities/Loja.ts
import { ParametrosLoja } from './ParametrosLoja.entity';

export class Loja {
  constructor(
    public iCaixaAberto: number,
    public iCodCaixa: number,
    public iCodFunc: number,
    public iCodLoja: number,
    public iCodVendedorPadrao: number,
    public iFlgTipoValidacaoCadastroCliente: number,
    public iQtdDigCodSequencial: number,
    public idLogin: number,
    public sApelido: string | null,
    public sCidade: string | null,
    public sEstado: string | null,
    public sFlgAssociarVendedor: number,
    public sLogin: string,
    public sSenha: string,
    public sVendedor: string | null,
    public parametros: ParametrosLoja
  ) {}
}
