import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';

@Component({
  selector: 'ecs-table-button',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './table-button.html',
  styleUrl: './table-button.scss'
})
export class TableButton {
  constructor(
    private tableService: ECSPrimengTableService
  ) {}
  @Input() button: any;
  @Input() rowData: any;
  @Input() isActionButton: boolean = false;
  @Input() isLastActionButton: boolean = false;

  currentCondition(): boolean {
    return (this.button.condition?.(this.rowData));
  }

  handleClick() {
    if (this.button.action) {
      this.tableService.handleButtonsClick(this.button.action, this.rowData);
    }
  }
}
