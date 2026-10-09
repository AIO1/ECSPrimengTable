import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
  templateUrl: './table-button.html'
})
export class TableButton {
  constructor(
    private tableService: ECSPrimengTableService
  ) {}

  readonly button = input.required<any>();
  readonly rowData = input.required<any>();
  readonly isActionButton = input<boolean>(false);
  readonly isLastActionButton = input<boolean>(false);
  readonly overrideAction = input<((event: Event) => void) | undefined>();

  handleClick(event: Event) {
    const btn = this.button();
    const override = this.overrideAction();

    if (btn?.action || override) { 
      if (override) { 
        override(event); 
      } else { 
        this.tableService.handleButtonsClick(btn.action, this.rowData());
      }
    }
  }

  getButtonStyle(button: ITableButton, isActionButton: boolean, isLastActionButton: boolean) {
    const styles: any = {};
    if (button.style) { 
        button.style.split(';').forEach(part => {  
            const [prop, value] = part.split(':').map(x => x.trim());
            if (prop && value) styles[prop] = value;
        });
    }
    if (isActionButton && !isLastActionButton) { 
        styles['margin-right'] = '10px';
    }
    return styles;
  }
}