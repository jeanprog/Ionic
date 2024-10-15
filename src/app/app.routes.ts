import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/signin/inicio.page').then((m) => m.InicioPage),
  },

  {
    path: 'base-costumer',
    loadComponent: () =>
      import('./pages/base-costumer/base-costumer.page').then(
        (m) => m.BaseCostumerPage
      ),
  },
  {
    path: 'customer-list',
    loadComponent: () =>
      import('./pages/customer-list/customer-list.page').then(
        (m) => m.CustomerListPage
      ),
  },
  {
    path: 'product-query',
    loadComponent: () =>
      import('./pages/product-query/product-query.page').then(
        (m) => m.ProductQueryPage
      ),
  },
  {
    path: 'before-sales',
    loadComponent: () =>
      import('./pages/before-sales/before-sales.page').then(
        (m) => m.BeforeSalesPage
      ),
  },
  {
    path: 'exchange-ticket',
    loadComponent: () =>
      import('./pages/exchange-ticket/exchange-ticket.page').then(
        (m) => m.ExchangeTicketPage
      ),
  },
  {
    path: 'printer-registration',
    loadComponent: () =>
      import('./pages/printer-registration/printer-registration.page').then(
        (m) => m.PrinterRegistrationPage
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'attendance-cart',
    loadComponent: () =>
      import('./pages/attendance-cart/attendance-cart.page').then(
        (m) => m.AttendanceCartPage
      ),
  },
  {
    path: 'modal-select-seller',
    loadComponent: () =>
      import('./components/modal-select-seller/modal-select-seller.page').then(
        (m) => m.ModalSelectSellerPage
      ),
  },
  {
    path: 'modal-desconto',
    loadComponent: () =>
      import('./components/modal-desconto/modal-desconto.page').then(
        (m) => m.ModalDescontoPage
      ),
  },
  {
    path: 'modal-qtd-fracionada',
    loadComponent: () =>
      import(
        './components/modal-qtd-fracionada/modal-qtd-fracionada.page'
      ).then((m) => m.ModalQtdFracionadaPage),
  },
  {
    path: 'modal-ticket-troca',
    loadComponent: () =>
      import('./components/modal-ticket-troca/modal-ticket-troca.page').then(
        (m) => m.ModalTicketTrocaPage
      ),
  },
];
