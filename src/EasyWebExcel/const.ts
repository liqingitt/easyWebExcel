import { Sheet } from './sheetTypes';

/**
 * 计算当前列之前所有手动调整过的列宽与默认列宽差异的和
 * @param manualAdjustedColIndexs 手动调整过的列索引
 * @param sheet 表格数据
 * @param currentColIndex 当前列索引
 * @returns 当前列之前所有手动调整过的列宽与默认列宽差异的和
 */
export const getManualColWidthDiffTotal = (
  manualAdjustedColIndexs: number[],
  sheet: Sheet,
  currentColIndex: number,
) => {
  let manualColWidthDiffTotal = 0;
  for (let i = 0; i < manualAdjustedColIndexs.length; i++) {
    if (manualAdjustedColIndexs[i] >= currentColIndex) {
      break;
    }
    manualColWidthDiffTotal +=
      sheet.colWidth[manualAdjustedColIndexs[i]] - sheet.defaultColWidth;
  }
  return manualColWidthDiffTotal;
};

/**
 * 计算当前行之前所有手动调整过的行高与默认行高差异的和
 * @param manualAdjustedRowIndexs 手动调整过的行索引
 * @param sheet 表格数据
 * @param currentRowIndex 当前行索引
 * @returns 当前行之前所有手动调整过的行高与默认行高差异的和
 */
export const getManualRowHeightDiffTotal = (
  manualAdjustedRowIndexs: number[],
  sheet: Sheet,
  currentRowIndex: number,
) => {
  let manualRowHeightDiffTotal = 0;
  for (let i = 0; i < manualAdjustedRowIndexs.length; i++) {
    if (manualAdjustedRowIndexs[i] >= currentRowIndex) {
      break;
    }
    manualRowHeightDiffTotal +=
      sheet.rowHeight[manualAdjustedRowIndexs[i]] - sheet.defaultRowHeight;
  }
  return manualRowHeightDiffTotal;
};

/**
 * 获取索引编码
 * @param index 索引
 * @returns 索引编码
 */
export const getIndexCode = (index: number): string => {
  if (index < 0) return '';

  let code = '';
  let num = index;

  while (num >= 0) {
    // 获取当前位的字母
    const charCode = (num % 26) + 65; // 65是字母'A'的ASCII码
    code = String.fromCharCode(charCode) + code;
    num = Math.floor(num / 26) - 1;
  }

  return code;
};

/**
 * 获取滚动列索引
 * @param scrollNumber 滚动距离
 * @param colPosition 列位置
 * @param manualAdjustedColIndexs 手动调整过的列索引
 * @param sheet 表格数据
 * @returns 滚动列索引
 */
export const getScrollColIndex = (
  scrollNumber: number,
  colPosition: number[],
  manualAdjustedColIndexs: number[],
  sheet: Sheet,
): number => {
  // 未滚动
  if (scrollNumber === 0) return 0;

  // 如果列位置已经计算过了，则直接使用列位置进行二分查找
  if (colPosition.length > 0) {
    // 二分查找获取滚动列索引
    let left = 0;
    let right = colPosition.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (colPosition[mid] === scrollNumber) {
        return mid;
      } else if (colPosition[mid] < scrollNumber) {
        if (
          mid === colPosition.length - 1 ||
          colPosition[mid + 1] > scrollNumber
        ) {
          return mid;
        }
        left = mid + 1;
      } else {
        if (mid === 0) {
          return 0;
        }
        right = mid - 1;
      }
    }
  }

  // 如果列位置未计算过，则需要计算列位置

  // 滚动列数
  let colCount = 0;

  // 滚动列的偏移量
  let colOffset = 0;

  for (let i = 0; i < manualAdjustedColIndexs.length; i++) {
    // 手动调整过列宽的下标
    const manualAdjustedColIndex = manualAdjustedColIndexs[i];

    // 两个调整过列宽的列之间的间距
    const colWidthDiff =
      (manualAdjustedColIndex - colCount) * sheet.defaultColWidth;

    // 如果间距大于等于滚动距离，则说明当前滚动列在这个区间范围内
    if (colWidthDiff >= scrollNumber) {
      return (
        colCount +
        Math.floor((scrollNumber - colOffset) / sheet.defaultColWidth)
      );
    }

    colOffset = +colWidthDiff;

    // 当前调整过列宽的列宽
    const colWidth = sheet.colWidth[manualAdjustedColIndex];

    // 如果当前调整过列宽的列宽 加 滚动列的偏移量 大于等于滚动距离，则说明当前调整过列宽的列，便是滚动到的列
    if (colWidth + colOffset >= scrollNumber) {
      return manualAdjustedColIndex;
    }

    colOffset += colWidth;

    // 更新滚动列数
    colCount = manualAdjustedColIndex;
  }

  // 所有调整过列宽的列都便利完了，剩下的都是未调整过列宽的列
  // 用滚动距离减去 当前滚动列的偏移量，然后除以默认列宽，得到滚动列数
  return (
    colCount + Math.floor((scrollNumber - colOffset) / sheet.defaultColWidth)
  );
};

