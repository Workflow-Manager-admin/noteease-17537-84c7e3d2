import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  confirm(message: string): boolean {
    if (!this.isBrowser) {
      return true;
    }
    return globalThis.window?.confirm?.(message) ?? true;
  }

  alert(message: string): void {
    if (!this.isBrowser) {
      console.log('Alert:', message);
      return;
    }
    globalThis.window?.alert?.(message);
  }
}
