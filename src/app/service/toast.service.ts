import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private subject = new Subject<any>();

  sendToast(header:string, message: string, refresh: boolean, close: boolean, duration: number) {
      this.subject.next({ header:header, message: message, refresh: refresh, close: close, duration: duration });
  }

  clearToast() {
      this.subject.next();
  }

  getToast(): Observable<any> {
      return this.subject.asObservable();
  }

}
