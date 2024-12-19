import { EasyWebExcel } from '@liqingitt-fe/easy-web-excel';
import { useSize } from 'ahooks';
import React, { useRef } from 'react';
export default () => {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageContainerSize = useSize(stageContainerRef);
  return (
    <div ref={stageContainerRef}>
      <EasyWebExcel
        size={
          stageContainerSize
            ? { width: stageContainerSize?.width, height: 500 }
            : undefined
        }
      />
    </div>
  );
};
