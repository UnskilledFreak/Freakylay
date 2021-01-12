export class UrlParam {

    private key: string;
    private default: any;
    private hasKey: boolean;
    private value: any;

    constructor(key: string, def: any, valueCallback: (any) => void = null) {
        let p = new URLSearchParams(location.search);

        this.key = key;
        this.default = def;
        this.hasKey = p.has(this.key);
        this.value = this.hasKey ? p.get(this.key) : this.default;

        if (typeof valueCallback === 'function') {
            this.value = valueCallback(this.value);
        }
    }

    public isDefaultValue() {
        return this.value === this.default;
    }
}