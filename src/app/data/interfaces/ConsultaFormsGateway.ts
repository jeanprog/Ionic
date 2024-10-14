import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export default interface ConsultaFormsGateway {
  consultaCpf(cpf: string): Observable<number>;
  getMunicipios(uf: string): Observable<any[]>;
  consultarCep(uf: string, cep: string): Observable<any>;
}
