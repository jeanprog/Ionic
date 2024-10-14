import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { format } from 'date-fns';



@Component({
  selector: 'app-list-products',
  templateUrl: './list-preVenda.page.html',
  styleUrls: ['./list-preVenda.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
 
  
})
export class ListProductsPage implements OnInit {

  allPreVenda: any[] = [];
  preVenda: any[] = [];
  subscription!: Subscription ;
  filtro: string = '';
  isLoggedIn!: boolean;
   

  constructor(
    private http: HttpClient,
    public menuCtrl: MenuController,
    public AuthService: AuthService
     
    
  ) { }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  }
  formatNumber(value: number): string {
    return value.toFixed(2); // Define 2 casas decimais
  }

  ngOnInit(): void {
    // Aqui você pode acessar o usuário autenticado ou quaisquer informações relevantes se necessário
    // this.authService.getUser();
      this.menuCtrl.enable(true);
      this.AuthService.setIsLoggedIn(true);
      
        // Outras ações que você precisa realizar quando o estado de autenticação é atualizado
      
     
    // Faça a requisição GET para obter todos os produtos
    this.subscription = this.http.get<any[]>('http://localhost:8081/api/prevenda').subscribe(
      data => {
        this.allPreVenda = data;
        console.log(this.allPreVenda)
        this.filtrarProdutos();
        
      },
      error => {
        console.log(error);
      }
    );
  }

  filtrarProdutos(): void {
    // Implemente sua lógica de filtro aqui
    // Por exemplo, filtrar por referência ou descrição

    if (this.filtro.trim() !== '') {
      this.preVenda = this.allPreVenda.filter(prevenda =>
        prevenda.sNomeCliente.toLowerCase().includes(this.filtro.toLowerCase())  
        
      );
    } else {
      this.preVenda = this.allPreVenda
    }
  }
  


  ngOnDestroy(): void {
    // Certifique-se de cancelar a assinatura para evitar vazamentos de memória
    this.subscription.unsubscribe();
  }
}
