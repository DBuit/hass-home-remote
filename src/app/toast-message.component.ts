import { Component, OnDestroy } from '@angular/core';
import { ToastService } from './service/toast.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
})
export class ToastMessageComponent implements OnDestroy {

  header: string;
  refresh: boolean = false;
  close: boolean = false;
  message: string;
  duration: number = 0;
  subscription: Subscription;
  toastTimer: any;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.getToast().subscribe(toast => {
      this.message = toast.message;
      this.header = toast.header;
      this.refresh = toast.refresh;
      this.close = toast.close;
      this.duration = toast.duration;
      if(toast.duration > 0) {
        this.timeOut();
      }
    })
  }

  timeOut() {
    if(this.toastTimer) {
      this.toastTimer.unsubscribe();
    }
    this.toastTimer = timer(this.duration, this.duration).subscribe((res) => {
      this.reset();
      this.toastTimer.unsubscribe();
    });
  }

  reset() {
    this.message = null;
    this.header = null;
    this.refresh = false;
    this.close = false;
    this.duration = 0;
  }

  close() {
    this.reset();
  }

  refresh() {
    window.location.reload();
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }

}
