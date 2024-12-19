import { Selection, Sheet } from './sheetTypes';
export interface EasyWebExcelProps {
  size: {
    width: number;
    height: number;
  };
}
export interface GridLayerProps {
  /**
   * 列位置
   */
  colPositionRef: React.MutableRefObject<number[]>;
  /**
   * 行位置
   */
  rowPositionRef: React.MutableRefObject<number[]>;
  /**
   * 网格线区域总宽高
   */
  gridLineAreaSize: {
    width: number;
    height: number;
  };
  sheet: Sheet;
  /**
   * 当前窗口总宽高
   */
  size: {
    width: number;
    height: number;
  };
  /**
   * 滚动距离
   */
  scrollDistance: {
    horizontal: number;
    vertical: number;
  };

  /**
   * 当前视口最大行数
   */
  maxRowCount: number;

  /**
   * 当前视口最大列数
   */
  maxColCount: number;

  /**
   * 手动调整过的行索引
   */
  manualAdjustedRowIndexs: number[];

  /**
   * 手动调整过的列索引
   */
  manualAdjustedColIndexs: number[];

  /**
   * 当前视口垂直滚动行数
   */
  verticalScrollRowCount: number;

  /**
   * 当前视口水平滚动列数
   */
  horizontalScrollColCount: number;

  /**
   * 设置滚动距离
   */
  setScrollDistance: React.Dispatch<
    React.SetStateAction<GridLayerProps['scrollDistance']>
  >;
  /**
   * 设置选中范围
   */
  setSelection: React.Dispatch<React.SetStateAction<Selection | undefined>>;
}

export interface DataViewProps {
  /**
   * 列位置
   */
  colPositionRef: React.MutableRefObject<number[]>;
  /**
   * 行位置
   */
  rowPositionRef: React.MutableRefObject<number[]>;
  /**
   * 表格数据
   */
  sheet: Sheet;
  /**
   * 当前窗口总宽高
   */
  size: {
    width: number;
    height: number;
  };
  /**
   * 滚动距离
   */
  scrollDistance: {
    horizontal: number;
    vertical: number;
  };

  /**
   * 网格线区域总宽高
   */
  gridLineAreaSize: {
    width: number;
    height: number;
  };

  /**
   * 当前视口最大行数
   */
  maxRowCount: number;

  /**
   * 当前视口最大列数
   */
  maxColCount: number;

  /**
   * 手动调整过的行索引
   */
  manualAdjustedRowIndexs: number[];

  /**
   * 手动调整过的列索引
   */
  manualAdjustedColIndexs: number[];

  /**
   * 当前视口垂直滚动行数
   */
  verticalScrollRowCount: number;

  /**
   * 当前视口水平滚动列数
   */
  horizontalScrollColCount: number;
}
