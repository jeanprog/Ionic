import preVendaGateway from '../interfaces/PreVendaGateway';
import { PreVenda } from 'src/app/core/entities/PreVenda.entity';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository {
  private ipServer!: string;
  private lojaConfig = inject(LojaConfig);

  constructor(private http: HttpClient) {
    const configData = this.lojaConfig.getConfigLoja();
    if (configData) {
      this.ipServer = configData.ip;
    } else {
      console.error(' não foi possível obter as configurações da loja');
      this.ipServer = 'default_ip';
    }
  }

  autenticaUsuario(login: string, senha: string) {
    console.log(this.ipServer);
    return this.http.get(
      `http://${this.ipServer}/api/login?usuario=${login}&senha=${senha}`
    );
  }
}
