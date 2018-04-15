import { Component } from '@angular/core';
import { Dragger, Position } from './dragger/dragger.model';

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
  bounds: Position = {
    left: 100,
    top: 100,
    right: 100,
    bottom: 100
  };
  boundsDrag = {
    bounds: this.bounds
  };
}
