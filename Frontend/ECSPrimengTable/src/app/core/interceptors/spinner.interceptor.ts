import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  const showSpinner = req.headers.get('X-Show-Spinner') !== 'false';

  if (showSpinner) {
    spinnerService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (showSpinner) {
        spinnerService.hide();
      }
    })
  );
};