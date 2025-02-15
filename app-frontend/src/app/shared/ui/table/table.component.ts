import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Output() gridClick = new EventEmitter<any>();

  onCellClick(col: TableColumn, rowData: any): void {
    if (col.field === 'grid') {
      this.gridClick.emit(rowData);
    }
  }
}
