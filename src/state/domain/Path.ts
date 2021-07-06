import { Shape } from "./Shape";

export class Path extends Shape {
    public isShapeClosed() {
        return false;
    }
}