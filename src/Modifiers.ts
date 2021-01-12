import {Helper} from "./Helper";

export class Modifiers {

    public instantFail: boolean;
    public batteryEnergy: boolean;
    public disappearingArrows: boolean;
    public ghostNotes: boolean;
    public fasterSong: boolean;
    public noFail: boolean;
    public noObstacles: boolean;
    public noBombs: boolean;
    public slowerSong: boolean;
    public noArrows: boolean;

    constructor(data: object) {
        // those should get handled by there own classes
        this.instantFail = Helper.isset(data, 'instaFail', false);
        this.batteryEnergy = Helper.isset(data, 'batteryEnergy', false);
        this.disappearingArrows = Helper.isset(data, 'disappearingArrows', false);
        this.ghostNotes = Helper.isset(data, 'ghostNotes', false);
        this.fasterSong = Helper.isset(data, 'fasterSong', false);
        this.noFail = Helper.isset(data, 'noFail', false);
        this.noObstacles = Helper.isset(data, 'noObstacles', false);
        this.noBombs = Helper.isset(data, 'noBombs', false);
        this.slowerSong = Helper.isset(data, 'slowerSong', false);
        this.noArrows = Helper.isset(data, 'noArrows', false);
    }
}