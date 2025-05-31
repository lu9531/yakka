import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  constructor() { }
  
  private readonly totalProgress$ = new BehaviorSubject<number>(0);
  private intervalSub: Subscription | null = null;
  private requestCompleted = false;

  getProgress() {
    return this.totalProgress$.asObservable();
  }

  startProgress() {
    this.totalProgress$.next(0);
    this.requestCompleted = false;

    this.intervalSub = interval(30).subscribe(() => {
      const current = this.totalProgress$.value;
      if (current < 95) {
        this.totalProgress$.next(current + 1);
      } else if (this.requestCompleted) {
        this.totalProgress$.next(100);
        this.stopProgress();
      }
    });
  }

  completeProgress() {
    this.requestCompleted = true;

    const completeInterval = interval(15).subscribe(() => {
      const current = this.totalProgress$.value;
      if (current < 100) {
        this.totalProgress$.next(current + 1);
      } else {
        completeInterval.unsubscribe();
        this.stopProgress();
      }
    });
  }

  stopProgress() {
    this.intervalSub?.unsubscribe();
    this.intervalSub = null;
  }

  reset() {
    this.stopProgress();
    this.totalProgress$.next(0);
    this.requestCompleted = false;
  }

}
