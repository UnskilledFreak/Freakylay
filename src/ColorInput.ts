import {Helper} from "./Helper";

export class ColorInput {

    static Instance = 0;
    private instance: number;
    private changeEvent: (string) => void;
    private alphaCheck: (number) => boolean;
    private r: number;
    private g: number;
    private b: number;
    private a: number;
    private rElement: HTMLInputElement;
    private gElement: HTMLInputElement;
    private bElement: HTMLInputElement;
    private aElement: HTMLInputElement;
    private aInfoElement: HTMLSpanElement;

    constructor(color: string, changeEvent: (string) => void, alphaCheck: (number) => boolean) {

        this.instance = ColorInput.Instance;
        ColorInput.Instance++;

        this.changeEvent = changeEvent;
        this.alphaCheck = alphaCheck;

        let r, g, b, a, prefix;
        if (color.substring(0, 1) === '#') {
            color = color.length === 7 ? color + 'FF' : color;
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
            a = parseInt(color.substring(7, 9), 16);
        } else {
            let splitColor = color.replace(/ /g, '').split(',');
            splitColor[splitColor.length - 1] = splitColor[splitColor.length - 1].substring(0, splitColor[splitColor.length - 1].length - 1);

            prefix = splitColor[0].substring(0, 4).toLowerCase();

            splitColor[0] = splitColor[0].substring(3);

            if (prefix === 'rgb') {
                splitColor[0] = splitColor[0].substring(1);
                a = 255;
            } else {
                splitColor[0] = color[0].substring(2);
                a = Math.round(parseFloat(splitColor[3]) * 255);
            }

            r = parseInt(splitColor[0]);
            g = parseInt(splitColor[1]);
            b = parseInt(splitColor[2]);
        }

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public createInputMenu(element: HTMLElement): void {
        this.rElement = this.input(this.r, 'r');
        this.gElement = this.input(this.g, 'g');
        this.bElement = this.input(this.b, 'b');
        this.aElement = this.input(this.a, 'a');
        this.aInfoElement = Helper.create('span') as HTMLSpanElement;
        this.aInfoElement.innerHTML = 'Not recommended';
        Helper.visibility(this.aInfoElement, false);

        let change = () => {
            this.internalChange();
        };

        this.rElement.oninput = change;
        this.gElement.oninput = change;
        this.bElement.oninput = change;
        this.aElement.oninput = () => {
            let a = parseInt(this.aElement.value);
            Helper.visibility(this.aInfoElement, this.alphaCheck(a));
            change();
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

    private internalChange(): void {
        this.changeEvent(this.getColor());
    }

    private getColor(): string {
        let r = parseInt(this.rElement.value);
        let g = parseInt(this.gElement.value);
        let b = parseInt(this.bElement.value);
        let a = parseInt(this.aElement.value);

        if (a === 255) {
            return '#' + ColorInput.to2digitHex(r) + ColorInput.to2digitHex(g) + ColorInput.to2digitHex(b);
        }

        return 'rgba(' + [r, g, b, (a / 255).toFixed(2)].join(', ') + ')';
    }

    private static to2digitHex(input: number): string {
        let sInput = input.toString(16);
        return sInput.length === 1 ? '0' + sInput : sInput;
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