import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonModal, IonicModule, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/auth/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-printer-registration',
  templateUrl: './printer-registration.page.html',
  styleUrls: ['./printer-registration.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class PrinterRegistrationPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  iCodLoja!: number;
  iCodImpressora!: number;
  printers: any[] = [];
  formCadastroImpressora!: FormGroup;
  iTipoSelected!: string;
  iModeloSelected!: string;
  items!: {};
  ipServer!: string;

  constructor(
    private loginService: LoginService,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastController: ToastController,
    public router: Router
  ) {}

  ngOnInit() {
    this.getImpressoras();
    this.initializeForm();
    const loginData = this.loginService.getLoginData();
    console.log(loginData.parametros.iCodLoja);
  }

  getImpressoras() {
    const loginData = this.loginService.getLoginData();
    console.log(loginData);
    const infoConfig = localStorage.getItem('config');

    if (loginData) {
      this.iCodLoja = loginData.parametros.iCodLoja;
    }

    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;

      const url = `http://${this.ipServer}/api/ObterImpressora?iCodLoja=${this.iCodLoja}`;
      this.http.get(url).subscribe(
        (data: any) => {
          this.printers = data;
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      return;
    }
  }
  initializeForm() {
    this.formCadastroImpressora = this.fb.group({
      sNome: ['', Validators.required],
      sCaminho: ['', Validators.required],
      iTipo: ['', Validators.required],
      iModelo: ['', Validators.required],
      sFlgSituacao: ['', Validators.required],
    });
  }

  submitImpressora() {
    console.log(this.formCadastroImpressora.value);
    const infoConfig = localStorage.getItem('config');
    if (infoConfig) {
      const config = JSON.parse(infoConfig);
      this.ipServer = config.ip;

      if (this.formCadastroImpressora.valid) {
        const url = `http://${this.ipServer}/api/CadastrarAlterarImpressora`;
        this.items = this.formCadastroImpressora.value;

        this.formCadastroImpressora.value.iModelo = parseInt(
          this.formCadastroImpressora.value.iModelo
        );
        this.formCadastroImpressora.value.iTipo = parseInt(
          this.formCadastroImpressora.value.iTipo
        );

        console.log(this.items);

        let data = this.http.post(url, this.items);
        console.log(data);
        data.subscribe((data) => {
          if (data === true) {
            this.presentToast('Impressora cadastrada com sucesso', 'top');
            this.closeModal();
            this.getImpressoras();
          } else {
            this.presentToast('Error ao salvar impressora', 'top');
          }
        });
      } else {
        this.presentToast(' preencha todos os campos', 'top');
      }
    } else {
      return;
    }
  }

  // codigo pode ser refatorado pra melhor desempenho, usando o patchValue altera os valores do form estânciado em vez de toda vez criar um formgroup novo !
  // essa abordagem pode melhorar o desempenho, a consistência do formulário !
  openModal(sAção: number) {
    if (sAção == 1) {
      const printer = this.printers[0];

      this.formCadastroImpressora = this.fb.group({
        iCodLoja: [printer.iCodLoja, Validators.required],
        iCodImpressora: [printer.iCodImpressora, Validators.required],
        sNome: [printer.sNome, Validators.required],
        sCaminho: [printer.sCaminho, Validators.required],
        iModelo: [printer.iModelo.toString(), Validators.required],
        iTipo: [printer.iTipo.toString(), Validators.required],
        sFlgSituacao: [printer.sFlgSituacao, Validators.required],
        sAcao: ['A', Validators.required],
      });

      console.log(this.formCadastroImpressora.value);
    } else {
      const loginData = this.loginService.getLoginData();
      console.log(loginData);
      this.iCodLoja = loginData.parametros.iCodLoja;
      console.log('caindoa qui');
      console.log(this.iCodLoja);
      this.formCadastroImpressora = this.fb.group({
        iCodLoja: [this.iCodLoja, Validators.required],
        iCodImpressora: [0, Validators.required],
        sNome: ['', Validators.required],
        sCaminho: ['', Validators.required],
        iModelo: [0, Validators.required],
        iTipo: [0, Validators.required],
        sFlgSituacao: ['A', Validators.required],
        sAcao: ['I', Validators.required],
      });
    }

    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }
  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  testPrinter() {
    const url = 'http://192.168.1.108:8081/api/TesteImpressora';
    this.items = this.formCadastroImpressora.value;

    this.formCadastroImpressora.value.iModelo = parseInt(
      this.formCadastroImpressora.value.iModelo
    );
    this.formCadastroImpressora.value.iTipo = parseInt(
      this.formCadastroImpressora.value.iTipo
    );

    console.log(this.items);
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,OPTIONS'
    );
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    let data = this.http.post(url, this.items, { headers: headers });
    data.subscribe((data) => {
      if (data === true) {
        this.presentToast('Impressora testada com sucesso', 'top');
      } else {
        this.presentToast('Erro ao testar impressora', 'top');
      }
    });
  }
}
