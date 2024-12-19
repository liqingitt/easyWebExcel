import { Group, Layer, Rect, Text } from 'react-konva';

import React, { useMemo } from 'react';
import {
  getManualColWidthDiffTotal,
  getManualRowHeightDiffTotal,
} from '../const';
import { Cell } from '../sheetTypes';
import { DataViewProps } from '../types';

/**
 * 数据视图
 */
export const DataView: React.FC<DataViewProps> = (props) => {
  const {
    rowPositionRef,
    colPositionRef,
    sheet,
    gridLineAreaSize,
    maxRowCount,
    maxColCount,
    manualAdjustedRowIndexs,
    manualAdjustedColIndexs,
    verticalScrollRowCount,
    horizontalScrollColCount,
    scrollDistance,
  } = props;

  /**
   * 取出当前应该渲染的单元格数据
   */
  const renderCellData = useMemo(() => {
    const cellDataList: Array<{
      colPosition: number;
      rowPosition: number;
      width: number;
      height: number;
      rowIndex: number;
      colIndex: number;
      data: Cell;
    }> = [];

    Array.from({ length: maxRowCount }).forEach((_, $rowIndex) => {
      return Array.from({ length: maxColCount }).forEach((_, $colIndex) => {
        const rowIndex = $rowIndex + verticalScrollRowCount;
        const colIndex = $colIndex + horizontalScrollColCount;

        const cellData = sheet.cells[`${rowIndex}:${colIndex}`];

        if (!cellData) {
          return;
        }

        // 从行位置数组中获取当前行的行位置
        let rowPosition = rowPositionRef.current[rowIndex];

        // 如果缓存中找不到当前行的行位置，则需要计算
        if (typeof rowPosition !== 'number') {
          console.log('rowPosition我没命中优化');
          // 当前行之前所有手动调整过的行高与默认行高差异的和
          const manualRowHeightDiffTotal = getManualRowHeightDiffTotal(
            manualAdjustedRowIndexs,
            sheet,
            rowIndex,
          );
          rowPosition =
            sheet.defaultRowHeight * rowIndex + manualRowHeightDiffTotal;
        }

        // 从列位置数组中获取当前列的行位置
        let colPosition = colPositionRef.current[colIndex];

        // 如果缓存中找不到当前列的行位置，则需要计算
        if (typeof colPosition !== 'number') {
          console.log('colPosition我没命中优化');

          // 当前列之前所有手动调整过的列宽与默认列宽差异的和
          const manualColWidthDiffTotal = getManualColWidthDiffTotal(
            manualAdjustedColIndexs,
            sheet,
            colIndex,
          );
          colPosition =
            sheet.defaultColWidth * colIndex + manualColWidthDiffTotal;
        }

        cellDataList.push({
          colPosition,
          rowPosition,
          width: sheet.colWidth[colIndex] || sheet.defaultColWidth,
          height: sheet.rowHeight[rowIndex] || sheet.defaultRowHeight,
          rowIndex,
          colIndex,
          data: cellData,
        });
      });
    });

    return cellDataList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    maxRowCount,
    maxColCount,
    verticalScrollRowCount,
    horizontalScrollColCount,
    rowPositionRef.current,
    colPositionRef.current,
    sheet,
    manualAdjustedRowIndexs,
    manualAdjustedColIndexs,
  ]);

  return (
    <Layer
      clipFunc={(ctx) => {
        ctx.rect(
          sheet.defaultIndexColWidth,
          sheet.defaultIndexRowHeight,
          gridLineAreaSize.width,
          gridLineAreaSize.height,
        );
      }}
    >
      <Group
        offsetX={scrollDistance.horizontal - sheet.defaultIndexColWidth}
        offsetY={scrollDistance.vertical - sheet.defaultIndexRowHeight}
      >
        {renderCellData.map((cell) => {
          return (
            <React.Fragment key={cell.data.id}>
              <Rect
                x={cell.colPosition}
                y={cell.rowPosition}
                width={cell.width}
                height={cell.height}
                fill="transparent"
              ></Rect>
              <Text
                x={cell.colPosition}
                y={cell.rowPosition}
                width={cell.width}
                height={cell.height}
                align="center"
                verticalAlign="middle"
                text={String(cell.data.value)}
              />
            </React.Fragment>
          );
        })}
        <Rect
          x={0}
          y={0}
          width={gridLineAreaSize.width}
          height={gridLineAreaSize.height}
          fill="transparent"
        />
      </Group>
    </Layer>
  );
};
