import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { DataView } from './components/DataView';
import { GridLayer } from './components/GridLayer';
import { getScrollColIndex, getScrollRowIndex } from './const';
import { Cell, Selection, Sheet } from './sheetTypes';
import { EasyWebExcelProps } from './types';

const sheetData: Sheet = {
  id: '1',
  name: 'Sheet1',
  maxRow: 1000,
  maxCol: 100000,
  cells: {
    ...Array(1000)
      .fill(0)
      .reduce(
        (acc, _, index) => ({
          ...acc,
          [`${index}:${index}`]: {
            id: `${index}:${index}`,
            value: `单元格${index}`,
          },
        }),
        {} as Record<string, Cell>,
      ),
  },
  rowHeight: {
    0: 100,
  },
  colWidth: {
    2: 300,
    // 10:300,
    // 100:1000,
  },
  defaultRowHeight: 25,
  defaultColWidth: 100,
  defaultIndexRowHeight: 30,
  defaultIndexColWidth: 50,
};

const EasyWebExcel: React.FC<EasyWebExcelProps> = (props) => {
  const { size } = props;

  /**
   * 滚动条滚动距离
   */
  const [scrollDistance, setScrollDistance] = useState({
    horizontal: 0,
    vertical: 0,
  });

  /**
   * 表格数据
   */
  const [sheet] = useState(sheetData);

  /**
   * 选区
   */
  const [, setSelection] = useState<Selection>();

  /**
   * 计算列位置线程
   */
  const calcColPositionWorkerRef = useRef<Worker | null>(null);

  /**
   * 存储列位置
   */
  const colPositionRef = useRef<number[]>([]);

  /**
   * 当总列数、默认列宽、列宽发生变化时，重新计算列位置
   * 未了防止使用到旧的缓存数据，在useMemo 中清空缓存数据，并重新计算
   */
  useMemo(() => {
    if (calcColPositionWorkerRef.current) {
      colPositionRef.current = [];
      calcColPositionWorkerRef.current?.postMessage(sheet);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet.maxCol, sheet.defaultColWidth, sheet.colWidth]);

  /**
   * 计算行位置线程
   */
  const calcRowPositionWorkerRef = useRef<Worker | null>(null);

  /**
   * 存储行位置
   */
  const rowPositionRef = useRef<number[]>([]);

  /**
   * 当总行数、默认行高、行高发生变化时，重新计算行位置
   */
  useMemo(() => {
    if (calcRowPositionWorkerRef.current) {
      rowPositionRef.current = [];
      calcRowPositionWorkerRef.current?.postMessage(sheet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet.maxRow, sheet.defaultRowHeight, sheet.rowHeight]);

  /**
   * 手动调整过行高的行索引，升序排列
   */
  const manualAdjustedRowIndexs: number[] = useMemo(() => {
    return Object.keys(sheet.rowHeight)
      .map(Number)
      .sort((a, b) => a - b);
  }, [sheet.rowHeight]);

  /**
   * 手动调整过列宽的列索引，升序排列
   */
  const manualAdjustedColIndexs: number[] = useMemo(() => {
    return Object.keys(sheet.colWidth)
      .map(Number)
      .sort((a, b) => a - b);
  }, [sheet.colWidth]);

  /**
   * 横向滚动的列数
   */
  const horizontalScrollColCount = useMemo(() => {
    return getScrollColIndex(
      scrollDistance.horizontal,
      colPositionRef.current,
      manualAdjustedColIndexs,
      sheet,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    colPositionRef.current,
    manualAdjustedColIndexs,
    scrollDistance.horizontal,
    sheet,
  ]);

  /**
   * 网格线区域总宽高
   */
  const gridLineAreaSize = useMemo(() => {
    return {
      width: size.width - sheet.defaultIndexColWidth,
      height: size.height - sheet.defaultIndexRowHeight,
    };
  }, [
    sheet.defaultIndexColWidth,
    sheet.defaultIndexRowHeight,
    size.height,
    size.width,
  ]);

  /**
   * 当前窗口最大容纳的列数
   */
  const maxColCount = useMemo(() => {
    return (
      getScrollColIndex(
        scrollDistance.horizontal + gridLineAreaSize.width,
        colPositionRef.current,
        manualAdjustedColIndexs,
        sheet,
      ) -
      horizontalScrollColCount +
      1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollDistance.horizontal,
    gridLineAreaSize.width,
    colPositionRef.current,
    manualAdjustedColIndexs,
    sheet,
    horizontalScrollColCount,
  ]);

  /**
   * 纵向滚动的行数
   */
  const verticalScrollRowCount = useMemo(() => {
    return getScrollRowIndex(
      scrollDistance.vertical,
      rowPositionRef.current,
      manualAdjustedRowIndexs,
      sheet,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollDistance.vertical,
    rowPositionRef.current,
    manualAdjustedRowIndexs,
    sheet,
  ]);

  /**
   * 当前窗口最大容纳的行数
   */
  const maxRowCount = useMemo(() => {
    return (
      getScrollRowIndex(
        scrollDistance.vertical + gridLineAreaSize.height,
        rowPositionRef.current,
        manualAdjustedRowIndexs,
        sheet,
      ) -
      verticalScrollRowCount +
      1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollDistance.vertical,
    gridLineAreaSize.height,
    rowPositionRef.current,
    manualAdjustedRowIndexs,
    sheet,
    verticalScrollRowCount,
  ]);

  useEffect(() => {
    // 启动计算位置线程
    const calcColPositionWorker = new Worker(
      new URL('./workers/calcColPositionWork', import.meta.url),
    );
    const calcRowPositionWorker = new Worker(
      new URL('./workers/calcRowPositionWork', import.meta.url),
    );
    calcColPositionWorkerRef.current = calcColPositionWorker;
    calcRowPositionWorkerRef.current = calcRowPositionWorker;

    // 发送表格数据
    calcColPositionWorker.postMessage(sheet);
    calcRowPositionWorker.postMessage(sheet);

    // 接收计算结果
    calcColPositionWorker.onmessage = (event) => {
      colPositionRef.current = [...colPositionRef.current, ...event.data];
    };
    calcRowPositionWorker.onmessage = (event) => {
      rowPositionRef.current = [...rowPositionRef.current, ...event.data];
    };

    return () => {
      calcColPositionWorker.terminate();
      calcRowPositionWorker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!size) {
    return null;
  }

  return (
    <Stage width={size.width} height={size.height}>
      <GridLayer
        verticalScrollRowCount={verticalScrollRowCount}
        horizontalScrollColCount={horizontalScrollColCount}
        manualAdjustedRowIndexs={manualAdjustedRowIndexs}
        manualAdjustedColIndexs={manualAdjustedColIndexs}
        gridLineAreaSize={gridLineAreaSize}
        setSelection={setSelection}
        colPositionRef={colPositionRef}
        rowPositionRef={rowPositionRef}
        sheet={sheet}
        size={size}
        scrollDistance={scrollDistance}
        setScrollDistance={setScrollDistance}
        maxRowCount={maxRowCount}
        maxColCount={maxColCount}
      />
      <DataView
        colPositionRef={colPositionRef}
        rowPositionRef={rowPositionRef}
        sheet={sheet}
        size={size}
        scrollDistance={scrollDistance}
        gridLineAreaSize={gridLineAreaSize}
        maxRowCount={maxRowCount}
        maxColCount={maxColCount}
        manualAdjustedRowIndexs={manualAdjustedRowIndexs}
        manualAdjustedColIndexs={manualAdjustedColIndexs}
        verticalScrollRowCount={verticalScrollRowCount}
        horizontalScrollColCount={horizontalScrollColCount}
      />
    </Stage>
  );
};

const EasyWebExcelWrap: React.FC<Partial<EasyWebExcelProps>> = (props) => {
  const { size } = props;
  if (!size) {
    return null;
  }
  return <EasyWebExcel {...props} size={size} />;
};

export default EasyWebExcelWrap;
