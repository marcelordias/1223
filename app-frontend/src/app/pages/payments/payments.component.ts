import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableColumn } from '../../shared/ui/table/table.component';
import { Subject } from 'rxjs';
import { GridService } from '../../shared/services/grid/grid.service';
import { SocketService } from '../../shared/services/socket/socket.service';

interface PaymentEntry {
  name: string;
  amount: number;
  code: number;
  grid: number;
  gridData: string;
}

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  paymentName: string = '';
  paymentAmount: number = 0;
  modalGridData: string[][] = [];
  isUpdating: boolean = false;

  paymentList: PaymentEntry[] = [];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'amount', header: 'Amount' },
    { field: 'code', header: 'Code' },
    { field: 'grid', header: 'Grid' },
  ];

  constructor(
    private readonly gridService: GridService,
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.socketService.on<PaymentEntry[]>('paymentUpdate', (payments: PaymentEntry[]) => {
      this.paymentList = payments;
      this.isUpdating = false;
    });

    this.socketService.emit('getPayments');
  }

  addPayment() {
    const currentCode = this.gridService.getCode();
    const currentGrid = this.gridService.getGridData();

    if (
      this.paymentName.trim() &&
      this.paymentAmount > 0 &&
      currentCode > 0
    ) {
      this.isUpdating = true;
      const displayGrid = currentGrid.length * (currentGrid[0]?.length || 0);
      const gridCopy = currentGrid.map((row) => [...row]);

      const newPayment: PaymentEntry = {
        name: this.paymentName,
        amount: this.paymentAmount,
        code: currentCode,
        grid: displayGrid,
        gridData: JSON.stringify(gridCopy),
      };

      this.socketService.emit('addPayment', newPayment);

      this.paymentName = '';
      this.paymentAmount = 0;
    }
  }

  showGrid(payment: PaymentEntry): void {
    this.modalGridData = JSON.parse(payment.gridData);
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