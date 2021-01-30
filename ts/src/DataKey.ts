namespace Freakylay {
    export class DataKey<T> {

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

        public update(data: {}): void {
            this.setValue(Helper.isset(data, this.key, this.defaultValue));
        }

        public getValue(): T {
            return this.value;
        }
    }
}