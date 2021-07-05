import { Point } from "../../types/Geometry";

export interface IEditorState {
    handleClick(point: Point): void;
    handleKeyPress(keyCode: string): void;
    handleToolSelected(tool: string): void;
}