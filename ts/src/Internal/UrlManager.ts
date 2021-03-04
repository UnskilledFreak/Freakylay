/// <reference path="../Data/Color.ts" />

namespace Freakylay.Internal {
    import Color = Freakylay.Data.Color;

    export class UrlManager {

        public urlParams: URLSearchParams;
        private registeredParameters: UrlParam<any>[];

        constructor() {
            this.urlParams = new URLSearchParams(location.search);
            this.registeredParameters = [];
        }

        public hasAnyParams(): boolean {
            return location.search.length > 1;
        }

        public registerOptionParam<T>(key: string, defaultValue: T): UrlParam<T> {
            let compareFn = null;
            if (defaultValue instanceof Color) {
                compareFn = Helper.areColorsEqual;
            }
            let param = new UrlParam(this, key, defaultValue, compareFn);
            this.registeredParameters.push(param);
            return param;
        }

        public areAllDefault(): boolean {
            let outcome = true;
            this.registeredParameters.forEach((p) => {
                if (!p.isDefaultValue()) {
                    outcome = false;
                }
            });

            return outcome;
        }
    }
}