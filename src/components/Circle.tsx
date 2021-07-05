import {Point } from "../types/Geometry"
interface CircleProps {
    points: Array<Point>;
    isClosed?: boolean;
}
export const Circle = ({points}: CircleProps) => {
    if (points.length < 2) {
        return null;
    }
    const [start, end] = points;

    if(!start || !end) {
        return null;
    }

    const radius = Math.abs(end[0] - start[0]);
    return (<circle cx={start[0]} cy={start[1]} r={radius} stroke="red" strokeWidth="3" />)
}