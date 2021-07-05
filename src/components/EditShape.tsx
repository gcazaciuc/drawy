import { IShape } from "../types/Geometry"
import { DragPoint } from "./DragPoint"

interface IEditShapeProps {
    children?: React.ReactNode | null;
    shape: IShape;
    onGrabDragPoint: (pointIdx: number) => void;
    onReleaseDragPoint: (pointIdx: number) => void;
}

export const EditShape = ({children, shape, onGrabDragPoint, onReleaseDragPoint}: IEditShapeProps) => {
    const onUpdateShapeDragPoint = () => {}

    return (<>
       {shape.points.map((p, idx) => (<DragPoint point={p} key={idx} onGrabDragPoint={() => onGrabDragPoint(idx)} onReleaseDragPoint={() => onReleaseDragPoint(idx)}/>))}
    </>)
}