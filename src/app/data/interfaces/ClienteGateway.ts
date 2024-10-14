import { Observable } from 'rxjs';
import { Clientes } from 'src/app/core/entities/Clientes.entity';

export default interface ClienteGateway {
  criarCliente(cliente: Clientes): Observable<Clientes>;
  listarTodosOsClientes(
    inputClient: string,
    sFitrar: string,
    stipo: string
  ): Observable<Clientes[]>;
}
