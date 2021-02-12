namespace Freakylay.Internal {
    export class UrlManager {

        public urlParams: URLSearchParams;

        constructor() {
            this.urlParams = new URLSearchParams(location.search);
        }

        public hasAnyParams(): boolean {
            return location.search.length > 1;
        }

        public registerOptionParam<T>(key: string, defaultValue: T): UrlParam<T> {
            return new UrlParam(this, key, defaultValue);
        }
    }
}