/**
 * 获取滚动行索引
 * @param scrollNumber 滚动距离
 * @param manualAdjustedRowIndexs 手动调整过的行索引
 * @param sheet 表格数据
 * @returns 滚动行索引
 */
export const getScrollRowIndex = (
  scrollNumber: number,
  rowPosition: number[],
  manualAdjustedRowIndexs: number[],
  sheet: Sheet,
): number => {
  // 未滚动
  if (scrollNumber === 0) return 0;

  // 如果行位置已经计算过了，则直接使用行位置进行二分查找
  if (rowPosition.length > 0) {
    // console.log('行二分查找');

    // 二分查找获取滚动行索引
    let left = 0;
    let right = rowPosition.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (rowPosition[mid] === scrollNumber) {
        return mid;
      } else if (rowPosition[mid] < scrollNumber) {
        if (
          mid === rowPosition.length - 1 ||
          rowPosition[mid + 1] > scrollNumber
        ) {
          return mid;
        }
        left = mid + 1;
      } else {
        if (mid === 0) {
          return 0;
        }
        right = mid - 1;
      }
    }
    // console.log('行二分查找结束');
  }

  // 滚动行数
  let rowCount = 0;

  // 滚动行的偏移量
  let rowOffset = 0;

  for (let i = 0; i < manualAdjustedRowIndexs.length; i++) {
    // 手动调整过行高的下标
    const manualAdjustedRowIndex = manualAdjustedRowIndexs[i];

    // 两个调整过行高的行之间的间距
    const rowHeightDiff =
      (manualAdjustedRowIndex - rowCount) * sheet.defaultRowHeight;

    // 如果间距大于等于滚动距离，则说明当前滚动行在这个区间范围内
    if (rowHeightDiff >= scrollNumber) {
      return (
        rowCount +
        Math.floor((scrollNumber - rowOffset) / sheet.defaultRowHeight)
      );
    }

    rowOffset += rowHeightDiff;

    // 当前调整过行高的行高
    const rowHeight = sheet.rowHeight[manualAdjustedRowIndex];

    // 如果当前调整过行高的行高 加 滚动行的偏移量 大于等于滚动距离，则说明当前调整过行高的行，便是滚动到的行
    if (rowHeight + rowOffset >= scrollNumber) {
      return manualAdjustedRowIndex;
    }

    rowOffset += rowHeight;

    // 更新滚动行数
    rowCount = manualAdjustedRowIndex;
  }

  // 所有调整过行高的行都遍历完了，剩下的都是未调整过行高的行
  // 用滚动距离减去 当前滚动行的偏移量，然后除以默认行高，得到滚动行数
  return (
    rowCount + Math.floor((scrollNumber - rowOffset) / sheet.defaultRowHeight)
  );
};
