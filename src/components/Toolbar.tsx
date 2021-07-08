import { CIRCLE_TOOL, LINE_TOOL, PEN_TOOL, RECTANGLE_TOOL } from "../constants/constants";
import classnames from 'classnames';
import './Toolbar.css';

interface ToolbarProps {
    onSelectTool: (tool: string) => void;
    selectedTool: string | null;
}

export const Toolbar = ({onSelectTool, selectedTool}: ToolbarProps) => {

    const penClass = classnames("toolbar-btn", "fa", "fa-pencil", {"active": selectedTool=== PEN_TOOL});
    const circleClass = classnames("toolbar-btn", "fa", "fa-circle-o", {"active": selectedTool=== CIRCLE_TOOL});
    const rectangleClass = classnames("toolbar-btn", "fa", "fa-square-o", {"active": selectedTool=== RECTANGLE_TOOL});
    const lineClass = classnames("toolbar-btn", "fa", "fa-minus", {"active": selectedTool=== LINE_TOOL});

    return (
        <div className="toolbar">
            <i className={penClass} onClick={() => onSelectTool(PEN_TOOL)}></i>
            <i className={circleClass} onClick={() => onSelectTool(CIRCLE_TOOL)}></i>
            <i className={rectangleClass} onClick={() => onSelectTool(RECTANGLE_TOOL)}></i>
            <i className={lineClass} onClick={() => onSelectTool(LINE_TOOL)}></i>
        </div>
    );
}