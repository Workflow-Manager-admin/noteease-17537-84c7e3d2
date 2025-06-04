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
    if (this.isBrowser && typeof window !== 'undefined') {
      return window.confirm(message);
    }
    return true; // Default response for non-browser environments
  }

  alert(message: string): void {
    if (this.isBrowser && typeof window !== 'undefined') {
      window.alert(message);
    } else {
      console.log('Alert:', message);
    }
  }
}
