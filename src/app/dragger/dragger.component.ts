import { Component, OnInit, HostListener } from '@angular/core';
import { Dragger } from './dragger.model';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.css']
})
export class DraggerComponent implements OnInit {

  defaultDragger: any; // 默认变量
  state: any; // 初始状态
  draggerStyle: any; // style
  source = fromEvent(document, 'mousemove');
  mouseEvent: Observable<{}>;
  bindMouseEvent: Subscription;

  constructor() {
    this.defaultDragger = {
      allowX: true,
      allowY: true,
      hasDraggerHandle: false,
      isUserMove: true
    };

   this.state = {
      x: null, // x轴位移，单位是px
      y: null, // y轴位移，单位是px
      originX: 0, // 鼠标点击元素的原始位置，单位是px
      originY: 0,
      lastX: 0, // 已经移动的位移，单位是px
      lastY: 0
    };
  }

  ngOnInit() {
    this.mouseEvent = this.source.pipe(
      tap(() => {
        this.move(event);
      })
    );
  }

  move(event) {
    let { lastX, lastY } = this.state;
    let deltaX = event.clientX - this.state.originX + lastX;
    let deltaY = event.clientY - this.state.originY + lastY;
    this.state.x = deltaX;
    this.state.y = deltaY;
  }

  onDragStart(event) {
    this.bindMouseEvent = this.mouseEvent.subscribe(
      () => {
        this.draggerStyle = {
          'touchAction': 'none!important',
          'transform': 'translate(' + this.state.x + 'px,' + this.state.y + 'px)'
        };
      }
    );
    let deltaX = event.clientX;
    let deltaY = event.clientY;
    this.state.originX = deltaX;
    this.state.originY = deltaY;
    this.state.lastX = this.state.x;
    this.state.lastY = this.state.y;
  }

  onDragEnd(event) {
    this.bindMouseEvent.unsubscribe();
  }

  // @HostListener('document:mousemove', ['$event'])
  // mouseMove(event) {
  //   this.move(event);
  //   this.draggerStyle = {
  //     'touchAction': 'none!important',
  //     'transform': 'translate(' + this.state.x + 'px,' + this.state.y + 'px)'
  //   };
  // }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event) {
    this.onDragEnd(event);
  }

}
