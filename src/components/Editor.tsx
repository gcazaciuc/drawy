import React, { useRef, useState } from "react";
import { PEN_TOOL } from "../constants/constants";
import { IShape, Point, ShapeType } from "../types/Geometry";
import { Rectangle } from "./Rectangle";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Toolbar } from "./Toolbar";
import { Line } from "./Line";
import pointInPolygon from 'point-in-polygon';
import pointLineDistance from 'point-line-distance';
import { EditShape } from "./EditShape";
import { observer } from "mobx-react";
import { EditorContext } from "../state/editor/EditorContext";

const pointInCircle = (point: Point, points: Point[]) => {
    const [start, end] = points;
    const radius = Math.sqrt(Math.pow((end[0] - start[0]),2) + Math.pow(end[1] - start[1], 2));
    const distanceToCenter = Math.sqrt(Math.pow((point[0] - start[0]),2) + Math.pow(point[1] - start[1], 2));

    return distanceToCenter <= radius;
}

const pointInLine = (point: Point, points: Point[]) => {
    return pointLineDistance(point.concat([0]), points[0].concat([0]), points[1].concat([0])) < 5;
}

interface IEditorProps {
    editorContext: EditorContext;
}

export const Editor = observer(({ editorContext }: IEditorProps) => {
    const [currentDrawingPoints, setCurrentDrawingPoints] = useState<ShapeType>([]);
    const [previewPoint, setPreviewPoint] = useState<Point | null>(null);
    const [shapes, setShapes] = useState<Array<IShape>>([]);
    const [editedShape, setEditedShape] = useState<IShape | null>(null);
    const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
    // const [selectedTool, setSelectedTool] = useState<string|null>(null)
    const selectedTool = editorContext.tool;
    const idCounter = useRef(1);
    const container = useRef<SVGSVGElement>(null);
    const SENSITIVITY = 5;
    const isShapeClosed = (startingPoint: Point, point: Point) => {
        return startingPoint && point && Math.abs(startingPoint[0] - point[0]) < SENSITIVITY && Math.abs(startingPoint[1] - point[1]) < SENSITIVITY;
    }
    const isStandardShapeClosed = () => currentDrawingPoints.length >= 1;
    const uuid = () => `shape_${idCounter.current++}`;

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
            editorContext.handleClick(point);

            if (selectedTool !== null) {
                if (selectedTool === PEN_TOOL) {
                    if (isShapeClosed(currentDrawingPoints[0], point)) {
                        const newShape = {id: uuid(), type: selectedTool, points: currentDrawingPoints};
                        setShapes((shapes) => shapes.concat(newShape));
                        setCurrentDrawingPoints([]);
                        setPreviewPoint(null);
                    } else {
                        setCurrentDrawingPoints((points) => {
                            return points.concat([point])
                        });
                    }
                } else {
                    if (isStandardShapeClosed()) {
                        const newShape = {id: uuid(), type: selectedTool, points: currentDrawingPoints.concat([point])};
                        setShapes((shapes) => shapes.concat(newShape));
                        setCurrentDrawingPoints([]);
                        setPreviewPoint(null);
                    } else {
                        setCurrentDrawingPoints((points) => {
                            return points.concat([point])
                        });
                    }
                }
            } else {
                const selectedShape = shapes.find((shape) => {
                    switch(shape.type) {
                        case 'path':
                            return pointInPolygon(point, shape.points);
                        case 'rectangle':
                            return pointInPolygon(point, [
                                shape.points[0],
                                [shape.points[0][0], shape.points[1][1]],
                                shape.points[1],
                                [shape.points[1][0], shape.points[0][1]]
                            ]);
                        case 'circle':
                            return pointInCircle(point, shape.points);
                        case 'line':
                            return pointInLine(point, shape.points);
                    }
                });
                if (selectedShape) {
                    setEditedShape(selectedShape);
                } else {
                    setEditedShape(null);
                }
            }
    }

    const showPreview = (e: any) => {
        const point = getPointInCanvas(e);
        if (!point) {
            return;
        }
        if(draggedPoint !== null) {
            updateDragPoint(draggedPoint, point);
        }
        if (currentDrawingPoints.length) {
            setPreviewPoint(point);
        }
    }
    const updateDragPoint = (idx: number, point: Point) => {
        const updatedShapes = shapes.map((shape) => {
            if (editedShape && shape.id === editedShape.id) {
                const newPoints = shape.points.slice();
                newPoints[idx] = point;
                shape.points = newPoints;
            }

            return shape;
        })
        setShapes(updatedShapes)
    }
    const onSelectTool = (tool: string) => { 
       editorContext.toolSelected(tool);
    }

    const onGrabDragPoint = (idx: number) => {
        setDraggedPoint(idx);
    }

    const onReleaseDragPoint = (idx: number) => {
        setDraggedPoint(null);
    }

    const handleKeyPresses = (e: React.KeyboardEvent) => {
        editorContext.handleKeyPress(e.key);

        switch(e.key) {
            case 'Backspace':
                if (editedShape) {
                    setShapes(shapes.filter((s) => s.id !== editedShape.id));
                    setEditedShape(null);
                    setDraggedPoint(null);
                }
                break;
        }
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
            default:
                return null;
        }
        
    }

    const previewPoints = previewPoint ? currentDrawingPoints.concat([previewPoint]) : currentDrawingPoints;
    return (
        <div tabIndex={-1} onKeyDown={handleKeyPresses}>
            <Toolbar onSelectTool={onSelectTool} selectedTool={selectedTool} />
            <svg height="400" width="400" onClick={onCanvasClicked} onMouseMove={showPreview} ref={container} style={{border: '1px solid blue'}}>
                {currentDrawingPoints.length && previewPoint && selectedTool && renderShape({id: 'preview', type: selectedTool, points:  previewPoints }, false)}
                {shapes.map((shape) => renderShape(shape, true))}
                {editedShape && <EditShape onGrabDragPoint={onGrabDragPoint} onReleaseDragPoint={onReleaseDragPoint} shape={editedShape} />}
            </svg>
        </div>
    );
});