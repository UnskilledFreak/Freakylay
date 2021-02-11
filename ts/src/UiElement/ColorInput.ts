/// <reference path="../Internal/Helper.ts" />
/// <reference path="../Data/Color.ts" />

namespace Freakylay.UiElement {
    import Helper = Freakylay.Internal.Helper;
    import Color = Freakylay.Data.Color;

    export class ColorInput {

        static Instance = 0;
        private instance: number;
        private color: Color;
        private changeEvent: (Color) => void;
        private alphaCheck: (number) => boolean;
        private rElement: HTMLInputElement;
        private gElement: HTMLInputElement;
        private bElement: HTMLInputElement;
        private aElement: HTMLInputElement;
        private aInfoElement: HTMLSpanElement;

        constructor(color: Color, changeEvent: (Color) => void, alphaCheck: (number) => boolean) {

            this.instance = ColorInput.Instance;
            ColorInput.Instance++;

            this.color = color;
            this.changeEvent = changeEvent;
            this.alphaCheck = alphaCheck;
        }

        public createInputMenu(element: HTMLElement): void {

            this.rElement = this.input(this.color.r, 'r');
            this.gElement = this.input(this.color.g, 'g');
            this.bElement = this.input(this.color.b, 'b');
            this.aElement = this.input(this.color.a, 'a');

            this.aInfoElement = Helper.create('span') as HTMLSpanElement;
            this.aInfoElement.innerHTML = 'Not recommended';

            Helper.visibility(this.aInfoElement, false);


            this.rElement.oninput = () => {
                this.color.r = parseInt(this.rElement.value);
                this.changeEvent(this.color);
            };
            this.gElement.oninput = () => {
                this.color.g = parseInt(this.gElement.value);
                this.changeEvent(this.color);
            };
            this.bElement.oninput = () => {
                this.color.b = parseInt(this.bElement.value);
                this.changeEvent(this.color);
            };
            this.aElement.oninput = () => {
                let a = parseInt(this.aElement.value);
                Helper.visibility(this.aInfoElement, this.alphaCheck(a));
                this.color.a = a;
                this.changeEvent(this.color);
            };

            element.append(
                ColorInput.label('R:', this.rElement.id),
                this.rElement,
                ColorInput.label('G:', this.gElement.id),
                this.gElement,
                ColorInput.label('B:', this.bElement.id),
                this.bElement,
                ColorInput.label('A:', this.aElement.id),
                this.aElement,
                this.aInfoElement
            );
        }

        private input(value: number, id: string): HTMLInputElement {
            let i = Helper.create('input') as HTMLInputElement;
            i.type = 'range';
            i.min = '0';
            i.max = '255';
            i.value = value.toString();
            i.id = 'in_' + this.instance + id;
            i.style.width = '80px';

            return i;
        }

        private static label(text: string, id: string): HTMLLabelElement {
            let l = Helper.create('label') as HTMLLabelElement;
            l.htmlFor = id;
            l.innerHTML = text;

            return l;
        }
    }
}