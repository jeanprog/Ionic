import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { PreVendaService } from './core/Services/PreVendaservice';

// Importe os ícones que você deseja usar
library.add(fas, fab);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  providers: [AuthService],
  imports: [IonicModule, HttpClientModule, CommonModule, FontAwesomeModule],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn!: boolean;
  subscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        console.log(isLoggedIn);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
