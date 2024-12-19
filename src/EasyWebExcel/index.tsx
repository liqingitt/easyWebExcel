import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { GridLayer } from './GridLayer';
import { Sheet } from './sheetTypes';
import { EasyWebExcelProps } from './types';

const sheetData: Sheet = {
  id: '1',
  name: 'Sheet1',
  maxRow: 1000,
  maxCol: 100000,
  cells: {},
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

  useEffect(() => {
    // 启动计算位置线程
    const calcColPositionWorker = new Worker(
      new URL('./calcColPositionWork', import.meta.url),
    );
    const calcRowPositionWorker = new Worker(
      new URL('./calcRowPositionWork', import.meta.url),
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
        colPositionRef={colPositionRef}
        rowPositionRef={rowPositionRef}
        sheet={sheet}
        size={size}
        scrollDistance={scrollDistance}
        setScrollDistance={setScrollDistance}
      />
    </Stage>
  );
};

export default EasyWebExcel;
