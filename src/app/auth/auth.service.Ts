import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LojaConfig } from "./Lojasconfig.service";
import { AuthHttpRepository } from "../data/repositores/Auth-http.repository";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  constructor(private authHttp: AuthHttpRepository) {}
  ipServer!: string;

  autenticarUsuario(login: string, senha: string): Observable<any> {
    return this.authHttp.autenticaUsuario(login, senha).pipe(
      tap((response: any) => {
        console.log(response);
        if (response != null) {
          this.isLoggedInSubject.next(true);
          console.log(this.isLoggedInSubject.value);
        }
      })
    );
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
  setIsLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
    console.log(this.isLoggedInSubject.value);
  }
}
