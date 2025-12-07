import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';
import { ITableButton } from '../../interfaces';

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
  @Input() overrideAction?: ((event: Event) => void);
  
  handleClick(event: Event) {
    if (this.button?.action || this.overrideAction) { // If there is an action or an override, execute logic
      if (this.overrideAction) { // If overrideAction exists, execute it first
        this.overrideAction(event); // Call override action
      } else { // Otherwise execute the normal button action through the service
        this.tableService.handleButtonsClick(this.button.action, this.rowData);
      }
    }
  }

  getButtonStyle(button: ITableButton, isActionButton: boolean, isLastActionButton: boolean) {
    const styles: any = {};
    if (button.style) { // Add inline styles from button.style
        button.style.split(';').forEach(part => {  /* Parse inline CSS: "padding: 4px; color:red" */
            const [prop, value] = part.split(':').map(x => x.trim());
            if (prop && value) styles[prop] = value;
        });
    }
    if (isActionButton && !isLastActionButton) { // Add margin-right for action buttons
        styles['margin-right'] = '10px';
    }
    return styles;
  }
}