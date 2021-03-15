/// <reference path="../Internal/DataKey.ts" />

namespace Freakylay.Data {

    import DataKey = Freakylay.Internal.DataKey;

    export class PracticeModeModifiers {

        public songSpeedMul: DataKey<number>;
        public startInAdvanceAndClearNotes: DataKey<number>;
        public startSongTime: DataKey<number>;

        constructor() {
            this.songSpeedMul = new DataKey('songSpeedMul', 1.0);
            this.startInAdvanceAndClearNotes = new DataKey('startInAdvanceAndClearNotes', 1.0);
            this.startSongTime = new DataKey('startSongTime', 0.0);

            this.startSongTime.setValue(Math.round(this.songSpeedMul.getValue() * 100) / 100);
        }

        public update(data: {}): void {
            this.songSpeedMul.update(data);
            this.startInAdvanceAndClearNotes.update(data);
            this.startSongTime.update(data);
        }
    }
}