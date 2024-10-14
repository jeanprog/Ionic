import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.page.html',
  styleUrls: ['./date-modal.component.scss'],
  standalone: true,

  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class DateModalComponent {
  selectedDate: FormControl = new FormControl();

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
  formatDate(inputDate: string): string {
    const [datePart] = inputDate.split('T');

    // Divida a data em partes
    const [year, month, day] = datePart.split('-');

    // Use template literals para formatar a data no formato desejado (dd/MM/yyyy)
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  onDateSelected() {
    console.log('Data selecionadanomodal:', this.selectedDate.value);
    let formattedDate = this.formatDate(this.selectedDate.value);
    console.log(formattedDate);
    this.modalController.dismiss(formattedDate);
  }
}
