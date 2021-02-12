/// <reference path="../Data/Color.ts">

namespace Freakylay.Internal {
    import Color = Freakylay.Data.Color;

    export class UrlParam<T> {

        private key: string;
        private default: T;
        private hasKey: boolean;
        private value: T;

        constructor(manager: UrlManager, key: string, def: T) {

            this.key = key;
            this.default = def;
            this.hasKey = manager.urlParams.has(this.key);

            this.value = (this.hasKey ? manager.urlParams.get(this.key) : this.default) as T;
        }

        public isDefaultValue(): boolean {
            return this.value == this.default;
        }

        public isSet(): boolean {
            return this.hasKey && !this.isDefaultValue();
        }

        public getValue(): T {
            return this.value;
        }

        public setValue(val: T): void {
            this.value = val;
        }

        public getUrlValue(): string {
            let s = this.key;

            if (this.value instanceof Color) {
                s += '=' + this.value.toUrl();
            } else if (typeof this.value == 'string') {
                s += '=' + this.getValue();
            }

            return s;
        }
    }
}