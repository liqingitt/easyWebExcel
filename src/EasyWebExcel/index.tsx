import { Stage } from 'react-konva';
import { EasyWebExcelProps } from './types';
import { GridLayer } from './GridLayer';
import { Sheet } from './sheetTypes';
import { useEffect, useState } from 'react';
import React from 'react';
// TODO: 改变行高列宽渲染出问题
// TODO: 滚动条最小时，滚到到极限时会超出
const sheet: Sheet = {
  id: '1',
  name: 'Sheet1',
  maxRow: 10000,
  maxCol: 10000,
  cells: {
  
  },
  rowHeight: {
    0: 100,
  },
  colWidth: {
    2:300,
    // 10:300,
    // 100:1000,
  },
  defaultRowHeight: 25,
  defaultColWidth: 100,
  defaultIndexRowHeight: 30,
  defaultIndexColWidth: 50,
}

const EasyWebExcel: React.FC<EasyWebExcelProps> = (props) => {
  const { size } = props;

  /**
   * 滚动条滚动距离
   */
  const [scrollDistance, setScrollDistance] = useState({
    horizontal: 0,
    vertical: 0
  });


  useEffect(() => {
    
    const worker = new Worker(new URL('./calcColPositionWork',import.meta.url));
    worker.onmessage = (event) => {
      console.log(event.data);
    }
  }, []);


  if (!size) {
    return null;
  }

 

  return <Stage width={size.width} height={size.height}>
    <GridLayer
      sheet={sheet}
      size={size}
      scrollDistance={scrollDistance}
      setScrollDistance={setScrollDistance}
    />
  </Stage>
}

export default EasyWebExcel;