import { makeObservable, observable } from "mobx";
import { IShape, Point } from "../../types/Geometry";
import { DragPointSelectedState } from "./DragPointSelected";
import { DrawingShapeState } from "./DrawingShapeState";
import { EditorContext } from "./EditorContext";
import { EditorState } from "./EditorState";
import { InitialCanvasState } from "./InitialCanvasState";

export class EditShapeState extends EditorState {
    public editedShape: IShape;

   constructor(editor: EditorContext, shape: IShape) {
        super(editor);
        makeObservable(this, {
            editedShape: observable
        });
        this.editedShape = shape;
    }
    
    public handleToolSelected(tool: string) {
        super.handleToolSelected(tool);
        if (this.editor.tool) {
            this.editor.changeState(new DrawingShapeState(this.editor));
        }
    }

    public handleClick(point: Point) {
        this.editor.changeState(new InitialCanvasState(this.editor));
    }

    public handleKeyPress(keyCode: string) {
        switch(keyCode) {
            case 'Backspace':
                this.editor.shapes = this.editor.shapes.filter((s) => s.id !== this.editedShape.id);
                this.editor.changeState(new InitialCanvasState(this.editor));
                break;
        }
    }

    public grabDragPoint(idx: number) {
        this.editor.changeState(new DragPointSelectedState(this.editor, this.editedShape, idx));
    }
}