namespace Freakylay {
    export class ModifierUiElement {
        private element: HTMLDivElement;
        private shortDescription: string;
        private longDescription: string;

        constructor(id: string, shortDescription: string, longDescription: string) {
            this.element = Helper.element(id) as HTMLDivElement;
            this.shortDescription = shortDescription;
            this.longDescription = longDescription;
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