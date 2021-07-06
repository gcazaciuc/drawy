import { Point } from "../../types/Geometry";
import { DrawingShapeState } from "./DrawingShapeState";
import { EditorContext } from "./EditorContext";
import { EditorState } from "./EditorState";
import { EditShapeState } from "./EditShapeState";
import pointInPolygon from 'point-in-polygon';
import pointLineDistance from 'point-line-distance';


export class InitialCanvasState extends EditorState {
    constructor(editor: EditorContext) {
        super(editor);
        this.editor.tool = null;
    }

    public handleToolSelected(tool: string) {
        super.handleToolSelected(tool);
        if (this.editor.tool) {
            this.editor.changeState(new DrawingShapeState(this.editor));
        }
    }

    public handleClick(point: Point) {
        const selectedShape = this.editor.shapes.find((shape) => {
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
                    return this.pointInCircle(point, shape.points);
                case 'line':
                    return this.pointInLine(point, shape.points);
            }
        });
        if (selectedShape) {
            const nextState = new EditShapeState(this.editor, selectedShape);
            this.editor.changeState(nextState);
        }
    }

    public handleKeyPress(keyCode: string) {

    }

    private pointInCircle = (point: Point, points: Point[]) => {
        const [start, end] = points;
        const radius = Math.sqrt(Math.pow((end[0] - start[0]),2) + Math.pow(end[1] - start[1], 2));
        const distanceToCenter = Math.sqrt(Math.pow((point[0] - start[0]),2) + Math.pow(point[1] - start[1], 2));
    
        return distanceToCenter <= radius;
    }
    
    private pointInLine = (point: Point, points: Point[]) => {
        return pointLineDistance(point.concat([0]), points[0].concat([0]), points[1].concat([0])) < 5;
    }
}