namespace Freakylay {
    import LiveData = Freakylay.Data.LiveData;
    import StaticData = Freakylay.Data.StaticData;

    export class Modifier<T> {

        private key: string;
        private value: T;
        private defaultValue: T;

        constructor(key: string, defaultValue: T) {
            this.key = key;
            this.value = defaultValue;
            this.defaultValue = defaultValue;
        }

        public setValue(value: T): void {
            this.value = value;
        }

        public isSet(): boolean {
            return this.value != this.defaultValue;
        }

        public update(data: LiveData | StaticData): void {
            this.value = Helper.isset(data, this.key, this.defaultValue);
        }

        public getValue(): T {
            return this.value;
        }
    }
}