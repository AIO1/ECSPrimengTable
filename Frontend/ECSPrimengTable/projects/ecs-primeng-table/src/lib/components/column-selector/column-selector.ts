import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
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
    TranslatePipe,
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
export class ColumnSelector implements OnChanges {
  @Input() orderByHeader = false;

  constructor(private translate: TranslateService, changeDetector: ChangeDetectorRef) {
    merge(translate.onLangChange, translate.onTranslationChange, translate.onFallbackLangChange)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateVisibleColumns();
        changeDetector.markForCheck();
      });
  }

  ngOnChanges(): void {
    if (!this.visible) this.globalSearchText = null;
    this.updateVisibleColumns();
  }

  private updateVisibleColumns(): void {
    const search = (this.globalSearchText ?? '').toLocaleLowerCase();
    const label = (column: any): string => column.header ? this.translate.instant(column.header) : '';
    this.filteredColumnData = this.columnModalData.filter(column =>
      label(column).toLocaleLowerCase().includes(search)
    );
    if (this.orderByHeader) {
      this.filteredColumnData.sort((a, b) => label(a).localeCompare(label(b)));
    }
  }

  @ViewChild('dt_columnDialog') dt_columnDialog!: Table;
  
  @Input() visible: boolean = false;
  @Input() columnModalData: any[] = [];
  @Input() filteredColumnData: any[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() applyChanges = new EventEmitter<IColumnMetadata[]>(); 

  cellOverflowBehaviourOptions = [
    {icon: 'pi pi-minus', val: CellOverflowBehaviour.Hidden, name: "Hidden"},
    {icon: 'pi pi-equals', val: CellOverflowBehaviour.Wrap, name: "Wrap"}/*,
    {icon: 'pi pi-ellipsis-h', val: CellOverflowBehaviour.Ellipsis, name: "Ellipsis"}*/
  ];
  dataAlignHorizontalOptions = [
    {icon: 'pi pi-align-left', val: DataAlignHorizontal.Left, name: "Left"},
    {icon: 'pi pi-align-center', val: DataAlignHorizontal.Center, name: "Center"},
    {icon: 'pi pi-align-right', val: DataAlignHorizontal.Right, name: "Right"}
  ];
  dataAlignVerticalOptions = [
    {icon: 'pi pi-angle-up', val: DataAlignVertical.Top, name: "Top"},
    {icon: 'pi pi-align-justify', val: DataAlignVertical.Middle, name: "Middle"},
    {icon: 'pi pi-angle-down', val: DataAlignVertical.Bottom, name: "Bottom"}
  ];

  globalSearchText: string | null = null; // The text used by the global search
  globalSearchMaxLength: number = 50;
  allColumnsCheckboxActive(): boolean{
    return this.columnModalData.every(column => column.selected);
  }

  allColumnsCheckboxClick(event: any): void{
    if(event.checked){
      this.columnModalData.forEach(column => {column.selected = true;});
    } else {
      this.columnModalData.forEach(column => {
        if (!column.selectDisabled) {
          column.selected = false;
        }
      });
    }
  }

  filterColumnModal(event: any) {
    this.globalSearchText = event.target.value;
    this.updateVisibleColumns();
  }

  applyColumnModalChanges(){
    const selected = this.columnModalData.filter(c => c.selected && !c.selectDisabled);
    this.applyChanges.emit(selected);
    this.closeModal();
  }
  clearGlobalFilter(dt: Table){
    this.globalSearchText=null;
    this.updateVisibleColumns();
  }
  closeModal(){
    this.globalSearchText=null;
    this.visibleChange.emit(false);
  }
}
