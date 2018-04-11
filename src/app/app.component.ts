import { Component } from '@angular/core';
import { Dragger } from './dragger/dragger.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  state = {
    x: 0,
    y: 0
  };
  onDrag(e) {
    this.state = {
      x: e.x,
      y: e.y
    };
  }
}
