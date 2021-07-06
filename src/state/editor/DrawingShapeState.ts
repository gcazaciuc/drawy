import { computed, makeObservable, observable } from "mobx";
import { PEN_TOOL } from "../../constants/constants";
import { Point } from "../../types/Geometry";
import { EditorContext } from "./EditorContext";
import { EditorState } from "./EditorState";
import { InitialCanvasState } from "./InitialCanvasState";

export class DrawingShapeState extends EditorState {
    public currentDrawingPoints: Point[] = [];
    public previewPoint: Point | null = null;
    private idCounter = 1;

    static SENSITIVITY = 5;

    constructor(editor: EditorContext) {
        super(editor);
        makeObservable(this, {
            currentDrawingPoints: observable,
            partialShape: computed,
            previewPoint: observable
        });
    }
    public get partialShape() {
        return this.previewPoint ? this.currentDrawingPoints.concat([this.previewPoint]) : this.currentDrawingPoints;
    }

    public handleMouseMove(point: Point) {
        this.previewPoint = point;
    }

    public handleClick(point: Point) {
        const selectedTool = this.editor.tool;
        if(!selectedTool) {
            return;
        }

        if (selectedTool === PEN_TOOL) {
            if (this.isShapeClosed(this.currentDrawingPoints, point)) {
                const newShape = {id: this.uuid(), type: selectedTool, points: this.currentDrawingPoints};
                this.editor.addShape(newShape);
                this.currentDrawingPoints = [];
                this.previewPoint = null;
                this.editor.changeState(new InitialCanvasState(this.editor));
            } else {
                this.currentDrawingPoints = this.currentDrawingPoints.concat([point]);
            }
        } else {
            if (this.isStandardShapeClosed()) {
                const newShape = {id: this.uuid(), type: selectedTool, points: this.currentDrawingPoints.concat([point])};
                this.editor.addShape(newShape);
                this.currentDrawingPoints = [];
                this.previewPoint = null;
                this.editor.changeState(new InitialCanvasState(this.editor));
            } else {
                this.currentDrawingPoints = this.currentDrawingPoints.concat([point]);
            }
        }
    }

    public handleKeyPress(keyCode: string) {
        
    }

    private isShapeClosed = (points: Point[], point: Point) => {
        if (points.length < 1) {
            return false;
        }
        const startingPoint = points[0];
        return startingPoint && point && Math.abs(startingPoint[0] - point[0]) < DrawingShapeState.SENSITIVITY && Math.abs(startingPoint[1] - point[1]) < DrawingShapeState.SENSITIVITY;
    }
    private isStandardShapeClosed = () => this.currentDrawingPoints.length >= 1;
    private uuid = () => `shape_${this.idCounter++}`;
}