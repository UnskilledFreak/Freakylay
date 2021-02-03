/// <reference path="../Internal/Helper.ts" />

namespace Freakylay.UiElement {
    import Helper = Freakylay.Internal.Helper;

    export class CircleBar {

        private parent: HTMLElement;
        private callback: (string) => string;
        private circumference: number;
        private text: HTMLDivElement;
        private bar: SVGCircleElement;

        constructor(parentElement: HTMLElement, textCallback?: (string) => string, size: number = 90, padding: number = 10) {
            this.parent = parentElement;
            this.callback = textCallback;

            let half = size / 2;
            let radius = half - padding;

            this.circumference = radius * Math.PI * 2;
            this.text = Helper.create('div') as HTMLDivElement;
            this.bar = CircleBar.getCircle(half, radius) as SVGCircleElement;
            this.bar.style.strokeDasharray = this.circumference + 'px , ' + this.circumference + 'px';

            let svg = Helper.svg('svg');
            svg.style.width = size + 'px';
            svg.style.height = size + 'px';

            let remaining = CircleBar.getCircle(half, radius);

            Helper.addClass(remaining, 'remaining');
            Helper.addClass(this.bar, 'progress');
            Helper.addClass(svg, 'roundBar');
            Helper.addClass(this.text, 'progressInfo');

            svg.append(remaining, this.bar);

            this.parent.append(this.text, svg);
        }

        public setProgress(current: number, total: number): void {
            let progress = current / total;
            this.bar.style.strokeDashoffset = this.getCircumference(progress);

            if (typeof this.callback === 'function') {
                this.setText(this.callback((Math.round(progress * 10000) / 100).toFixed(2)));
            }
        }

        public setText(text: string): void {
            this.text.innerHTML = text;
        }

        private getCircumference(input: number): string {
            return Helper.clamp((1 - input) * this.circumference, 0, this.circumference) + 'px';
        }

        private static getCircle(size: number, radius: number): SVGCircleElement {
            let c = Helper.svg('circle') as SVGCircleElement;

            c.cx.baseVal.value = size;
            c.cy.baseVal.value = size;
            c.r.baseVal.value = radius;

            return c;
        }
    }
}