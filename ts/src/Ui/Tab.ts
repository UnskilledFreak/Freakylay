namespace Freakylay.Ui {
    export class Tab {
        private readonly name: string;
        private contentElement: HTMLDivElement;
        private headlineElement: HTMLDivElement;

        constructor(name: string, headlineElement: HTMLDivElement) {
            this.name = name;
            this.contentElement = document.get('div[data-tab-content=' + this.name + ']');
            this.headlineElement = headlineElement;
            this.hide();
        }

        /**
         * hides this tab and its content so another can be visible
         */
        public hide() {
            this.headlineElement.removeClass('active');
            this.contentElement.removeClass('active');
        }

        /**
         * shows this tab
         */
        public show() {
            this.headlineElement.addClass('active');
            this.contentElement.addClass('active');
        }

        /**
         * removes this tab and its content from the DOM
         */
        public destroy() {
            this.headlineElement.remove();
            this.contentElement.remove();
        }
    }
}