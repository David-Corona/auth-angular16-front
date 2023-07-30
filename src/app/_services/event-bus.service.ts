import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from '../_shared/event-data.class';

/*
The logout event will be dispatched to App component when response status tells us the access token is expired.

We need to set up a global event-driven system, or a PubSub system, which allows us to listen and dispatch (emit) events
from independent components so that they don’t have direct dependencies between each other.

We’re gonna create EventBusService with two methods: on and emit.
*/


@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  constructor() { }

  emit(event: EventData) {
    console.log("EventBusService emit. Event: ", event);
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    console.log("EventBusService on. eventName: ", eventName, "// action: ", action);
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }
}
