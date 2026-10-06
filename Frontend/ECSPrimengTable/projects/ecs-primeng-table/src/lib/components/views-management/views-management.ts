import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ECSPrimengTableNotificationService } from '../../services';

@Component({
  selector: 'ecs-views-management',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    TooltipModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './views-management.html'
})
export class ViewsManagement {
  private notification = inject(ECSPrimengTableNotificationService);
  
  visible = input.required<boolean>();
  tableViews_menuItems = input<any[]>([]);
  
  visibleChange = output<boolean>();
  onViewSelect = output<string>();
  onViewDelete = output<string>();
  onViewUpdateData = output<string>();
  onViewUpdateActiveStartup = output<string>();
  onViewEditAlias = output<{ viewAliasOld: string; viewAliasNew: string }>();
  onViewCreate = output<string>();

  viewEditorShow = signal(false);
  editingViewAlias = signal('');
  newViewAlias = signal('');

  showViewEditor(alias: string = '') {
    this.editingViewAlias.set(alias);
    this.newViewAlias.set(alias);
    this.viewEditorShow.set(true);
  }

  createOrUpdateTableView() {
    const alias = this.newViewAlias().trim();
    if (!alias) return;
    this.viewEditorShow.set(false);
    
    if (this.editingViewAlias() !== '') {
      this.onViewEditAlias.emit({ 
        viewAliasOld: this.editingViewAlias(), 
        viewAliasNew: alias 
      });
    } else {
      if (this.tableViews_menuItems().some(item => item.label === alias)) {
        this.notification.showToast("error", "DUPLICATE VIEW NAME", `A view with alias "${alias}" already exists`);
        return;
      }
      this.onViewCreate.emit(alias);
    }
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}