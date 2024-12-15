/**
 * 单元格的基础数据类型
 */
export interface Cell {
  /**
   * 单元格唯一标识
   */
  id: string;
  /**
   * 单元格值
   */
  value: string | number;
  /**
   * 公式
   */
  formula?: string;
  /**
   * 格式化配置
   */
  format?: CellFormat;
  /**
   * 合并信息
   */
  mergeInfo?: MergeInfo;
}

/**
 * 单元格格式化配置
 */
export interface CellFormat {
  /**
   * 字体
   */
  fontFamily?: string;
  /**
   * 字号
   */
  fontSize?: number;
  /**
   * 字重
   */
  fontWeight?: string;
  /**
   * 文字颜色
   */
  color?: string;
  /**
   * 背景色
   */
  backgroundColor?: string;
  /**
   * 边框样式
   */
  border?: BorderStyle;
  /**
   * 对齐方式
   */
  alignment?: Alignment;
  /**
   * 数字格式化
   */
  numberFormat?: string;
}

/**
 * 边框样式
 */
export interface BorderStyle {
  top?: Border;
  right?: Border;
  bottom?: Border;
  left?: Border;
}

export interface Border {
  style: 'solid' | 'dashed' | 'dotted';
  width: number;
  color: string;
}

/**
 * 对齐方式
 */
export interface Alignment {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'middle' | 'bottom';
  /**
   * 自动换行
   */
  wrapText?: boolean;
}

/**
 * 合并单元格信息
 */
export interface MergeInfo {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

/**
 * 工作表
 */
export interface Sheet {
  /**
   * 工作表ID
   */
  id: string;
  /**
   * 工作表名称
   */
  name: string;
  /**
   * 最大行数
   */
  maxRow: number;
  /**
   * 最大列数
   */
  maxCol: number;
  /**
   * 单元格数据，使用Map存储以提高性能
   */
  cells: {
    /**
     * key格式: "A1", "B2"等
     */
    [key: string]: Cell;
  };

  /**
   * 序号行默认高度
   */
  defaultIndexRowHeight: number;
  /**
   * 序号列默认宽度
   */
  defaultIndexColWidth: number;

  /**
   * 默认行高
   */
  defaultRowHeight: number;
  /**
   * 默认列宽
   */
  defaultColWidth: number;
  /**
   * 行高配置
   */
  rowHeight: {
    [key: number]: number;
  };
  /**
   * 列宽配置
   */
  colWidth: {
    [key: number]: number;
  };
  /**
   * 冻结行数
   */
  frozenRows?: number;
  /**
   * 冻结列数
   */
  frozenCols?: number;
  /**
   * 当前活动单元格
   */
  activeCell?: string;
  /**
   * 选区信息
   */
  selection?: Selection;
}

/**
 * 选区信息
 */
export interface Selection {
  /**
   * 选区起始位置
   */
  start: CellPosition;
  /**
   * 选区结束位置
   */
  end: CellPosition;
}

export interface CellPosition {
  row: number;
  col: number;
}