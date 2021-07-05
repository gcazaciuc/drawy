import { makeObservable, observable } from "mobx";
import { Point } from "../../types/Geometry";
import { DrawingShapeState } from "./DrawingShapeState";
import { EditorContext } from "./EditorContext";
import { EditorState } from "./EditorState";

export class InitialCanvasState extends EditorState {
    public handleToolSelected(tool: string) {
        this.editor.tool = tool === this.editor.tool ? null : tool;
        if (this.editor.tool) {
            this.editor.changeState(new DrawingShapeState(this.editor));
        }
    }

    public handleClick(point: Point) {
        
    }

    public handleKeyPress(keyCode: string) {

    }
}