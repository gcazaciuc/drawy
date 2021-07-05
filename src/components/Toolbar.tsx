import { CIRCLE_TOOL, LINE_TOOL, PEN_TOOL, RECTANGLE_TOOL } from "../constants/constants";
import classnames from 'classnames';
import './Toolbar.css';

interface ToolbarProps {
    onSelectTool: (tool: string) => void;
    selectedTool: string | null;
}

export const Toolbar = ({onSelectTool, selectedTool}: ToolbarProps) => {

    const penClass = classnames("toolbar-btn", {"active": selectedTool=== PEN_TOOL});
    const circleClass = classnames("toolbar-btn", {"active": selectedTool=== CIRCLE_TOOL});
    const rectangleClass = classnames("toolbar-btn", {"active": selectedTool=== RECTANGLE_TOOL});
    const lineClass = classnames("toolbar-btn", {"active": selectedTool=== LINE_TOOL});

    return (
        <div className="toolbar">
            <button className={penClass} onClick={() => onSelectTool(PEN_TOOL)}>Pencil</button>
            <button className={circleClass} onClick={() => onSelectTool(CIRCLE_TOOL)}>Circle</button>
            <button className={rectangleClass} onClick={() => onSelectTool(RECTANGLE_TOOL)}>Rectangle</button>
            <button className={lineClass} onClick={() => onSelectTool(LINE_TOOL)}>Line</button>
        </div>
    );
}