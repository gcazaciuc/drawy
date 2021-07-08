import { Point } from "../types/Geometry"

interface IDragPointProps {
    point: Point;
    onGrabDragPoint: (point: Point, mousePos: {x: number, y: number}) => void;
    onReleaseDragPoint?: () => void;
}

export const DragPoint = ({point, onGrabDragPoint, onReleaseDragPoint}: IDragPointProps) => {

    const grabDragPoint = (e: React.MouseEvent) => {
        console.log('Updating drag point', e);
        onGrabDragPoint(point, {x: e.clientX, y: e.clientY});
    }

    const releaseDragPoint = (e: React.MouseEvent) => {
        onReleaseDragPoint && onReleaseDragPoint();
    }

    return (<circle cx={point[0]} cy={point[1]} r={3} onMouseDown={grabDragPoint} onMouseUp={releaseDragPoint} stroke="green" strokeWidth="1" />)
}