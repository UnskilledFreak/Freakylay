/// <reference path="../Internal/Color.ts" />

namespace Freakylay.Ui {
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * UI class to display a color mixer
     * makes use of statics to provide multiple instances inside DOM with one class
     */
    export class ColorInput {

        static Instance = 0;

        public readonly color: EventProperty<Color>;

        private readonly instance: number;
        private readonly name: string;
        private readonly id: string;
        private readonly languageManager: LanguageManager;

        private alphaCheck: (number) => boolean;
        private rElement: HTMLInputElement;
        private gElement: HTMLInputElement;
        private bElement: HTMLInputElement;
        private aElement: HTMLInputElement;
        private aInfoElement: HTMLSpanElement;
        private rNumElement: HTMLSpanElement;
        private gNumElement: HTMLSpanElement;
        private bNumElement: HTMLSpanElement;
        private aNumElement: HTMLSpanElement;

        constructor(languageManager: LanguageManager, name: string, id: string, color: Color, alphaCheck?: (number) => boolean) {

            this.instance = ColorInput.Instance;
            ColorInput.Instance++;

            this.languageManager = languageManager;
            this.name = name;
            this.id = id;
            this.color = new EventProperty<Color>(color);
            this.color.Value.onAlphaChange.register((alpha: number) => {
                if (typeof this.alphaCheck === 'function') {
                    this.aInfoElement.visibility(this.alphaCheck(alpha));
                }
            });
            this.alphaCheck = alphaCheck;
        }

        /**
         * creates the needed UI elements and registers events
         * @param element parent element to append all inputs to
         */
        public createInputMenu(element: HTMLElement): void {
            // create inputs
            this.rElement = document.inputRange(this.color.Value.red, 0, 255);
            this.gElement = document.inputRange(this.color.Value.green, 0, 255);
            this.bElement = document.inputRange(this.color.Value.blue, 0, 255);
            this.aElement = document.inputRange(this.color.Value.alpha * 255, 0, 255);

            // create info elements
            this.rNumElement = document.span().addClass('number');
            this.gNumElement = document.span().addClass('number');
            this.bNumElement = document.span().addClass('number');
            this.aNumElement = document.span().addClass('number');

            // preset values
            this.rNumElement.innerText = this.color.Value.red.toString();
            this.gNumElement.innerText = this.color.Value.green.toString();
            this.bNumElement.innerText = this.color.Value.blue.toString();
            this.aNumElement.innerText = (this.color.Value.alpha * 255).toFixed(0);

            // info element, will get displayed if alpha check returns true
            this.aInfoElement = document.span().addClass('alphaInfo');
            this.aInfoElement.visibility<HTMLSpanElement>(false).innerHTML = this.languageManager.getLocalizedText('alphaInfo');

            // register events when color inputs get changed
            this.handleChange(this.rElement, this.rNumElement, (value: number) => this.color.Value.red = value);
            this.handleChange(this.gElement, this.gNumElement, (value: number) => this.color.Value.green = value);
            this.handleChange(this.bElement, this.bNumElement, (value: number) => this.color.Value.blue = value);
            this.handleChange(this.aElement, this.aNumElement, (value: number) => this.color.Value.alpha = value / 255);

            // small wrapper to combine everything
            let name: HTMLDivElement = document.div();
            let colorHolder: HTMLDivElement = document.div().addClass('colorInputs');
            let lines: [string, HTMLDivElement, HTMLSpanElement][] = [
                ['Red', this.rElement, this.rNumElement],
                ['Green', this.gElement, this.gNumElement],
                ['Blue', this.bElement, this.bNumElement],
                ['Alpha', this.aElement, this.aNumElement],
            ];

            // the actual appends for wrapper elements is here
            for (let x of lines) {
                let line: HTMLDivElement = document.div().addClass('colorLine');
                let label = document.label(this.languageManager.getLocalizedText('colorInputs' + x[0]) + ':');
                (label as HTMLElement).addClass('colorInputs' + x[0]);
                line.append(
                    label,
                    x[1],
                    x[2]
                );
                colorHolder.append(line);
            }

            // add name and alpha check info
            let title = document.span().addClass(this.id) as HTMLSpanElement;
            title.textContent = this.name;
            name.append(title);
            // name.innerHTML = this.name;
            name.append(this.aInfoElement);

            // append everything to its given parent
            element.append(name, colorHolder);

            // register color event changes
            this.color.register(colorChange => {
                this.rElement.value = colorChange.red.toString();
                this.gElement.value = colorChange.green.toString();
                this.bElement.value = colorChange.blue.toString();
                this.aElement.value = (colorChange.alpha * 255).toFixed(0);

                this.rNumElement.innerText = colorChange.red.toString();
                this.gNumElement.innerText = colorChange.green.toString();
                this.bNumElement.innerText = colorChange.blue.toString();
                this.aNumElement.innerText = (colorChange.alpha * 255).toFixed(0);
            });
        }

        /**
         * event handler when an input of type range is changed
         * @param input
         * @param info
         * @param callback
         * @private
         */
        private handleChange(input: HTMLInputElement, info: HTMLSpanElement, callback: (number) => void): void {
            input.oninput = () => {

                let tmp: number = parseInt(input.value);
                callback(tmp);

                info.innerText = tmp.toFixed(0);
                this.color.trigger();
            };
        }
    }
}