# EasyWebExcel

webExcel

```jsx
import { EasyWebExcel } from 'easyWebExcel';
import { useSize } from 'ahooks';
import { useRef } from 'react';
export default () =>{
//   const stageContainerRef = useRef<HTMLDivElement>(null);
//   const stageContainerSize = useSize(stageContainerRef);
 
    return <div style={{width:"100%",height:"100%"}}
    ><EasyWebExcel size={{ width:500, height: 500 }} /></div>
}
```
