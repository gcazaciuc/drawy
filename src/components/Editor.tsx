import React, { useRef } from "react";
import { IShape, Point } from "../types/Geometry";
import { Rectangle } from "./Rectangle";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Toolbar } from "./Toolbar";
import { Line } from "./Line";
import { EditShape } from "./EditShape";
import { GridPattern } from "./GridPattern";
import { observer } from "mobx-react";
import { EditorContext } from "../state/editor/EditorContext";

interface IEditorProps {
    editorContext: EditorContext;
    width?: number;
    height?: number;
}

export const Editor = observer(({ editorContext, width = 400, height = 400 }: IEditorProps) => {
    const shapes = editorContext.shapes;
    const currentDrawingPoints = editorContext.getPartialShape();
    const selectedTool = editorContext.tool;
    const editedShape = editorContext.getEditedShape();
    const container = useRef<SVGSVGElement>(null);
    

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
    }

    const onCanvasMouseMove = (e: any) => {
        const point = getPointInCanvas(e);
        if (!point) {
            return;
        }
        editorContext.handleMouseMove(point);
    }

    const onSelectTool = (tool: string) => { 
       editorContext.toolSelected(tool);
    }

    const onGrabDragPoint = (idx: number) => {
        editorContext.grabDragPoint(idx);
    }

    const onReleaseDragPoint = (idx: number) => {
        editorContext.releaseDragPoint();
    }

    const handleKeyPresses = (e: React.KeyboardEvent) => {
        editorContext.handleKeyPress(e.key);
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

    return (
        <div tabIndex={-1} onKeyDown={handleKeyPresses}>
            <Toolbar onSelectTool={onSelectTool} selectedTool={selectedTool} />
            <svg height={height} width={width} onClick={onCanvasClicked} onMouseMove={onCanvasMouseMove} ref={container}>
                <GridPattern />
                {currentDrawingPoints.length && selectedTool && renderShape({id: 'preview', type: selectedTool, points:  currentDrawingPoints }, false)}
                {shapes.map((shape) => renderShape(shape, true))}
                {editedShape && <EditShape onGrabDragPoint={onGrabDragPoint} onReleaseDragPoint={onReleaseDragPoint} shape={editedShape} />}
            </svg>
        </div>
    );
});