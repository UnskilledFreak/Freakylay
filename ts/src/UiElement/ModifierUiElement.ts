/// <reference path="../Internal/Helper.ts" />

namespace Freakylay.UiElement {
    import Helper = Freakylay.Internal.Helper;

    export class ModifierUiElement {
        private element: HTMLDivElement;
        private shortDescription: string;
        private longDescription: string;

        constructor(holder: HTMLElement, shortDescription: string, longDescription: string) {
            this.element = Helper.div();
            this.element.style.display = 'inline-block';
            holder.append(this.element);

            Helper.addClass(this.element, 'modifiers');
            Helper.addClass(this.element, 'backGroundColor');
            Helper.addClass(this.element, 'borderRadiusBottomLeft');
            Helper.addClass(this.element, 'borderRadiusTopLeft');
            Helper.addClass(this.element, 'borderRadiusBottomRight');
            Helper.addClass(this.element, 'borderRadiusTopRight');

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