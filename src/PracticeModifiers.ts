import {Helper} from "./Helper";

export class PracticeModeModifiers {

    public songSpeedMul: number;

    constructor(data: object) {
        this.songSpeedMul = Helper.isset(data, 'songSpeedMul', 1.0);

        this.songSpeedMul = Math.round(this.songSpeedMul * 100) / 100;
    }
}