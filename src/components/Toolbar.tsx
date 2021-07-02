import { CIRCLE_TOOL, LINE_TOOL, PEN_TOOL, RECTANGLE_TOOL } from "../constants/constants";

interface ToolbarProps {
    onSelectTool: (tool: string) => void;
}

export const Toolbar = ({onSelectTool}: ToolbarProps) => {
    return (
        <div className="toolbar">
            <button className="toolbar-btn" onClick={() => onSelectTool(PEN_TOOL)}>Pencil</button>
            <button className="toolbar-btn" onClick={() => onSelectTool(CIRCLE_TOOL)}>Circle</button>
            <button className="toolbar-btn" onClick={() => onSelectTool(RECTANGLE_TOOL)}>Rectangle</button>
            <button className="toolbar-btn" onClick={() => onSelectTool(LINE_TOOL)}>Line</button>
        </div>
    );
}