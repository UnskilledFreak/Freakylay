namespace Freakylay.Ui {
    /**
     * marquee element to display longer elements than the parent width allowed
     */
    export class Marquee {

        private readonly element: HTMLDivElement;

        constructor(element: HTMLDivElement) {
            this.element = element;
            this.setValue(element.innerText);
        }

        /**
         * sets a new value to the marquee, will auto stop and start if specific width is reached
         * @param val
         */
        public setValue(val: string): void {
            this.stop();
            this.element.innerHTML = val;

            let styles = window.getComputedStyle(this.element, null);
            let width = parseInt(styles.getPropertyValue('width'));

            if (width > 400) {
                this.element.addClass('start');
            }
        }

        /**
         * stops marquee animation
         */
        public stop(): void {
            this.element.removeClass('start');
        }
    }
}