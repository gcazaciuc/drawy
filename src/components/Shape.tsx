type Point = [number, number];
interface ShapeProps {
    points: Point[]
    isClosed?: boolean;
}

export const Shape = ({points, isClosed}: ShapeProps) => {
    const path = points.map(([px, py], idx) => {
        switch(idx) {
            case 0:
                return `M${px} ${py}`;
            default:
                return `L${px} ${py}`;
        }
    }).join(' ');
   
    const closeCommand = isClosed ? 'Z' : ''; 

    return (<path d={`${path} ${closeCommand}`} stroke="green" strokeWidth="3" fill="none" />);
}