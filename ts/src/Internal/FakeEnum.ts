namespace Freakylay.Internal {
    /**
     * fake enum class
     */
    export class FakeEnum {
        private _value: number = 0;

        constructor(value: number) {
            this._value = value;
        }

        get Value(): number {
            return this._value;
        }

        /**
         * enum flag tester
         * @param flag
         */
        public hasFlag(flag: number): boolean {
            return (this._value & flag) == flag;
        }

        /**
         * adds an enum flag
         * @param flag
         */
        public addFlag(flag: number): void {
            this._value |= flag;
        }

        /**
         * removes an enum flag
         * @param flag
         */
        public removeFlag(flag: number): void {
            this._value &= ~flag;
        }
    }
}