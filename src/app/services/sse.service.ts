import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(
    private readonly zone: NgZone
  ) { }

  public getSse(url: string, token: string): Observable<MessageEvent<string>> {
    return new Observable(observer => {
      const eventSource = this.getEventSource(url, token);
      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event);
        });
      };
      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  private getEventSource(url: string, token: string): EventSource {
    return new EventSource(`${environment.apiLink}/${url}?token=${token}`);
  }
}
