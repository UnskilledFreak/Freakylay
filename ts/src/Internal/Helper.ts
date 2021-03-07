namespace Freakylay.Internal {
    import Color = Freakylay.Data.Color;

    export class Helper {
        static SvgNamespace = 'http://www.w3.org/2000/svg';

        static element<T>(selector: string): T {
            return document.querySelector('#' + selector) as unknown as T;
        }

        static div(): HTMLDivElement {
            return this.create<HTMLDivElement>('div');
        }

        static create<T>(tag: string, namespace: string = ''): T {
            if (namespace === '') {
                return document.createElement(tag) as unknown as T;
            }

            return document.createElementNS(namespace, tag) as unknown as T;
        }

        static svg<T>(tag: string): T {
            return Helper.create<T>(tag, this.SvgNamespace);
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

        static toggleClass(element: HTMLElement | SVGElement, value: boolean, className: string): void {
            if (value) {
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

        static areColorsEqual(a: Color, b: Color): boolean {
            return a.toRgb() == b.toRgb();
        }
    }
}