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
  parent: any; // 存放当前拖拽元素的父元素 
  self: any; // 存放当前拖拽的元素

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
    const { lastX, lastY } = this.state;
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

    if(this.draggerProps && this.draggerProps.bounds) {
      let bounds = <Position>this.draggerProps.bounds;
      if (this.el.nativeElement.parentElement && this.el.nativeElement.parentElement.className === 'bounds') {
        bounds = {
          left: this.returnNumber(this.parent.style.paddingLeft) + this.returnNumber(this.self.style.marginLeft) - this.self.offsetLeft,
          top: this.returnNumber(this.parent.style.paddingTop) + this.returnNumber(this.self.style.marginTop) - this.self.offsetTop,
          right: this.innerWidth(this.parent) - this.outerWidth(this.self) - this.self.offsetLeft +
          this.returnNumber(this.parent.style.paddingRight) - this.returnNumber(this.self.style.marginRight),
          bottom: this.innerHeight(this.parent) - this.outerHeight(this.self) - this.self.offsetTop +
          this.returnNumber(this.parent.style.paddingBottom) - this.returnNumber(this.self.style.marginBottom)
        }
      }

      if (this.isNumber(bounds.right)) 
        deltaX = Math.min(deltaX, bounds.right);
      if (this.isNumber(bounds.left)) 
        deltaX = Math.max(deltaX, -bounds.left);
      if (this.isNumber(bounds.top)) 
        deltaY = Math.max(deltaY, -bounds.top);
      if (this.isNumber(bounds.bottom)) 
        deltaY = Math.min(deltaY, bounds.bottom);
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

    this.parent = event.currentTarget.offsetParent;

    this.self = event.currentTarget;

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
      // 取消订阅事件流
      this.bindMouseEvent.unsubscribe();
      this.parent = null;
      this.self = null;
    }
  }

  // 判断是否为number类型
  isNumber = (things) => {
    return typeof things === 'number' ? true : false;
  }

  // 返回移除px单位的字符串
  returnNumber = (string) => {
    return string === '' ? 0 : string.split('px').join('');
  }

  innerWidth = (node) => {
    let width = node.clientWidth;
    const computedStyle = node.style;
    width -= this.returnNumber(computedStyle.paddingLeft);
    width -= this.returnNumber(computedStyle.paddingRight);
    return width;
  }

  outerWidth = (node) => {
    let width = node.clientWidth;
    const computedStyle = node.style;
    width += this.returnNumber(computedStyle.borderLeftWidth);
    width += this.returnNumber(computedStyle.borderRightWidth);
    return width;
  }

  innerHeight = (node) => {
    let height = node.clientHeight;
    const computedStyle = node.style;
    height -= this.returnNumber(computedStyle.paddingTop);
    height -= this.returnNumber(computedStyle.paddingBottom);
    return height;
  }

  outerHeight = (node) => {
    let height = node.clientHeight;
    const computedStyle = node.style;
    height += this.returnNumber(computedStyle.borderTopWidth);
    height += this.returnNumber(computedStyle.borderBottomWidth);
    return height;
}

}
