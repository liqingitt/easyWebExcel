import { Sheet } from './sheetTypes';

/**
 * 计算当前列之前所有手动调整过的列宽与默认列宽差异的和
 * @param manualAdjustedColIndexs 手动调整过的列索引
 * @param sheet 表格数据
 * @param currentColIndex 当前列索引
 * @returns 当前列之前所有手动调整过的列宽与默认列宽差异的和
 */
export const getManualColWidthDiffTotal = (manualAdjustedColIndexs: number[], sheet: Sheet, currentColIndex: number) => {
  let manualColWidthDiffTotal = 0;
  for (let i = 0; i < manualAdjustedColIndexs.length; i++) {
    if (manualAdjustedColIndexs[i] >= currentColIndex) {
      break;
    }
    manualColWidthDiffTotal += sheet.colWidth[manualAdjustedColIndexs[i]] - sheet.defaultColWidth;
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
export const getManualRowHeightDiffTotal = (manualAdjustedRowIndexs: number[], sheet: Sheet, currentRowIndex: number) => {
  let manualRowHeightDiffTotal = 0;
  for (let i = 0; i < manualAdjustedRowIndexs.length; i++) {
    if (manualAdjustedRowIndexs[i] >= currentRowIndex) {
      break;
    }
    manualRowHeightDiffTotal += sheet.rowHeight[manualAdjustedRowIndexs[i]] - sheet.defaultRowHeight;
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
}
