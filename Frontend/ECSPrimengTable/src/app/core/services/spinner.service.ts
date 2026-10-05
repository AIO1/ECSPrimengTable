import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private requestCount = 0;
  private readonly _isVisible = signal<boolean>(false);
  readonly isVisible = this._isVisible.asReadonly();

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._isVisible.set(true);
    }
  }

  hide() {
    this.requestCount--;
    this.requestCount = Math.max(0, this.requestCount);
    if (this.requestCount === 0) {
      this._isVisible.set(false);
    }
  }
}