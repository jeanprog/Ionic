import { Observable } from 'rxjs';

import { ClientesHttpRepository } from 'src/app/data/repositores/clientesHttp.respository';
import { Injectable } from '@angular/core';
import { Clientes } from '../entities/Clientes.entity';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private clienteHttp: ClientesHttpRepository) {}
  criarCliente(cliente: Clientes): Observable<Clientes> {
    return this.clienteHttp.criarCliente(cliente);
  }
  listarTodosOsClientes(
    inputClient: string,
    sFitrar: string,
    stipo: string
  ): Observable<Clientes[]> {
    return this.clienteHttp.listarTodosOsClientes(inputClient, sFitrar, stipo);
  }

  escolhaFiltro(option: string): string {
    switch (option) {
      case 'Nome':
        return 'P.sNomePessoa';
      case 'Cpf':
        return 'PF.sCPF';
      case 'CNPJ':
        return 'PJ.sCNPJ';
      case 'Código':
        return 'P.sCodPessoa';
      case 'Código personalizado':
        return 'sCodigoPersonalizado';
      case 'Email':
        return 'sEmail';
      default:
        return '';
    }
  }
}
