export type Point = [number, number];
export type ShapeType = Array<Point>;
export interface IShape {
    type: string;
    id: string;
    points: Array<Point>;
}