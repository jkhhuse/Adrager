export class Dragger {
  x: number; // 初始位置
  y: number;
  bounds: Position | string;
  grid: [number]; // 移动距离
  allowX: boolean; // 只允许x轴移动
  allowY: boolean; // 只允许y轴移动
  hasDraggerHandle: boolean; // 内部的移动拖拽把手
  hasCancelHandle: boolean; // 内部取消的区域
  isUserMove: boolean; // 是否由用户移动
  static: boolean; // 是否静态
  onDragStart: Function;
  onMove: Function;
  onDragEnd: Function;
}

// 边框的限制范围
export class Position {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
