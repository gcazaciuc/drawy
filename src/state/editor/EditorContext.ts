import { makeAutoObservable } from "mobx";
import { Point } from "../../types/Geometry";
import { DrawingShapeState } from "./DrawingShapeState";
import { IEditorState } from "./IEditorState";
import { InitialCanvasState } from "./InitialCanvasState";

export class EditorContext {
    private currentState: IEditorState = new InitialCanvasState(this);
    public tool: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    public changeState(newState: IEditorState) {
        this.currentState = newState;
    }
    
    public toolSelected(tool: string) {
        console.log('Tool selected', tool);
        this.currentState.handleToolSelected(tool);
    }

    public handleClick(point: Point) {
        console.log('Point clicked', point);
        this.currentState.handleClick(point);
    }

    public handleKeyPress(keyCode: string) {
        console.log('Key pressed', keyCode);
        this.currentState.handleKeyPress(keyCode);
    }
}