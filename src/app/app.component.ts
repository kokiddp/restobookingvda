import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'restobookingvda';

  view: string = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  clickedDate: Date;
}
