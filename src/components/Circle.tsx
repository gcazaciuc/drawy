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

    const radius = Math.sqrt(Math.pow((end[0] - start[0]),2) + Math.pow(end[1] - start[1], 2));
    return (<circle cx={start[0]} cy={start[1]} r={radius} stroke="red" strokeWidth="3" />)
}