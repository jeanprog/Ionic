import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { consultaFormsHttp } from 'src/app/data/repositores/ConsultasForms.respository';

@Injectable({
  providedIn: 'root',
})
export class consultaFormsService {
  ipServer!: string;

  constructor(private formsHttp: consultaFormsHttp) {}

  consultarCpf(cpf: any): Observable<number> {
    return this.formsHttp.consultaCpf(cpf);
  }

  loadStates(): Observable<any[]> {
    return this.formsHttp.loadStates();
  }

  getMunicipios(uf: string): Observable<any[]> {
    return this.formsHttp.getMunicipios(uf);
  }
  consultarCep(uf: string, cep: string): Observable<any> {
    return this.formsHttp.consultarCep(uf, cep);
  }
}
