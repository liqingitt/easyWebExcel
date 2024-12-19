import { v4 as uuidv4 } from 'uuid';
import { getManualColWidthDiffTotal } from '../const';
import { Sheet } from '../sheetTypes';
/**
 * 当前计算的uuid
 */
let currentCalcUuid = '';

/**
 * 计算行位置
 * @param data
 */
const calcRowPosition = (data: Sheet, uuid: string) => {
  const { maxRow, rowHeight, defaultRowHeight } = data;

  let bufferArray: number[] = [];

  /**
   * 上一列位置
   */
  let lastColPosition: number | null = null;

  for (let i = 0; i < maxRow; i++) {
    // 上一列位置存在
    if (lastColPosition !== null) {
      // 上一列位置存在，计算当前列位置
      const currentColPosition: number =
        lastColPosition + (rowHeight[i - 1] || defaultRowHeight);
      bufferArray.push(currentColPosition);
      lastColPosition = currentColPosition;
    } else {
      // 上一列位置不存在，计算当前列位置
      const manualAdjustedColIndexs: number[] = Object.keys(rowHeight)
        .map(Number)
        .sort((a, b) => a - b);
      const manualColWidthDiffTotal = getManualColWidthDiffTotal(
        manualAdjustedColIndexs,
        data,
        i,
      );

      const currentColPosition: number =
        i * defaultRowHeight + manualColWidthDiffTotal;
      bufferArray.push(currentColPosition);
      lastColPosition = currentColPosition;
    }
    // 当重新计算时，结束当前计算任务
    if (currentCalcUuid !== uuid) {
      break;
    }
    if (bufferArray.length >= 1000) {
      if (currentCalcUuid !== uuid) {
        break;
      }
      self.postMessage(bufferArray);
      bufferArray = [];
    }
  }
  if (currentCalcUuid === uuid) {
    self.postMessage(bufferArray);
  }
};

self.onmessage = (event) => {
  const { data } = event;
  currentCalcUuid = uuidv4();
  calcRowPosition(data, currentCalcUuid);
};
