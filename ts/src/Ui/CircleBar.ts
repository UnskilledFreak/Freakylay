namespace Freakylay.Ui {

    /**
     * will create a progress bar as a circle inside any HTML element
     */
    export class CircleBar {

        private parent: HTMLElement;
        private readonly callback: (string) => string;
        private readonly circumference: number;
        private readonly text: HTMLDivElement;
        private readonly bar: SVGCircleElement;
        private currentValue: any;

        /**
         * constructor with basic settings
         * todo :: more explanation
         * @param parentElement
         * @param textCallback
         * @param size
         * @param padding
         */
        constructor(parentElement: HTMLElement, textCallback?: (string) => string, size: number = 90, padding: number = 10) {
            this.parent = parentElement;
            this.callback = textCallback;

            let half = size / 2;
            let radius = half - padding;

            this.circumference = radius * Math.PI * 2;
            this.text = document.div();
            this.bar = CircleBar.getCircle(half, radius);
            this.bar.style.strokeDasharray = this.circumference + 'px , ' + this.circumference + 'px';

            let svg = document.createSvg<SVGElement>('svg');
            svg.style.width = size + 'px';
            svg.style.height = size + 'px';

            let remaining = CircleBar.getCircle(half, radius);

            remaining.addClass('remaining');
            this.bar.addClass('progress');
            svg.addClass('roundBar');
            this.text.addClass('progressInfo');

            svg.append(remaining, this.bar);

            this.parent.append(this.text, svg);

            this.setProgress(0, 100);
        }

        /**
         * updates the progressbar by calculating the percentage of the current and total value
         * will also trigger the text callback
         * @param current
         * @param total
         * @param fractionDigits
         */
        public setProgress(current: number, total: number = 100, fractionDigits: number = 2): void {
            let progress = current / total;
            this.bar.style.strokeDashoffset = this.getCircumference(progress);

            if (typeof this.callback === 'function') {
                // multiply first by 10k avoids rounding issues in string
                this.currentValue = (Math.round(progress * 10000) / 100).toFixed(fractionDigits);
                this.setText(this.callback(this.currentValue));
            }
        }

        /**
         * changes the text inside the circle
         * @param text
         */
        public setText(text: string): void {
            this.text.innerHTML = text;
        }

        /**
         * generates the length of a stroke in the dasharray to fake a progressbar
         * @param input
         * @private
         */
        private getCircumference(input: number): string {
            return ((1 - input) * this.circumference).clamp(0, this.circumference) + 'px';
        }

        /**
         * creates a SVG circle element with given size and radius
         * @param size
         * @param radius
         * @private
         */
        private static getCircle(size: number, radius: number): SVGCircleElement {
            let c = document.createSvg<SVGCircleElement>('circle');

            c.cx.baseVal.value = size;
            c.cy.baseVal.value = size;
            c.r.baseVal.value = radius;

            return c;
        }

        /**
         * refresh the circle bar to apply changes
         * @private
         */
        public refresh(): void {
            if (typeof this.callback === 'function') {
                this.setText(this.callback(this.currentValue));
            }
        }
    }
}