import { Component, OnDestroy } from '@angular/core';
import { TableColumn } from '../../shared/ui/table/table.component';
import { Subject } from 'rxjs';
import { GridService } from '../../shared/services/grid/grid.service';

interface PaymentEntry {
  name: string;
  amount: number;
  code: number;
  grid: number;
  gridData: string[][];
}

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  paymentName: string = '';
  paymentAmount: number = 0;
  modalGridData: string[][] = [];

  paymentList: PaymentEntry[] = [
    { name: 'Payment 1', amount: 100, code: 34, grid: 100, gridData: [] },
    { name: 'Payment 2', amount: 100, code: 22, grid: 100, gridData: [] },
    { name: 'Payment 3', amount: 100, code: 91, grid: 100, gridData: [] },
  ];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'amount', header: 'Amount' },
    { field: 'code', header: 'Code' },
    { field: 'grid', header: 'Grid' },
  ];

  constructor(private readonly gridService: GridService) {}

  addPayment() {
    const currentCode = this.gridService.getCode();
    const currentGrid = this.gridService.getGridData();

    if (
      this.paymentName.trim() &&
      this.paymentAmount > 0 &&
      currentCode > 0
    ) {
      const displayGrid = currentGrid.length * (currentGrid[0]?.length || 0);
      const gridCopy = currentGrid.map((row) => [...row]);

      this.paymentList.push({
        name: this.paymentName,
        amount: this.paymentAmount,
        code: currentCode,
        grid: displayGrid,
        gridData: gridCopy,
      });
      this.paymentName = '';
      this.paymentAmount = 0;
    }
  }

  showGrid(payment: PaymentEntry): void {
    this.modalGridData = payment.gridData;
    // Abre o modal acionando o input checkbox
    const modalToggle = document.getElementById('generic-modal-toggle') as HTMLInputElement;
    if (modalToggle) {
      modalToggle.checked = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}