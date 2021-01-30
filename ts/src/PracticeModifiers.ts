namespace Freakylay {
    export class PracticeModeModifiers {

        public songSpeedMul: DataKey<number>;

        constructor() {
            this.songSpeedMul = new DataKey('songSpeedMul', 1.0);

            this.songSpeedMul.setValue(Math.round(this.songSpeedMul.getValue() * 100) / 100);
        }

        public update(data: {}): void {
            this.songSpeedMul.update(data);
        }
    }
}