export class Clientes {
  constructor(
    public sCPFCNPJ: string,
    public sCodPessoa: string | null,
    public sCodPessoaTitular: string | null,
    public sCodigoPersonalizado: string | null,
    public sEmail: string | null,
    public sFlgSituacao: string | null,
    public sFlgTpPessoa: string | null,
    public sNomeCliente: string,
    public sNumDocEstrangeiro: string | null,
    public sRazSoc: string | null,
    public sTel1: string | null,
    public sTelContato: string | null
  ) {}
}
