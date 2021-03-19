/// <reference path="../Internal/DataKey.ts" />

namespace Freakylay.Data {

    import DataKey = Freakylay.Internal.DataKey;

    export class Modifiers {

        public noFail: DataKey<boolean>;
        public oneLife: DataKey<boolean>;
        public fourLives: DataKey<boolean>;
        public noBombs: DataKey<boolean>;
        public noWalls: DataKey<boolean>;
        public noArrows: DataKey<boolean>;
        public ghostNotes: DataKey<boolean>;
        public disappearingArrows: DataKey<boolean>;
        public smallNotes: DataKey<boolean>;
        public proMode: DataKey<boolean>;
        public strictAngles: DataKey<boolean>;
        public zenMode: DataKey<boolean>;
        public slowerSong: DataKey<boolean>;
        public fasterSong: DataKey<boolean>;
        public superFastSong: DataKey<boolean>;

        constructor() {
            this.noFail = new DataKey('noFailOn0Energy', false);
            this.oneLife = new DataKey('oneLife', false);
            this.fourLives = new DataKey('fourLives', false);
            this.noBombs = new DataKey('noBombs', false);
            this.noWalls = new DataKey('noWalls', false);
            this.noArrows = new DataKey('noArrows', false);
            this.ghostNotes = new DataKey('ghostNotes', false);
            this.disappearingArrows = new DataKey('disappearingArrows', false);
            this.smallNotes = new DataKey('smallNotes', false);
            this.proMode = new DataKey('proMode', false);
            this.strictAngles = new DataKey('strictAngles', false);
            this.zenMode = new DataKey('zenMode', false);
            this.slowerSong = new DataKey('slowerSong', false);
            this.fasterSong = new DataKey('fasterSong', false);
            this.superFastSong = new DataKey('superFastSong', false);
        }

        public update(data: {}): void {
            this.noFail.update(data);
            this.oneLife.update(data);
            this.fourLives.update(data);
            this.noBombs.update(data);
            this.noWalls.update(data);
            this.noArrows.update(data);
            this.ghostNotes.update(data);
            this.disappearingArrows.update(data);
            this.smallNotes.update(data);
            this.proMode.update(data);
            this.strictAngles.update(data);
            this.zenMode.update(data);
            this.slowerSong.update(data);
            this.fasterSong.update(data);
            this.superFastSong.update(data);
        }
    }
}