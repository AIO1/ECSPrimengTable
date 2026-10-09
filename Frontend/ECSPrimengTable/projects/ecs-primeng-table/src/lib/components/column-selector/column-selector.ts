import { Component, input, model, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical } from '../../enums';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { IColumnMetadata } from '../../interfaces';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'ecs-column-selector',
  imports: [
    DialogModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    SelectButtonModule,
    CommonModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './column-selector.html'
})
export class ColumnSelector {
  readonly dtColumnDialog = viewChild.required<Table>('dt_columnDialog');
  readonly visible = model<boolean>(false);
  readonly columnModalData = input.required<any[]>();
  readonly filteredColumnData = model<any[]>();
  readonly applyChanges = output<IColumnMetadata[]>();
  readonly cellOverflowBehaviourOptions = [
    { icon: 'pi pi-minus', val: CellOverflowBehaviour.Hidden, name: 'Hidden' },
    { icon: 'pi pi-equals', val: CellOverflowBehaviour.Wrap, name: 'Wrap' }
  ];

  readonly dataAlignHorizontalOptions = [
    { icon: 'pi pi-align-left', val: DataAlignHorizontal.Left, name: 'Left' },
    { icon: 'pi pi-align-center', val: DataAlignHorizontal.Center, name: 'Center' },
    { icon: 'pi pi-align-right', val: DataAlignHorizontal.Right, name: 'Right' }
  ];

  readonly dataAlignVerticalOptions = [
    { icon: 'pi pi-angle-up', val: DataAlignVertical.Top, name: 'Top' },
    { icon: 'pi pi-align-justify', val: DataAlignVertical.Middle, name: 'Middle' },
    { icon: 'pi pi-angle-down', val: DataAlignVertical.Bottom, name: 'Bottom' }
  ];

  globalSearchText: string | null = null;
  readonly globalSearchMaxLength = 50;

  onColumnModalFilter(event: any) {
    const filterValue = event.filters?.global?.value?.toLowerCase() ?? '';
    const currentData = this.columnModalData();
    
    const filtered = currentData.filter(column => 
      column.header.toLowerCase().includes(filterValue)
    );
    this.filteredColumnData.set(filtered);
  }

  allColumnsCheckboxActive(): boolean {
    return this.columnModalData().every(column => column.selected);
  }

  allColumnsCheckboxClick(isChecked: boolean): void {
    const data = this.columnModalData();
    if (isChecked) {
      data.forEach(column => column.selected = true);
    } else {
      data.forEach(column => {
        if (!column.selectDisabled) {
          column.selected = false;
        }
      });
    }
  }

  filterColumnModal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dtColumnDialog().filterGlobal(filterValue, 'contains');
  }

  applyColumnModalChanges() {
    const selected = this.columnModalData().filter(c => c.selected && !c.selectDisabled);
    this.applyChanges.emit(selected);
    this.closeModal();
  }

  clearGlobalFilter() {
    if (!this.globalSearchText) {
        return;
    }
    this.globalSearchText = null;
    this.dtColumnDialog().filterGlobal('', 'contains');
  }

  closeModal() {
    this.clearGlobalFilter();
    this.visible.set(false);
  }
}