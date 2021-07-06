import { Shape } from "./Shape";

export class Line extends Shape {
    public isShapeClosed() {
        return false;
    }
}