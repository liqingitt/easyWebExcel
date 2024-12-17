import { Sheet } from './sheetTypes';

export interface EasyWebExcelProps {
    size?: {
        width: number;
        height: number;
    }
}
export interface GridLayerProps {
    sheet: Sheet;
    size: {
        width: number;
        height: number;
    }
    scrollDistance: {
        horizontal: number;
        vertical: number;
    }
    setScrollDistance: React.Dispatch<React.SetStateAction<GridLayerProps['scrollDistance']>>
}