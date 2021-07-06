import { makeAutoObservable } from "mobx";
import { IShape, Point } from "../../types/Geometry";
import { DrawingShapeState } from "./DrawingShapeState";
import { EditShapeState } from "./EditShapeState";
import { IEditorState } from "./IEditorState";
import { InitialCanvasState } from "./InitialCanvasState";

export class EditorContext {
    private currentState: IEditorState = new InitialCanvasState(this);
    public tool: string | null = null;
    public shapes: IShape[] = [];

    constructor() {
        makeAutoObservable(this);
    }
    public changeState(newState: IEditorState) {
        console.log(`Changing state from ${this.currentState} to ${newState}`);
        this.currentState = newState;
    }
    
    public toolSelected(tool: string) {
        console.log('Tool selected', tool);
        this.currentState.handleToolSelected(tool);
    }

    public grabDragPoint(idx: number) {
        this.currentState.grabDragPoint(idx);
    }

    public releaseDragPoint() {
        this.currentState.releaseDragPoint();
    }
    
    public handleClick(point: Point) {
        console.log('Point clicked', point);
        this.currentState.handleClick(point);
    }

    public handleMouseMove(point: Point) {
        this.currentState.handleMouseMove(point);
    }

    public handleKeyPress(keyCode: string) {
        console.log('Key pressed', keyCode);
        this.currentState.handleKeyPress(keyCode);
    }

    public addShape(shape: IShape) {
        this.shapes.push(shape);
    }

    public getPartialShape() {
        return this.currentState instanceof DrawingShapeState ? this.currentState.partialShape : [];
    }

    public getEditedShape() {
        return this.currentState instanceof EditShapeState ? this.currentState.editedShape : null;
    }
}