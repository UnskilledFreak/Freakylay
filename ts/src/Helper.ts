namespace Freakylay {
    export class Helper {
        static SvgNamespace = 'http://www.w3.org/2000/svg';

        static element(selector: string): Element {
            return document.querySelector('#' + selector);
        }

        static create(tag: string, namespace: string = ''): Element {
            if (namespace === '') {
                return document.createElement(tag);
            }

            return document.createElementNS(namespace, tag);
        }

        static svg(tag: string): SVGElement {
            return Helper.create(tag, this.SvgNamespace) as SVGElement;
        }

        static addClass(element: Element, className: string): void {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        }

        static removeClass(element: Element, className: string): void {
            let classes = element.className.split(' ').filter(v => v !== className);
            element.className = classes.filter(((value, index, array) => array.indexOf(value) === index)).join(' ');
        }

        static issetCheck(data: object, key: number | string): boolean {
            return typeof data[key] !== 'undefined' && data[key] !== null;
        }

        static isset<T>(data: object, key: number | string, def: T): T {
            return this.issetCheck(data, key) ? data[key] : def;
        }

        static clamp(input: number, min: number, max: number): number {
            return Math.min(max, Math.max(min, input));
        }

        static visibility(element: HTMLElement | SVGElement, visible: boolean): void {
            element.style.visibility = visible ? 'visible' : 'hidden';
        }

        static display(element: HTMLElement | SVGElement, display: boolean, isInline: boolean = false): void {
            element.style.display = display ? (isInline ? 'inline-block' : 'block') : 'none';
        }

        static fromUrlColor(input: string): string {
            if (input.substring(0, 3) === 'rgb') {
                return input;
            }

            if (input.match(/[^0-9A-Fa-f]/g) === null) {
                return '#' + input;
            }

            return '#000000';
        }

        static toUrlColor(input: string): string {
            if (input.substring(0, 1) === '#') {
                return input.substring(1);
            }
            if (input.substring(0, 3) === 'rgb') {
                return input;
            }

            return '000000';
        }

        static toggleClass(element: HTMLElement | SVGElement, value: any, className: string): void {
            if (!!value) {
                Helper.addClass(element, className);
            } else {
                Helper.removeClass(element, className);
            }
        }

        static stringRepeat(input: string, length: number): string {
            let ret = input;
            while (ret.length < length) {
                ret += input;
            }

            return ret;
        }
    }
}