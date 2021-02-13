/// <reference path="../Internal/Helper.ts" />

namespace Freakylay.UiElement {
    import Helper = Freakylay.Internal.Helper;

    export class Marquee {

        private animationSpeed: number = 250;
        private element: HTMLDivElement;
        private internalTimer: number;
        private width: number;

        constructor(element: HTMLDivElement) {
            this.element = element;
            this.internalTimer = null;
            this.width = 0;
        }

        public setValue(val: string): void {
            this.stop();
            this.element.innerHTML = val;

            let styles = window.getComputedStyle(this.element, null);
            let width = parseInt(styles.getPropertyValue('width'));

            if (width > 400) {
                //this.element.innerHTML += Helper.stringRepeat(' ', Math.floor(val.length / 2));
                this.element.innerHTML += Helper.stringRepeat(' ', 10);
                this.internalTimer = window.setInterval(() => {
                    let actualVal = this.element.innerHTML;
                    let first = actualVal.substr(0, 1);
                    this.element.innerHTML = actualVal.substr(1) + first;
                }, this.animationSpeed);
            }
        }

        public stop(): void {
            window.clearInterval(this.internalTimer);
        }
    }
}