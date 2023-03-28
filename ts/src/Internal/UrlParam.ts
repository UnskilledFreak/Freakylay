/// <reference path="../Data/Color.ts">

namespace Freakylay.Internal {
    import Color = Freakylay.Internal.Color;

    /**
     * @deprecated
     */
    export class UrlParam<T> {

        private default: T;
        private value: T;

        private readonly key: string;
        private readonly hasKey: boolean;
        private readonly compareFn: (obj: any, def: any) => boolean;

        constructor(manager: UrlManager, key: string, def: T, compareFn: (obj: T, def: T) => boolean = null) {

            this.key = key;
            this.default = def;
            this.hasKey = manager.urlParams.has(this.key);
            this.value = this.default;
            this.compareFn = compareFn;

            if (this.hasKey) {
                let val = manager.urlParams.get(this.key);
                if (this.default instanceof Color) {
                    this.value = (Color.fromUrl(val) as unknown) as T;
                } else {
                    if (typeof this.default === 'boolean') {
                        this.value = (this.hasKey as unknown) as T;
                    } else {
                        this.value = (val as unknown) as T;
                    }
                }
            } else {
                if (this.default instanceof Color) {
                    this.value = (this.default.clone() as unknown) as T;
                }
            }
        }

        public isDefaultValue(): boolean {
            if (typeof this.value == 'object') {
                if (this.compareFn == null) {
                    throw new Error('comparer must be an callback for given type ' + typeof this.value);
                }

                return this.compareFn(this.value, this.default);
            }
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

        public getDefault(): T {
            return this.default;
        }

        public getCheckedValue(): T {
            if (this.isSet()) {
                return this.getValue();
            }
            return this.getDefault();
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