namespace Freakylay.Internal {
    /**
     * RGBA color helper class
     */
    export class Color {

        public _red: number = 0;
        public _green: number = 0;
        public _blue: number = 0;
        public _alpha: number = 1;

        public onRedChange: EventProperty<number>;
        public onGreenChange: EventProperty<number>;
        public onBlueChange: EventProperty<number>;
        public onAlphaChange: EventProperty<number>;

        get red(): number {
            return this._red;
        }

        set red(value: number) {
            this._red = Math.round(value.clamp(0, 255));
            this.onRedChange.Value = this.red;
        }

        get green(): number {
            return this._green;
        }

        set green(value: number) {
            this._green = Math.round(value.clamp(0, 255));
            this.onGreenChange.Value = this.green;
        }

        get blue(): number {
            return this._blue;
        }

        set blue(value: number) {
            this._blue = Math.round(value.clamp(0, 255));
            this.onBlueChange.Value = this.blue;
        }

        get alpha(): number {
            return this._alpha;
        }

        set alpha(value: number) {
            this._alpha = Math.round(value.clamp(0, 1) * 100) / 100;
            this.onAlphaChange.Value = this.alpha;
        }

        /**
         * creates a new Color instance based on the input string, defaults to black if neither hex nor rgb value given
         * @param input string
         */
        public static fromUrl(input: string): Color {
            input = input.removeFirst('#');

            if (input.startsWith('rgb')) {
                return Color.fromRgb(input);
            } else if (input.match(/[^0-9a-f]/gi) === null) {
                return Color.fromHex(input);
            }

            return new Color(0, 0, 0, 1);
        }

        /**
         * creates a new Color instance based on given rgb(a) values
         * @param rgba
         */
        public static fromRgb(rgba: string): Color {
            // remove whitespaces
            rgba = rgba
                .replace(/ /g, '')
                .removeFirst('rgb')
                .removeFirst('a')
                .removeFirst('(')
                .removeLast(')');

            let sTmp = rgba.split(',');
            if (sTmp.length == 3) {
                sTmp.push('1');
            }

            let tmp: number[] = [
                parseInt(sTmp[0]),
                parseInt(sTmp[1]),
                parseInt(sTmp[2]),
                parseFloat(sTmp[3])
            ];

            if (tmp[3] > 1) {
                tmp[3] /= 255;
            }

            return new Color(...tmp);
        }

        /**
         * creates a new Color instance based on given hex values
         * @param hex
         */
        public static fromHex(hex: string): Color {
            hex = hex.replace(/#/, '');
            let tmp: number[] = [
                parseInt(hex.substring(0, 2), 16),
                parseInt(hex.substring(2, 4), 16),
                parseInt(hex.substring(4, 6), 16)
            ];

            if (hex.length > 6) {
                tmp.push(parseInt(hex.substring(6, 8), 16) / 255);
            } else {
                tmp.push(1);
            }

            return new Color(...tmp);
        }

        /**
         * generates a random color with given alpha, default 1
         * @param givenAlpha
         */
        public static random(givenAlpha: number = 1): Color {
            return new Color(
                (0).random(255),
                (0).random(255),
                (0).random(255),
                givenAlpha
            );
        }

        constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
            this.onRedChange = new EventProperty<number>(this._red);
            this.onGreenChange = new EventProperty<number>(this._green);
            this.onBlueChange = new EventProperty<number>(this._blue);
            this.onAlphaChange = new EventProperty<number>(this._alpha);

            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = alpha;
        }

        /**
         * returns color in hex or rgba notation css value
         */
        public toCss(): string {
            // only rgb for v3
            return 'rgba(' + [this.red, this.green, this.blue, this.alpha].join(', ') + ')';
        }

        /**
         * generates an url safe usable string
         * @deprecated only used in V2
         */
        public toUrl(): string {
            let input = this.toCss();

            if (input.startsWith('#')) {
                return input.substring(1);
            }

            if (input.startsWith('rgb')) {
                return input;
            }

            return '000000';
        }

        /**
         * clones this instance
         */
        public clone(): Color {
            return new Color(this.red, this.green, this.blue, this.alpha);
        }

        /**
         * compares another Color instance with itself
         * @param other
         */
        public equalTo(other: Color): boolean {
            return this.toCss() == other.toCss();
        }

        /**
         * creates a new color instance which is set to the complimentary color
         * @param alpha
         */
        public getComplementary(alpha?: number): Color {
            return new Color(
                255 - this.red,
                255 - this.green,
                255 - this.blue,
                alpha ?? this.alpha
            )
        }

        /**
         * returns complementary color but also adjusts darkness or lightness
         * @param alpha
         */
        public getHighLowComplementary(alpha?: number): Color {
            const bridge: number = 150;

            let tmpR = this.red * this.getDarkenPercentage(this.red);
            let tmpG = this.blue * this.getDarkenPercentage(this.blue);
            let tmpB = this.green * this.getDarkenPercentage(this.green);
            let complementary = this.getComplementary(alpha);

            if (
                this.red <= bridge &&
                this.blue <= bridge &&
                this.green <= bridge
            ) {
                // base color is darker, light it up
                complementary.red += tmpR;
                complementary.green += tmpG;
                complementary.blue += tmpB;
            } else {
                // base color is light, darken it
                complementary.red -= tmpR;
                complementary.green -= tmpG;
                complementary.blue -= tmpB;
            }

            return complementary;
        }

        /**
         * returns the amount of how "full" the color is
         * @param val
         * @private
         */
        private getDarkenPercentage(val: number): number {
            return val / 255;
        }
    }
}