import {Point } from "../types/Geometry"
interface RectangleProps {
    points: Array<Point>;
    isClosed?: boolean;
}
export const Rectangle = ({points}: RectangleProps) => {
    if (points.length < 2) {
        return null;
    }
    const [start, end] = points;
    const width = Math.abs(end[0] - start[0]);
    const height = Math.abs(end[1] - start[1]);
    return (<rect x={start[0]} y={start[1]} width={width} height={height} stroke="red" strokeWidth="3" fill="none" />)
}