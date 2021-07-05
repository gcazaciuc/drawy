import {Point } from "../types/Geometry"
interface LineProps {
    points: Array<Point>;
    isClosed?: boolean;
}
export const Line = ({points}: LineProps) => {
    if (points.length < 2) {
        return null;
    }
    const [start, end] = points;

    if(!start || !end) {
        return null;
    }

    return (<line x1={start[0]} y1={start[1]}  x2={end[0]} y2={end[1]} stroke="red" strokeWidth="3" />)
}