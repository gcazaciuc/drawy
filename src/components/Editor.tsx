import { useRef, useState } from "react";
import { PEN_TOOL, RECTANGLE_TOOL } from "../constants/constants";
import { IShape, Point, ShapeType } from "../types/Geometry";
import { Rectangle } from "./Rectangle";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Toolbar } from "./Toolbar";
import { CIRCLE_TOOL } from "../constants/constants";
import { Line } from "./Line";
import { LINE_TOOL } from "../constants/constants";


export const Editor = () => {
    const [currentDrawingPoints, setCurrentDrawingPoints] = useState<ShapeType>([]);
    const [previewPoint, setPreviewPoint] = useState<Point | null>(null);
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
                    setPreviewPoint(null);
                }
            }

            if (selectedTool === RECTANGLE_TOOL) {
                if (currentDrawingPoints.length < 2) {
                    setCurrentDrawingPoints((points) => {
                        return points.concat([point])
                    });
                } else {
                    const newShape = {type: 'rectangle', points: currentDrawingPoints};
                    setShapes((shapes) => shapes.concat(newShape));
                    setCurrentDrawingPoints([]);
                    setPreviewPoint(null);
                }
            }

            if (selectedTool === CIRCLE_TOOL) {
                if (currentDrawingPoints.length < 2) {
                    setCurrentDrawingPoints((points) => {
                        return points.concat([point])
                    });
                } else {
                    const newShape = {type: 'circle', points: currentDrawingPoints};
                    setShapes((shapes) => shapes.concat(newShape));
                    setCurrentDrawingPoints([]);
                    setPreviewPoint(null);
                }
            }

            if (selectedTool === LINE_TOOL) {
                if (currentDrawingPoints.length < 2) {
                    setCurrentDrawingPoints((points) => {
                        return points.concat([point])
                    });
                } else {
                    const newShape = {type: 'line', points: currentDrawingPoints};
                    setShapes((shapes) => shapes.concat(newShape));
                    setCurrentDrawingPoints([]);
                    setPreviewPoint(null);
                }
            }
    }

    const showPreview = (e: any) => {
        if (!currentDrawingPoints.length) {
            return;
        }

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
            case 'circle':
                return (<Circle points={shape.points} />)
            case 'line':
                return (<Line points={shape.points} />)
        }
        
    }
    const getCurrentShape = () => {
        switch(selectedTool) {
            case PEN_TOOL:
                return 'path';
            case RECTANGLE_TOOL:
                return 'rectangle';
            case CIRCLE_TOOL:
                return 'circle';
            case LINE_TOOL:
                return 'line';
        }

        return '';
    }
    const previewPoints = previewPoint ? currentDrawingPoints.concat([previewPoint]) : currentDrawingPoints;
    return (
    <div>
        <Toolbar onSelectTool={onSelectTool} />
        <svg height="400" width="400" onClick={onCanvasClicked} onMouseMove={showPreview} ref={container} style={{border: '1px solid blue'}}>
            {currentDrawingPoints.length && previewPoint && renderShape({type: getCurrentShape(), points:  previewPoints }, false)}
            {shapes.map((shape) => renderShape(shape, true))}
        </svg>
    </div>
    );
}