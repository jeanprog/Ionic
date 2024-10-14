// domain/entities/ParametrosLoja.ts
export class ParametrosLoja {
  constructor(
    public codigoEmpresa: number,
    public iCodLoja: number,
    public iCodRede: number,
    public iCodVendedorPadrao: number,
    public iQtdDispositivos: number,
    public iflgcamposobrigatorios: number,
    public nPercMaxDesc: number,
    public sApelidoVendedorPadrao: string | null,
    public sCidade: string | null,
    public sDscLoja: string,
    public sDscRede: string,
    public sEstado: string | null,
    public sFlgAssociarVendedor: string,
    public sFlgDecimalQtdProd: string,
    public sFlgValidarEstoque: string
  ) {}
}
