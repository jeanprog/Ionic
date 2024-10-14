export class Produto {
  constructor(
    public iCodProduto: number,
    public imagem: string | null,
    public nQtdAtual: number,
    public nValUnit: number,
    public sCodProduto: string,
    public sDscProduto: string,
    public sRefAlternativa: string,
    public sRefBasica: string,
    public sRefFornecedor: string,
    public sRefProduto: string
  ) {}
}
