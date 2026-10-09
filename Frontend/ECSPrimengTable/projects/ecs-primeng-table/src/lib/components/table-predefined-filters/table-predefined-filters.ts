import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';
import { highlightText } from '../../utils';

@Component({
  selector: 'ecs-table-predefined-filters',
  standalone: true,
  imports: [
    SkeletonModule,
    TagModule,
    CommonModule
  ],
  templateUrl: './table-predefined-filters.html'
})
export class TablePredefinedFilters {
  private sanitizer = inject(DomSanitizer);
  private tableService = inject(ECSPrimengTableService);
  option = input.required<any>();
  col = input.required<any>();
  selectable = input<boolean>(false);
  rowData = input<any>(null);
  globalSearchText = input<string | null | undefined>(null);
  isSelectableWithAction = computed(() => {
    return this.selectable() && !!this.option()?.action;
  });
  safeBlobUrl = computed<SafeUrl | null>(() => {
    const blob = this.option()?.imageBlob;
    if (!blob) return null;
    const objectURL = `data:image/jpeg;base64,${blob}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  });
  highlightedName = computed<SafeHtml>(() => {
    const opt = this.option();
    const column = this.col();
    const search = this.globalSearchText();
    
    if (!opt?.name) return '';
    return highlightText(opt.name, column, search ?? null, this.sanitizer);
  });
  tagStyle = computed(() => {
    const opt = this.option();
    return {
      ...(opt?.tagStyle || {}),
      'vertical-align': 'middle',
      'gap': '0'
    };
  });
  imageStyle = computed(() => {
    const opt = this.option();
    return this.getImageSkeletonStyle(opt?.imageWidth, opt?.imageHeight, false);
  });
  skeletonStyle = computed(() => {
    const opt = this.option();
    return this.getImageSkeletonStyle(opt?.imageWidth, opt?.imageHeight, true);
  });
  handleClick() {
    const opt = this.option();
    if (opt?.action) {
      this.tableService.handlePredefinedFilterClick(opt.action, this.rowData(), opt);
    }
  }
  private getImageSkeletonStyle(width?: number, height?: number, isSkeleton: boolean = false): Record<string, string> {
    const finalHeight = height && height > 0 ? `${height}px` : '22px';
    let finalWidth: string | undefined;

    if (width && width > 0) {
      finalWidth = `${width}px`;
    } else if (isSkeleton) {
      finalWidth = finalHeight;
    }
    const style: Record<string, string> = {
      'vertical-align': 'middle',
      'height': finalHeight
    };
    if (finalWidth) {
      style['width'] = finalWidth;
    }
    return style;
  }
}