import { Layer, Line, Rect, Text, Group } from 'react-konva';
import { GridLayerProps } from './types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { getIndexCode, getManualColWidthDiffTotal, getManualRowHeightDiffTotal } from './const';
import Konva from 'konva';

export const GridLayer: React.FC<GridLayerProps> = (props) => {
  const { sheet, size, scrollDistance, setScrollDistance } = props;

  const layerRef = useRef<Konva.Layer>(null);

  /**
   * 网格线区域总宽高
   */
  const gridLineAreaSize = useMemo(() => {
    return {
      width: size.width - sheet.defaultIndexColWidth,
      height: size.height - sheet.defaultIndexRowHeight
    }
  }, [sheet.defaultIndexColWidth, sheet.defaultIndexRowHeight, size.height, size.width]);


  /**
       * 手动调整过行高的行索引，升序排列
       */
  const manualAdjustedRowIndexs: number[] = useMemo(() => {
    return Object.keys(sheet.rowHeight).map(Number).sort((a, b) => a - b);
  }, [sheet.rowHeight]);

  /**
       * 手动调整过列宽的列索引，升序排列
       */
  const manualAdjustedColIndexs: number[] = useMemo(() => {
    return Object.keys(sheet.colWidth).map(Number).sort((a, b) => a - b);
  }, [sheet.colWidth]);

  /**
       * sheet总宽度
       */
  const sheetTotalWidth = useMemo(() => {
    //  手动调整列宽与默认列宽差异 的和
    const manualColWidthDiffTotal = Object.values(sheet.colWidth).reduce((cur, next) => cur + next - sheet.defaultColWidth, 0);
    // 默认列宽总和
    const defaultColWidthTotal = sheet.defaultColWidth * sheet.maxCol;
    // 默认列宽总和 + 手动调整列宽与默认列宽差异 的和
    return defaultColWidthTotal + manualColWidthDiffTotal;
  }, [sheet.colWidth, sheet.defaultColWidth, sheet.maxCol]);

  /**
       * sheet总高度
       */
  const sheetTotalHeight = useMemo(() => {
    // 手动调整行高与默认行高差异 的和
    const manualRowHeightDiffTotal = Object.values(sheet.rowHeight).reduce((cur, next) => cur + next - sheet.defaultRowHeight, 0);
    // 默认行高总和
    const defaultRowHeightTotal = sheet.defaultRowHeight * sheet.maxRow;
    // 默认行高总和 + 手动调整行高与默认行高差异 的和
    return defaultRowHeightTotal + manualRowHeightDiffTotal;
  }, [sheet.rowHeight, sheet.defaultRowHeight, sheet.maxRow]);


  /**
       * 横向网格线
       */
  const HorizontalGridLines = useMemo(() => {
    return <Group offsetX={-sheet.defaultIndexColWidth} offsetY={scrollDistance.vertical-sheet.defaultIndexRowHeight} >
      {
        Array.from({ length: sheet.maxRow }).map((_, index) => {
          // 当前行之前所有手动调整过的行高与默认行高差异的和
          const manualRowHeightDiffTotal = getManualRowHeightDiffTotal(manualAdjustedRowIndexs, sheet, index);
          return <Line
            key={index}
            points={[
              0,
              sheet.defaultRowHeight * (index+1) + manualRowHeightDiffTotal,
              size.width,
              sheet.defaultRowHeight * (index+1) + manualRowHeightDiffTotal
            ]}
            stroke="#ccc"
            strokeWidth={1}
          />
        })
      }
    </Group>
  }, [manualAdjustedRowIndexs, scrollDistance.vertical, sheet, size.width]);


  /**
     * 纵向网格线
     */
  const VerticalGridLines = useMemo(() => {
    return <Group offsetY={-sheet.defaultIndexRowHeight} offsetX={(  scrollDistance.horizontal - sheet.defaultIndexColWidth)} >
      {
        Array.from({ length: sheet.maxCol }).map((_, index) => {
          // 当前列之前所有手动调整过的列宽与默认列宽差异的和
          const manualColWidthDiffTotal = getManualColWidthDiffTotal(manualAdjustedColIndexs, sheet, index);
          return <Line
            key={index}
            points={[
              sheet.defaultColWidth * (index+1) + manualColWidthDiffTotal,
              0,
              sheet.defaultColWidth * (index+1) + manualColWidthDiffTotal,
              size.height
            ]}
            stroke="#ccc"
            strokeWidth={1}
          />
        })
      }
    </Group>

  }, [sheet, scrollDistance.horizontal, manualAdjustedColIndexs, size.height]);


  /**
   * 序号行
   */
  const IndexRow = useMemo(() => {
    return <>
      <Rect x={0} y={0}
       
        width={size.width}
        height={sheet.defaultIndexRowHeight}
        fill="#eee"
        stroke="#ccc"
        strokeWidth={1}
      />
      <Group offsetX={(scrollDistance.horizontal - sheet.defaultIndexColWidth)}>
        {
          Array.from({ length: sheet.maxRow }).map((_, index) => {
            // 当前行之前所有手动调整过的列宽与默认列宽差异的和
            const manualColWidthDiffTotal = getManualColWidthDiffTotal(manualAdjustedColIndexs, sheet, index);
            // 当前列宽
            const colWidth = sheet.colWidth[index] || sheet.defaultColWidth;
            return <React.Fragment key={index}>
              <Line
                points={[
                  sheet.defaultColWidth * (index+1) + manualColWidthDiffTotal,
                  0,
                  sheet.defaultColWidth * (index+1) + manualColWidthDiffTotal,
                  sheet.defaultIndexRowHeight
                ]}
                stroke="#ccc"
                strokeWidth={1}
              />
              <Text
                text={getIndexCode(index)}
                x={sheet.defaultColWidth * index + manualColWidthDiffTotal}
                y={0}
                fontSize={14}
                width={colWidth}
                height={sheet.defaultIndexRowHeight}
                align="center"
                verticalAlign="middle"
                fill="#666"
              />
              {/* 用于线条响应点击事件 */}
              <Rect
                onClick={() => {
                  console.log(index);
                }}
                x={sheet.defaultColWidth * (index+1) + manualColWidthDiffTotal}
                y={0}
                width={8}
                height={sheet.defaultIndexRowHeight}
                // fill="red"
                offsetX={(8/2)}
              />
            </React.Fragment>
          })
        }
      </Group>
    </>
  }, [manualAdjustedColIndexs, sheet, size.width, scrollDistance.horizontal]);

  /**
   * 序号列
   */
  const IndexCol = useMemo(() => {
    return <>
      <Rect x={0} y={0}
        width={sheet.defaultIndexColWidth}
        height={size.height}
        fill="#eee"
        stroke="#ccc"
        strokeWidth={1}
        onClick={() => {
          console.log('123');
        }}
      />
      <Group offsetY={scrollDistance.vertical-sheet.defaultIndexRowHeight}>
        {
          Array.from({ length: sheet.maxRow }).map((_, index) => {
            // 当前行之前所有手动调整过的行高与默认行高差异的和
            const manualRowHeightDiffTotal = getManualRowHeightDiffTotal(manualAdjustedRowIndexs, sheet, index);
            // 当前行高
            const rowHeight = sheet.rowHeight[index] || sheet.defaultRowHeight;

            return <React.Fragment key={index}>
              <Line
                onClick={() => {
                  console.log(index);
                    
                }}
                key={index}
                points={[
                  0,
                  sheet.defaultRowHeight * (index+1) + manualRowHeightDiffTotal,
                  sheet.defaultIndexColWidth,
                  sheet.defaultRowHeight * (index+1) + manualRowHeightDiffTotal
                ]}
                stroke="#ccc"
                strokeWidth={1}
              />
              <Text
                text={String(index + 1)}
                x={0}
                y={sheet.defaultRowHeight * index + manualRowHeightDiffTotal}
                fontSize={14}
                width={sheet.defaultIndexColWidth}
                height={rowHeight}
                align="center"
                verticalAlign="middle"
                fill="#666"
              />
              {/* 用于线条响应点击事件 */}
              <Rect
                onClick={() => {
                  console.log(index);
                }}
                x={0}
                y={sheet.defaultRowHeight * (index+1) + manualRowHeightDiffTotal}
                width={sheet.defaultIndexColWidth}
                height={8}
                // fill="red"
                offsetY={(8/2)}
              />
            </React.Fragment>
          })
        }
      </Group>
    </>
  }, [manualAdjustedRowIndexs, scrollDistance.vertical, sheet, size.height]);

  /**
   * 横向滚动条
   */
  const HorizontalScrollBar = useMemo(() => {

    /**
     * 是否允许横向滚动(总列宽大于网格线区域宽度时为 true)
     */
    const isAllowHorizontalScroll = sheetTotalWidth > gridLineAreaSize.width;

    if(!isAllowHorizontalScroll){
      return null;
    }

    /**
     * 当前网格区域总宽度占总列宽的比例
     */
    const gridLineAreaWidthRatio = gridLineAreaSize.width / sheetTotalWidth;

    /**
     * 横向滚动条宽度
     */
    const horizontalScrollBarWidth = gridLineAreaWidthRatio * (gridLineAreaSize.width );

    /**
     * 横向滚动条最大滚动距离
     */
    const horizontalScrollBarMaxScrollDistance = gridLineAreaSize.width - horizontalScrollBarWidth;

    /**
     * 横向滚动条最小滚动距离
     */
    const horizontalScrollBarMinScrollDistance =0;

    /**
     * 实际横向滚动距离 转换成 横向滚动条滚动距离
     */
    const horizontalScrollBarScrollDistance = scrollDistance.horizontal * gridLineAreaWidthRatio;

    return  <Rect
      draggable={true}
      dragBoundFunc={(pos) => {
        let x = pos.x;
        if(x < horizontalScrollBarMinScrollDistance){
          x = horizontalScrollBarMinScrollDistance;
        }else if(x > horizontalScrollBarMaxScrollDistance){
          x = horizontalScrollBarMaxScrollDistance;
        }
        return {
          x,
          y: size.height - 12
        }
      }}
      onDragMove={(e) => {
        const x = e.currentTarget.x();
        if(x !== horizontalScrollBarScrollDistance){
          setScrollDistance({
            horizontal: x/gridLineAreaWidthRatio,
            vertical: scrollDistance.vertical
          });
        }
      }}
      offsetX={-(sheet.defaultIndexColWidth)}
      cornerRadius={6}
      width={horizontalScrollBarWidth}
      x={horizontalScrollBarScrollDistance}
      y={size.height - 12}
      height={12}
      fill="#ccc"
      lineCap="round"
      opacity={0.5}
    />
  }, [gridLineAreaSize.width, scrollDistance.horizontal, scrollDistance.vertical, setScrollDistance, sheet.defaultIndexColWidth, sheetTotalWidth, size.height]);

  /**
   * 纵向滚动条
   */
  const VerticalScrollBar = useMemo(() => {

    /**
     * 是否允许纵向滚动(总行高大于网格线区域高度时为 true)
     */
    const isAllowVerticalScroll = sheetTotalHeight > gridLineAreaSize.height;

    if(!isAllowVerticalScroll){
      return null;
    }

    /**
     * 当前网格区域总高度占总行高的比例
     */
    const gridLineAreaHeightRatio = gridLineAreaSize.height / sheetTotalHeight;

    /**
     * 纵向滚动条宽度
     */
    const verticalScrollBarWidth = gridLineAreaHeightRatio * (gridLineAreaSize.height );

    /**
     * 纵向滚动条最大滚动距离
     */
    const verticalScrollBarMaxScrollDistance = gridLineAreaSize.height - verticalScrollBarWidth;

    /**
     * 纵向滚动条最小滚动距离
     */
    const verticalScrollBarMinScrollDistance =0;

    /**
     * 实际纵向滚动距离 转换成 纵向滚动条滚动距离
     */
    const verticalScrollBarScrollDistance = scrollDistance.vertical * gridLineAreaHeightRatio;

    return <Rect
      draggable={true}
      dragBoundFunc={(pos) => {
        let y = pos.y;
        if(y < verticalScrollBarMinScrollDistance){
          y = verticalScrollBarMinScrollDistance;
        }else if(y > verticalScrollBarMaxScrollDistance){
          y = verticalScrollBarMaxScrollDistance;
        }
        return {
          x: size.width - 12,
          y
        }
      }}
      onDragMove={(e) => {
        const y = e.currentTarget.y();
        if(y !== verticalScrollBarScrollDistance){
          setScrollDistance({
            horizontal: scrollDistance.horizontal,
            vertical: y/gridLineAreaHeightRatio
          });
        }
      }}
      offsetY={-(sheet.defaultIndexRowHeight)}
      cornerRadius={6}
      width={12}
      x={size.width - 12}
      y={verticalScrollBarScrollDistance}
      height={verticalScrollBarWidth}
      fill="#ccc"
      lineCap="round"
      opacity={0.5}
    />

  }, [gridLineAreaSize.height, scrollDistance.horizontal, scrollDistance.vertical, setScrollDistance, sheet.defaultIndexRowHeight, sheetTotalHeight, size.width]);



  /**
   * 滚轮事件
   */
  const handleWheel = useCallback((e: WheelEvent) => {

    // 鼠标相对于layer的坐标
    const mousePos = layerRef.current?.getStage()?.getPointerPosition();
    // 出现负数表示在layer外
    if(!mousePos || mousePos?.x <= 0 || mousePos?.y <= 0){
      return;
    }
    // 大于size.width 或 size.height 表示在layer外
    if(mousePos?.x >= size.width || mousePos?.y >= size.height){
      return;
    }


    e.preventDefault()
   
    // 判断滚动方向
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
  
    
    // 设置滚动距离
    setScrollDistance(state => {
  
      // 设置横向滚动距离
      let newHorizontal = state.horizontal + deltaX;
      if(newHorizontal < 0){
        newHorizontal =0;
      }else if(newHorizontal > sheetTotalWidth - gridLineAreaSize.width){
        newHorizontal = sheetTotalWidth - gridLineAreaSize.width;
      }
  
      // 设置纵向滚动距离
      let newVertical = state.vertical + deltaY;
      if(newVertical < 0){
        newVertical =0;
      }else if(newVertical > sheetTotalHeight - gridLineAreaSize.height){
        newVertical = sheetTotalHeight - gridLineAreaSize.height;
      }
  
      return {
        horizontal: newHorizontal,
        vertical: newVertical
      }
    });
  }, [gridLineAreaSize.height, gridLineAreaSize.width, setScrollDistance, sheetTotalHeight, sheetTotalWidth, size.height, size.width]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // 如果当前滚动距离已经超出了最大滚动距离，则进行修正（总列宽或总行高发生了变化时会出现）
    let newHorizontal:number | null = null;
    let newVertical:number | null = null;
    if(scrollDistance.horizontal > sheetTotalWidth - gridLineAreaSize.width){
      newHorizontal = sheetTotalWidth - gridLineAreaSize.width;
    }
    if(scrollDistance.vertical > sheetTotalHeight - gridLineAreaSize.height){
      newVertical = sheetTotalHeight - gridLineAreaSize.height;
    }
    if(newHorizontal !== null || newVertical !== null){
      setScrollDistance({
        horizontal: newHorizontal || scrollDistance.horizontal,
        vertical: newVertical || scrollDistance.vertical
      });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    }
  }, [gridLineAreaSize.height, gridLineAreaSize.width, handleWheel, scrollDistance.horizontal, scrollDistance.vertical, setScrollDistance, sheetTotalHeight, sheetTotalWidth]);


  return <Layer 
    ref={layerRef}
  >
    <Group>
    {/* 渲染横向网格线 */}
    {HorizontalGridLines}
    {/* 渲染纵向网格线 */}
    {VerticalGridLines}
    </Group>
    {/* 渲染序号行 */}
    {IndexRow}
    {/* 渲染序号列 */}
    {IndexCol}
    {/* 全选按钮 */}
    <Rect
      x={0}
      y={0}
      width={sheet.defaultIndexColWidth}
      height={sheet.defaultIndexRowHeight}
      fill='#eee'
      stroke='#ccc'
      strokeWidth={1}
    />
    {/* 渲染横向滚动条 */}
    {HorizontalScrollBar}
    {/* 渲染纵向滚动条 */}
    {VerticalScrollBar}

 
  
  </Layer>
}