import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonModal,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { cpfMask } from 'src/app/utils/mask-cpf';
import { cepMask } from 'src/app/utils/mask-cep';
import { HttpClientModule } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { LoginService } from './../../auth/login.service';
import { DateModalComponent } from 'src/app/components/date-modal/date-modal.page';
import { formatDateToYYYYMMDD } from 'src/app/utils/formatDate';
import { presentToast } from 'src/app/components/toastError';
import { LoadingService } from 'src/app/components/loading';
import { consultaFormsService } from 'src/app/core/Services/consultaForms.service';
import { LojaConfig } from 'src/app/auth/Lojasconfig.service';
import { ClienteService } from 'src/app/core/Services/Clientes.service';

@Component({
  selector: 'app-base-costumer',
  templateUrl: './base-costumer.page.html',
  styleUrls: ['./base-costumer.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class BaseCostumerPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  cpf: string = '';
  cep: string = '';
  sUF: string = '';
  sSexo: string = 'Masculino';
  consultaCep = {};
  estados!: Observable<any[]>;
  municipios: any[] = [];
  formCadastroCliente!: FormGroup;
  loginData: any;
  sMunicipio!: string;
  cpfExist!: boolean;
  date!: string;
  private readonly loadingMessage = 'Carregando Municípios';

  constructor(
    public router: Router,
    private formsService: consultaFormsService,
    private fb: FormBuilder,
    private LoginService: LoginService,
    private modalController: ModalController,
    private toastController: ToastController,
    private clienteService: ClienteService,
    private loadingService: LoadingService,
    private lojaconfig: LojaConfig
  ) {}

  ngOnInit() {
    this.obterEstados();
    this.loginData = this.LoginService.getLoginData();
    this.sUF = this.loginData.parametros.sEstado;
    this.sMunicipio = this.loginData.parametros.sCidade;

    this.initForm();
    this.formCadastroCliente.disable();
    this.formCadastroCliente.get('sCPF')?.enable();

    if (this.sUF !== '') {
      this.fetchMunicipalities(this.sUF).subscribe({
        next: (datamunicipios) => {
          this.municipios = datamunicipios;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  async openDateModal() {
    const modal = await this.modalController.create({
      component: DateModalComponent,
      cssClass: 'customModal',
    });

    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        console.log('Data selecionada do metodobase:', data.data);
        this.formCadastroCliente.patchValue({
          dNascimento: data.data,
        });
      }
    });

    return await modal.present();
  }

  initForm() {
    this.formCadastroCliente = this.fb.group({
      sNomePessoa: ['', Validators.required],
      sFlgTipoPessoa: ['Física'],
      dNascimento: [null, Validators.required],
      sCPF: ['', Validators.required],
      sSexo: ['Masculino'],
      dAbertura: [''],
      iCodLojaCadastro: [''],
      sLogradouro: [''],
      sNumero: [''],
      sComplemento: [''],
      sBairro: [''],
      sMunicipio: [this.sMunicipio],
      //IDMunicipioIBGE : '',
      sUF: [this.sUF],
      //sCodPais   : '',
      sCNPJ: [''],
      sCEP: [''],
      sDDD: [''],
      sNumeroTelefone: ['', Validators.required],
      sRazaoSocial: [''],
      sEmail: ['', Validators.required],
      sTipoDocumento: [''],
      sNumeroDocumento: [''],
    });
  }
  aplicarMascaraCPF() {
    const cpfControl = this.formCadastroCliente.get('sCPF');
    if (cpfControl) {
      const cpf = cpfControl.value;
      if (cpf) {
        const maskedCpf = cpfMask(cpf);
        cpfControl.patchValue(maskedCpf, { emitEvent: false });
      }
    }
  }
  aplicarMascaraCep() {
    const cepControl = this.formCadastroCliente.get('sCEP');
    if (cepControl) {
      const cep = cepControl.value;
      if (cep) {
        const maskedCep = cepMask(cep);
        cepControl.patchValue(maskedCep, { emitEvent: false });
      }
    }
  }

  // Método para verificar o CPF
  checkCpf(event: any) {
    const cpf = event.detail.value.replace(/[.-]/g, '');
    this.formsService.consultarCpf(cpf).subscribe({
      next: (data) => {
        if (data === 1) {
          console.log('CPF cadastrado');
          this.cpfExist === true;
          /* 05187686780 cpf no banco pra teste */
          this.formCadastroCliente.disable();
          this.formCadastroCliente.get('sCPF')?.enable();
          presentToast(this.toastController, 'CPF JÁ CADASTRADO', 'top');
        } else {
          console.log('CPF não cadastrado');
          this.cpfExist === false;
          this.formCadastroCliente.enable();
        }
      },
    });
  }
  obterEstados() {
    this.estados = this.formsService.loadStates();
    this.estados.subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  fetchMunicipalities(sUF: string): Observable<any[]> {
    return this.formsService.getMunicipios(sUF).pipe(
      catchError((error) => {
        console.log('Error ao carregar municípios:', error);
        presentToast(
          this.toastController,
          'Erro no carregamento dos municípios',
          'bottom'
        );
        return of([]);
      })
    );
  }

  onLoadCep(event: any) {
    this.cep = event.detail.value;
    let cepValue = this.cep.replace(/-/g, '');

    if (this.sUF && cepValue) {
      this.formsService.consultarCep(this.sUF, cepValue).subscribe(
        (data) => {
          console.log('resultado ok da chamada de cep', data);
          if (data) {
            const response = data[0];
            this.formCadastroCliente.patchValue({
              sUF: response.sUf,
              sMunicipio: response.sLocalidade,
              sBairro: response.sBairro,
              sLogradouro: response.sRua,
            });
          } else {
            presentToast(this.toastController, 'cep não encontrado', 'top');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.formCadastroCliente.get('sUF')?.enable();
      this.formCadastroCliente.get('sMunicipio')?.enable();
      this.formCadastroCliente.get('sBairro')?.enable();
      this.formCadastroCliente.get('sLogradouro')?.enable();
      this.formCadastroCliente.patchValue({
        sUF: '',
        sMunicipio: '',
        sBairro: '',
        sLogradouro: '',
      });
    }
  }

  async onSelectChange(event: any) {
    this.sUF = event.detail.value;
    const loadingMessage = 'Carregando Municipios';
    const loading = await this.loadingService.showLoading(loadingMessage);

    if (this.sUF !== 'RJ') {
      this.formsService.getMunicipios(this.sUF).subscribe({
        next: (datamunicipios) => {
          console.log('Municípios carregados:', datamunicipios);
          this.loadingService.dismissLoading(loading);
          this.municipios = datamunicipios;
        },
        error: (error) => {
          presentToast(
            this.toastController,
            'Error no carregamento dos municípios',
            'bottom'
          );
        },
      });
    } else {
      this.fetchMunicipalities(this.sUF).subscribe({
        next: (datamunicipios) => {
          console.log('aqui carregou de volta o RJ', datamunicipios);
          this.loadingService.dismissLoading(loading);
          this.municipios = datamunicipios;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  async submitClient() {
    const loading = await this.showLoading('Enviando registro');
    const { sNomePessoa, sCPF, dNascimento } = this.formCadastroCliente.value;
    const iCodLoja = this.getLojaCode();

    if (!this.validateForm(sNomePessoa, sCPF, loading)) return;

    const formData = this.criarFormData({
      ...this.formCadastroCliente.value,
      dNascimento,
      iCodLoja,
    });
    this.salvarCliente(formData, loading);
  }

  private async showLoading(message: string) {
    return await this.loadingService.showLoading(message);
  }

  private getLojaCode(): number {
    return this.lojaconfig.getParamsLoja().parametros.iCodLoja;
  }

  private validateForm(
    sNomePessoa: string,
    sCPF: string,
    loading: any
  ): boolean {
    if (!sNomePessoa || !sCPF) {
      if (!sNomePessoa) this.showToast('O campo nome não pode ser em branco');
      if (!sCPF) this.showToast('O campo CPF não pode ser em branco');
      this.loadingService.dismissLoading(loading);
      return false;
    }
    return true;
  }

  private criarFormData(data: any): any {
    return {
      ...data,
      dNascimento: data.dNascimento
        ? formatDateToYYYYMMDD(data.dNascimento)
        : null,
      iCodLojaCadastro: data.iCodLoja,
    };
  }

  private salvarCliente(formData: any, loading: any) {
    this.clienteService.criarCliente(formData).subscribe({
      next: () => this.handleSuccess(loading),
      error: (error) => this.handleError(loading, error),
    });
  }

  private handleSuccess(loading: any) {
    this.loadingService.dismissLoading(loading);
    this.showToast('Cliente cadastrado com sucesso');
    this.resetForm();
  }

  private handleError(loading: any, error: any) {
    this.loadingService.dismissLoading(loading);
    console.error('Erro ao salvar cliente:', error);
    this.showToast('Erro ao cadastrar cliente');
  }

  private showToast(message: string) {
    presentToast(this.toastController, message, 'top');
  }

  private resetForm() {
    this.formCadastroCliente.reset();
    this.formCadastroCliente.disable();
    this.formCadastroCliente.get('sCPF')?.enable();
  }
}
