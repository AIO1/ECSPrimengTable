import { CommonModule } from '@angular/common';
import { Component, input, computed } from '@angular/core';
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
  constructor(private tableService: ECSPrimengTableService) {}

  readonly button = input.required<ITableButton>();
  readonly rowData = input.required<any>();
  readonly isActionButton = input<boolean>(false);
  readonly isLastActionButton = input<boolean>(false);
  readonly overrideAction = input<((event: Event) => void) | undefined>();

  // Signals computadas para optimizar evaluaciones
  readonly isVisible = computed(() => this.button().visibleCondition?.(this.rowData()) ?? true);
  readonly isEnabled = computed(() => this.button().enabledCondition?.(this.rowData()) ?? true);
  
  readonly shouldRender = computed(() => this.isVisible() && (this.isEnabled() || !this.button().conditionFailHide));

  readonly buttonClasses = computed(() => {
    const btn = this.button();
    return [
      'p-button',
      'p-component',
      btn.rounded ? 'p-button-rounded' : '',
      btn.raised ? 'p-button-raised' : '',
      btn.variant ? `p-button-${btn.variant}` : '',
      this.isActionButton() ? 'p-button-sm' : '',
      btn.class || ''
    ].filter(Boolean).join(' ');
  });

  readonly buttonStyle = computed(() => {
    const styles: Record<string, string> = {};
    const btn = this.button();
    
    if (btn.style) { 
      btn.style.split(';').forEach(part => {  
        const [prop, value] = part.split(':').map(x => x.trim());
        if (prop && value) styles[prop] = value;
      });
    }
    
    if (this.isActionButton() && !this.isLastActionButton()) { 
      styles['margin-right'] = '10px';
    }
    
    return styles;
  });

  handleClick(event: Event) {
    const btn = this.button();
    const override = this.overrideAction();

    if (btn?.action || override) { 
      if (override) { 
        override(event); 
      } else { 
        this.tableService.handleButtonsClick(btn.action!, this.rowData());
      }
    }
  }
}