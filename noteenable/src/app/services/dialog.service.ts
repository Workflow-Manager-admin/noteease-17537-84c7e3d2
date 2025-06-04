import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  // Using window methods only when called, not during initialization
  confirm(message: string): boolean {
    return window.confirm(message);
  }

  alert(message: string): void {
    window.alert(message);
  }
}
