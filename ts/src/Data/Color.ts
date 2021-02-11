namespace Freakylay.Data {
    export class Color {

        public r: number = 0;
        public g: number = 0;
        public b: number = 0;
        public a: number = 255;

        constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        public toRgb(): string {
            let inner = [this.r, this.g, this.b];
            if (this.a != 255) {
                inner.push(this.a / 255);
                return 'rgba(' + inner.join(',') + ')'
            }

            return '#' + inner.map(x => {
                let s = x.toString(16);
                return s.length == 1 ? "0" + s : s;
            }).join('');
        }

        public static fromUrl(input: string): Color {
            let tmp: number[] = [];
            if (input.substring(0, 3) === 'rgb') {
                // remove whitespaces
                input = input.replace(/ /g, '');

                // alpha?
                let start = 5;

                if (input.indexOf('a') == -1) {
                    start--;
                }

                tmp = input.substr(start, input.indexOf(')') - start).split(',').map(s => parseFloat(s));
                if (start == 4) {
                    // add missing alpha
                    tmp.push(255);
                } else {
                    tmp[3] *= 255;
                }
            } else if (input.match(/[^0-9A-Fa-f]/g) === null) {
                input = input.replace(/#/, '');
                tmp.push(parseInt(input.substr(0, 2), 16));
                tmp.push(parseInt(input.substr(2, 2), 16));
                tmp.push(parseInt(input.substr(4, 2), 16));

                if (input.length > 6) {
                    tmp.push(parseInt(input.substr(6, 2), 16));
                } else {
                    tmp.push(255);
                }

            } else {
                tmp = [0, 0, 0, 255];
            }

            return new Color(...tmp);
        }

        public toUrl(): string {
            let input = this.toRgb();

            if (input.substring(0, 1) === '#') {
                return input.substring(1);
            }

            if (input.substring(0, 3) === 'rgb') {
                return input;
            }

            return '000000';
        }
    }
}