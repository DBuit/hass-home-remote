import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { Observable, fromEvent, merge, Subject, timer } from 'rxjs';

@Directive({
  selector: '[appScreensaverTimer]'
})
export class ScreensaverTimerDirective {

  idle: any;
  idleTime: number = 10;
  timeOutMilliSeconds: number;
  idleSubscription: any;
  timer: any;
  active: boolean = false;

  constructor(public element: ElementRef, private renderer: Renderer2) {
    this.idle = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'click'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'DOMMouseScroll'),
        fromEvent(document, 'mousewheel'),
        fromEvent(document, 'touchmove'),
        fromEvent(document, 'MSPointerMove'),
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'resize'),
    );

    this.timeOutMilliSeconds = this.idleTime * 1000;
    this.idleSubscription = this.idle.subscribe((res) => {
      this.resetTimer();
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = timer(this.timeOutMilliSeconds, this.timeOutMilliSeconds).subscribe((res) => {
      console.log('JA');
      this.active = true;
      this.renderer.removeClass(this.element.nativeElement, 'hide');
      this.renderer.addClass(this.element.nativeElement, 'show');
    });

  }

  resetTimer() {
    this.active = false;
    this.renderer.removeClass(this.element.nativeElement, 'show');
    this.renderer.addClass(this.element.nativeElement, 'hide');
    this.timer.unsubscribe();
    this.startTimer();
  }
}
