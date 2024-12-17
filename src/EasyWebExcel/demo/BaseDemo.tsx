import React, { useRef } from 'react';
import { EasyWebExcel } from 'easyWebExcel';
import { useSize } from 'ahooks';
export default () =>{
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageContainerSize = useSize(stageContainerRef);
  return <div ref={stageContainerRef}>
    <EasyWebExcel size={stageContainerSize ?  { width:stageContainerSize?.width, height: 500 } : undefined} />
  </div>
}