import { getManualColWidthDiffTotal } from './const';
import { Sheet } from './sheetTypes';

/**
 * 是否中断计算
 */
let isStop = false;

/**
 * 计算列位置
 * @param data
 */
const calcColPosition = (data: Sheet) => {
  const { maxCol, colWidth, defaultColWidth } = data;

  let bufferArray: number[] = [];

  /**
   * 上一列位置
   */
  let lastColPosition: number | null = null;

  for (let i = 0; i < maxCol; i++) {
    // if(isStop) {
    //   break;
    // }
    // bufferArray[i] = i;
    // 上一列位置存在
    if (lastColPosition !== null) {
      // 上一列位置存在，计算当前列位置
      const currentColPosition: number =
        lastColPosition + (colWidth[i - 1] || defaultColWidth);
      bufferArray.push(currentColPosition);
      lastColPosition = currentColPosition;
    } else {
      // 上一列位置不存在，计算当前列位置
      const manualAdjustedColIndexs: number[] = Object.keys(colWidth)
        .map(Number)
        .sort((a, b) => a - b);
      const manualColWidthDiffTotal = getManualColWidthDiffTotal(
        manualAdjustedColIndexs,
        data,
        i,
      );

      const currentColPosition: number =
        i * defaultColWidth + manualColWidthDiffTotal;
      bufferArray.push(currentColPosition);
      lastColPosition = currentColPosition;
    }
    if (isStop) {
      break;
    }
    if (bufferArray.length >= 1000) {
      self.postMessage(bufferArray);
      bufferArray = [];
    }
  }
};

self.onmessage = (event) => {
  const { data } = event;
  calcColPosition(data);
};
