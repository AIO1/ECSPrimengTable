import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';
import { SharedService } from '../services/shared.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private readonly spinnerService: SpinnerService, private readonly sharedService: SharedService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isRowRequest = new URL(req.url, 'http://localhost').pathname.endsWith('/GetTableData');
    const startedAt = performance.now();
    const showSpinner = req.headers.get('X-Show-Spinner') !== 'false';
    if (showSpinner) {
      this.spinnerService.show();
    }
    return next.handle(req).pipe(
      tap(event => {
        if (isRowRequest && event instanceof HttpResponse && event.ok) {
          this.sharedService.lastRowRetrievalMs.set(performance.now() - startedAt);
        }
      }),
      finalize(() => {
        if (showSpinner) {
          this.spinnerService.hide();
        }
      })
    );
  }
}