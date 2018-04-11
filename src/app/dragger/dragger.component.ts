import { Component, OnInit, HostListener, HostBinding, Input, Output, EventEmitter, Inject, Renderer2, ElementRef } from '@angular/core';
import { Dragger, Position } from './dragger.model';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.css']
})
export class DraggerComponent implements OnInit  {

  @Input() draggerProps: Dragger;
  @Input() dragStyle: any;
  @Output() dragMove =  new EventEmitter();
  defaultDragger: any = {}; // 默认变量
  state: any; // 初始状态
  style: any; // style
  source = fromEvent(document, 'mousemove');
  mouseEvent: Observable<{}>;
  bindMouseEvent: Subscription;

  constructor(private render: Renderer2, private el: ElementRef) {
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
      tap((event) => {
        this.move(event);
      })
    );
    this.style = this.dragStyle;
  }

  move(event) {
    let { lastX, lastY } = this.state;
    let deltaX = event.clientX - this.state.originX + lastX;
    let deltaY = event.clientY - this.state.originY + lastY;

    // grid移动限制
    if (this.draggerProps && this.draggerProps.grid) {
      const grid = this.draggerProps.grid;
      if (Array.isArray(grid) && grid.length === 2) {
          deltaX = Math.round(deltaX / grid[0]) * grid[0];
          deltaY = Math.round(deltaY / grid[1]) * grid[1];
      }
    }

    if (this.draggerProps && this.draggerProps.allowX) {
      deltaY = 0;
    }
    if (this.draggerProps && this.draggerProps.allowY) {
      deltaX = 0;
    }
    this.state.x = deltaX;
    this.state.y = deltaY;
  }

  onDragStart(event) {
    // 移动元素时不会选择到元素内部文字
    this.render.setStyle(document.body, 'user-select', 'none');

    // 控制可拖拽位置
    if (this.draggerProps && this.draggerProps.hasDraggerHandle) {
      if (event.target.className !== 'handle') {
        return;
      }
    }
    if (this.draggerProps && this.draggerProps.hasCancelHandle) {
      if (event.target.className === 'cancel') {
        return;
      }
    }
    if (this.draggerProps && this.draggerProps.static) {
      return;
    }

    this.bindMouseEvent = this.mouseEvent.subscribe(
      () => {
        // user-select: none
        this.style = Object.assign({
          'user-select': 'none',
          'transform': 'translate(' + this.state.x + 'px,' + this.state.y + 'px)'
        },  this.dragStyle);
        this.dragMove.emit(this.state);
      }
    );
    const deltaX = event.clientX;
    const deltaY = event.clientY;
    this.state.originX = deltaX;
    this.state.originY = deltaY;
    this.state.lastX = this.state.x;
    this.state.lastY = this.state.y;
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: any): void {
    event.stopPropagation();
    if (this.bindMouseEvent) {
      this.bindMouseEvent.unsubscribe();
    }
  }

}
