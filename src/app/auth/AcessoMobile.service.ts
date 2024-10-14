import { Injectable } from '@angular/core';
import { AcessoMobileHttpRepository } from '../data/repositores/AcessoMobileHttp.repository';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class AcessoMobileService {
  constructor(private mobileHttp: AcessoMobileHttpRepository) {}
  consultaMobileService(): Observable<number> {
    return this.mobileHttp.consultaAcessoMobile();
  }
}
