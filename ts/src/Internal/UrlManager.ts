/// <reference path="../Data/Color.ts" />

namespace Freakylay.Internal {
    import Color = Freakylay.Data.Color;

    export class UrlManager {

        public urlParams: URLSearchParams;

        constructor() {
            this.urlParams = new URLSearchParams(location.search);
        }

        public hasAnyParams(): boolean {
            return location.search.length > 1;
        }

        public registerOptionParam<T>(key: string, defaultValue: T): UrlParam<T> {
            let compareFn = null;
            if (defaultValue instanceof Color) {
                compareFn = Helper.areColorsEqual;
            }
            return new UrlParam(this, key, defaultValue, compareFn);
        }
    }
}