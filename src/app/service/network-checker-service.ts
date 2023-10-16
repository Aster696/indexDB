import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => {
      this.onlineStatus.next(true);
    });

    window.addEventListener('offline', () => {
      this.onlineStatus.next(false);
    });
  }

  isOnline(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }
}
