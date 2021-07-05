import { Point } from "../../types/Geometry";
import { EditorContext } from "./EditorContext";
import { IEditorState } from "./IEditorState";

export abstract class EditorState implements IEditorState {
    protected editor: EditorContext;

    constructor(editor: EditorContext) {
        this.editor = editor;
    }
    
    public handleToolSelected(tool: string) {

    }

    abstract handleClick(point: Point): void;

    abstract handleKeyPress(keyCode: string): void;
}