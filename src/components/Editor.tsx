import { useRef, useState } from "react";
import { PEN_TOOL, RECTANGLE_TOOL } from "../constants/constants";
import { IShape, Point, ShapeType } from "../types/Geometry";
import { Rectangle } from "./Rectangle";
import { Shape } from "./Shape";
import { Toolbar } from "./Toolbar";


export const Editor = () => {
    const [currentDrawingPoints, setCurrentDrawingPoints] = useState<ShapeType>([]);
    const [previewPoint, setPreviewPoint] = useState<Point>([0,0]);
    const [shapes, setShapes] = useState<Array<IShape>>([]);
    const [selectedTool, setSelectedTool] = useState(PEN_TOOL)

    const container = useRef<SVGSVGElement>(null);
    const SENSITIVITY = 5;
    const isShapeClosed = (startingPoint: Point, point: Point) => {
        return startingPoint && point && Math.abs(startingPoint[0] - point[0]) < SENSITIVITY && Math.abs(startingPoint[1] - point[1]) < SENSITIVITY;
    }
    const getPointInCanvas = (e: any) => {
        if(container === null || !container.current) {
            return null;
        }
        const boundingBox = container.current.getBoundingClientRect();
        const deltaX = e.clientX - boundingBox.x
        const deltaY = e.clientY - boundingBox.y;
        const point: Point = [deltaX, deltaY];

        return point;
    }
    const onCanvasClicked = (e: any) => {
            const point = getPointInCanvas(e);
            if (!point) {
                return;
            }

            if (selectedTool === PEN_TOOL) {
                if (!isShapeClosed(currentDrawingPoints[0], point)) {
                    setCurrentDrawingPoints((points) => {
                        return points.concat([point])
                    });
                } else {
                    const newShape = {type: 'path', points: currentDrawingPoints};
                    setShapes((shapes) => shapes.concat(newShape));
                    setCurrentDrawingPoints([]);
                    setPreviewPoint([0,0]);
                }
            }

            if (selectedTool === RECTANGLE_TOOL) {
                if (currentDrawingPoints.length < 1) {
                    setCurrentDrawingPoints((points) => {
                        return points.concat([point])
                    });
                } else {
                    const newShape = {type: 'rectangle', points: currentDrawingPoints};
                    setShapes((shapes) => shapes.concat(newShape));
                    setCurrentDrawingPoints([]);
                    setPreviewPoint([0,0]);
                }
            }
    }

    const showPreview = (e: any) => {
        const point = getPointInCanvas(e);
        if (!point) {
            return;
        }
        setPreviewPoint(point);
    }

    const onSelectTool = (tool: string) => {
       setSelectedTool(tool);
    }
    const renderShape = (shape: IShape, isClosed: boolean = true) => {
        switch(shape.type) {
            case 'path':
                return (<Shape points={shape.points} isClosed={isClosed} />);
            case 'rectangle':
                return (<Rectangle points={shape.points} />)
        }
        
    }
    const getCurrentShape = () => {
        switch(selectedTool) {
            case PEN_TOOL:
                return 'path';
            case RECTANGLE_TOOL:
                return 'rectangle';
        }

        return '';
    }
    return (
    <div>
        <Toolbar onSelectTool={onSelectTool} />
        <svg height="400" width="400" onClick={onCanvasClicked} onMouseMove={showPreview} ref={container} style={{border: '1px solid blue'}}>
                {renderShape({type: getCurrentShape(), points: currentDrawingPoints.concat([previewPoint])}, false)}
                {shapes.map((shape) => renderShape(shape, true))}
            </svg>
    </div>
    );
}