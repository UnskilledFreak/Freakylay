/// <reference path="../Internal/DataKey.ts" />

namespace Freakylay.Data {

    import DataKey = Freakylay.Internal.DataKey;

    export class Modifiers {

        public instantFail: DataKey<boolean>;
        public batteryEnergy: DataKey<boolean>;
        public disappearingArrows: DataKey<boolean>;
        public ghostNotes: DataKey<boolean>;
        public fasterSong: DataKey<boolean>;
        public noFail: DataKey<boolean>;
        public noObstacles: DataKey<boolean>;
        public noBombs: DataKey<boolean>;
        public slowerSong: DataKey<boolean>;
        public noArrows: DataKey<boolean>;

        constructor() {
            // those should get handled by there own classes
            this.instantFail = new DataKey('instaFail', false);
            this.batteryEnergy = new DataKey('batteryEnergy', false);
            this.disappearingArrows = new DataKey('disappearingArrows', false);
            this.ghostNotes = new DataKey('ghostNotes', false);
            this.fasterSong = new DataKey('fasterSong', false);
            this.noFail = new DataKey('noFail', false);
            this.noObstacles = new DataKey('noObstacles', false);
            this.noBombs = new DataKey('noBombs', false);
            this.slowerSong = new DataKey('slowerSong', false);
            this.noArrows = new DataKey('noArrows', false);
        }

        public update(data: {}): void {
            this.instantFail.update(data);
            this.batteryEnergy.update(data);
            this.disappearingArrows.update(data);
            this.ghostNotes.update(data);
            this.fasterSong.update(data);
            this.noFail.update(data);
            this.noObstacles.update(data);
            this.noBombs.update(data);
            this.slowerSong.update(data);
            this.noArrows.update(data);
        }
    }
}