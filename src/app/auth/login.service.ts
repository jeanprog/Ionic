import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginData: any; // Variável privada para armazenar os dados de login

  constructor() {
    const storedLoginData = localStorage.getItem('LOJA');
    this.loginData = storedLoginData ? JSON.parse(storedLoginData) : null;
  }

  getLoginData(): any {
    console.log(this.loginData);
    return this.loginData;
  }
}
