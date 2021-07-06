import { makeObservable, observable } from "mobx";
import { IShape, Point } from "../../types/Geometry";
import { EditorContext } from "./EditorContext";
import { EditorState } from "./EditorState";
import { EditShapeState } from "./EditShapeState";

export class DragPointSelectedState extends EditorState {
    public editedShape: IShape;
    public dragPoint: number;
    
    constructor(editor: EditorContext, editedShape: IShape, dragPoint: number) {
        super(editor);
        makeObservable(this, {
            editedShape: observable,
            dragPoint: observable
        });
        this.editedShape = editedShape;
        this.dragPoint = dragPoint;
    }

    public handleClick(point: Point) {
        this.editor.changeState(new EditShapeState(this.editor, this.editedShape));
    }

    public handleKeyPress(keyCode: string) {
        
    }

    public releaseDragPoint() {
        this.editor.changeState(new EditShapeState(this.editor, this.editedShape));
    }

    public handleMouseMove(point: Point) {
       this.updateDragPoint(point);
    }

    public updateDragPoint(point: Point) {
        if (this.dragPoint === null) {
            return;
        }

        const idx = this.dragPoint;
        const updatedShapes = this.editor.shapes.map((shape) => {
            if (this.editedShape && shape.id === this.editedShape.id) {
                const newPoints = shape.points.slice();
                newPoints[idx] = point;
                shape.points = newPoints;
            }

            return shape;
        });
        this.editor.shapes = updatedShapes;
    }
}