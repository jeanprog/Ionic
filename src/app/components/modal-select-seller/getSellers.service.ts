import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private apiUrl!: string;
  ipServer!: string;

  constructor(private http: HttpClient) {}

  setApiUrl(icodLoja: number): void {
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;
      this.apiUrl = `http://${this.ipServer}/api/Vendedor?iCodLoja=${icodLoja}`;
    }
  }

  getSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data: any) => {
        console.log('Dados da API:', data);
      })
    );
  }
}
