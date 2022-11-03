namespace Freakylay.Ui {
    export class ModifierUiElement {
        private element: HTMLDivElement;
        private shortDescription: string;
        private longDescription: string;

        constructor(holder: HTMLElement, shortDescription: string, longDescription: string) {
            this.element = document.div();
            this.element.style.display = 'inline-block';
            holder.append(this.element);

            this.element.addClass('modifiers');
            this.element.addClass('bottomLeft');
            this.element.addClass('topLeft');
            this.element.addClass('bottomRight');
            this.element.addClass('topRight');

            this.shortDescription = shortDescription;
            this.longDescription = longDescription;
            this.switchDisplayName(true);
        }

        public switchDisplayName(useLongDescription: boolean): void {
            this.updateRawText(useLongDescription ? this.longDescription : this.shortDescription);
        }

        public updateRawText(text: string): void {
            this.element.innerHTML = text;
        }

        public getElement(): HTMLDivElement {
            return this.element;
        }
    }
}