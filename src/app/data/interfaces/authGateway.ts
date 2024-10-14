import { Observable } from 'rxjs';
import { Loja } from 'src/app/core/entities/Loja.entity';

export default interface authGateway {
  autenticarUsuario(login: string, senha: string): Observable<Loja[]>;
}
