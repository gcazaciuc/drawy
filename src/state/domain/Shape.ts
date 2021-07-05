import { makeObservable, observable } from "mobx";
import { Point } from "../../types/Geometry";

export abstract class Shape {
    protected points: Point[] = [];

    abstract isShapeClosed(): boolean;

     constructor() {
        //  makeObservable(this, {
        //      points: observable
        //  })
     }
}