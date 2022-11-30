/**
 * main file and entry point of the overlay
 *
 * contains a small library of helpers to make work easy
 * loads and starts the overlay when the document is ready for
 */
// noinspection JSUnusedGlobalSymbols
interface Object {
    isset<T>(key: number | string, defaultValue: T): T;

    foreach<T>(callback: (string) => void): void;
}

/**
 * checks if an object has a child element key, works with objects and arrays
 * will return the value of child element or default if key does not exist
 * @param key key to search for
 * @param defaultValue default value if key does not exist
 */
Object.prototype.isset = function <T>(key: number | string, defaultValue: T): T {
    return typeof this[key] !== 'undefined' && this[key] !== null ? this[key] : defaultValue;
}

/**
 * shorter way to iterate over objects but is limited by only names
 * @param callback string parameter is name itself, not the full qualifier
 */
Object.prototype.foreach = function <T>(callback: (string) => void): void {
    Object.keys(this).filter(callback);
}

// noinspection JSUnusedGlobalSymbols
interface Number {
    clamp(min: number, max: number, round?: boolean): number;

    random(max: number): number;

    toDateString(): string;

    leadingZero(length: number): string;
}

/**
 * will force a number to be minimum of min and a maximum of max
 * a value lower than min will result in min, a value higher than max will result in max
 * everything else is the number itself
 * @param min minimum allowed value
 * @param max maximum allowed value
 */
Number.prototype.clamp = function (min: number, max: number): number {
    return Math.min(max, Math.max(min, this));
}

/**
 * generates a random number between 0 and max
 * @param max highest possible random number
 */
Number.prototype.random = function (max: number): number {
    return Math.floor(Math.random() * (Math.abs(max - this) + 1)) + this;
}

/**
 * calculates a time based on a number, will return a human readable string
 */
Number.prototype.toDateString = function (): string {
    let seconds = (this % 60).leadingZero(2);
    let minutes = Math.floor(this / 60);
    return minutes < 0 ? seconds : minutes + ':' + seconds;
}

/**
 * adds leading zero's in front of any number, will result in a string
 * @param length total length of final string
 */
Number.prototype.leadingZero = function (length: number): string {
    let tmp = this.toString();
    if (tmp.length < length) {
        let diff = length - tmp.length;
        if (diff > 0) {
            return '0'.repeat(diff) + tmp;
        }
    }
    return tmp;
}

// noinspection JSUnusedGlobalSymbols
interface Element {
    addClass<T>(name: string): T;

    removeClass<T>(name: string): T;

    toggleClassByValue<T>(value: boolean, name: string): T;

    toggleClass<T>(name: string): T;

    visibility<T>(visible: boolean): T;

    display<T>(display: boolean, isInline?: boolean): T;

    inline<T>(inline: boolean): T;

    flex<T>(flex: boolean): T;

    removeChildren<T>(): T;

    setDataAttr(name: string, value: string): void;

    getDataAttr(name: string): string;
}

/**
 * adds a CSS class name on given element
 * @param name CSS class name
 */
Element.prototype.addClass = function <T>(name: string): T {
    if (!this.classList.contains(name)) {
        this.classList.add(name);
    }
    return this;
}

/**
 * removes a CSS class name on given element
 * @param name CSS class name
 */
Element.prototype.removeClass = function <T>(name: string): T {
    this.classList.remove(name);
    return this;
}

/**
 * toggles a CSS class on given element based on a value
 * if value is true, the CSS class will get added, otherwise removed
 * @param value boolean
 * @param name CSS class name
 */
Element.prototype.toggleClassByValue = function <T>(value: boolean, name: string): T {
    if (value) {
        return this.addClass(name);
    }
    return this.removeClass(name);
}

/**
 * toggles a CSS class on given element
 * if class exists it will get removed, otherwise added
 * @param name CSS class name
 */
Element.prototype.toggleClass = function <T>(name: string): T {
    if (this.classList.contains(name)) {
        return this.removeClass(name);
    }
    return this.addClass(name);
}

/**
 * toggles CSS visible value on given element
 * @param visible boolean, true is 'visible', false is 'hidden'
 */
Element.prototype.visibility = function <T>(visible: boolean): T {
    this.style.visibility = visible ? 'visible' : 'hidden';
    return this;
}

/**
 * toggles CSS display value on given element
 * @param display boolean, true is 'block', false is 'none'
 * @param isInline optional, if true the display will use 'inline-block' instead of 'block'
 */
Element.prototype.display = function <T>(display: boolean, isInline: boolean = false): T {
    this.style.display = display ? (isInline ? 'inline-block' : 'block') : 'none';
    return this;
}

/**
 * similar to display but for inline layers
 * @param inline boolean, true is 'flex', false is 'none'
 */
Element.prototype.inline = function <T>(inline: boolean): T {
    return this.display(inline, true);
}

/**
 * similar to display but for flex layers
 * @param flex boolean, true is 'flex', false is 'none'
 */
Element.prototype.flex = function <T>(flex: boolean): T {
    this.style.display = flex ? 'flex' : 'none';
    return this;
}

/**
 * removes all children from a node if any
 */
Element.prototype.removeChildren = function <T>(): T {
    let x = this.lastElementChild;
    while (x) {
        this.removeChild(x);
        x = this.lastElementChild;
    }
    return this;
}

/**
 * sets a data-* attribute to given element
 * @param name
 * @param value
 */
Element.prototype.setDataAttr = function (name: string, value: string): void {
    if (this.dataset) {
        this.dataset[name.toDataAttr()] = value;
        return
    }

    this.setAttribute(name, value);
}

/**
 * gets the value of a data-* attribute of given element
 * @param name
 */
Element.prototype.getDataAttr = function (name: string): string {
    if (this.dataset) {
        return this.dataset[name.toDataAttr()];
    }

    return this.getAttribute(name);
}

// noinspection JSUnusedGlobalSymbols
interface String {
    repeat(length: number): string;

    endsWith(str: string): boolean;

    startsWith(str: string): boolean;

    removeFirst(str: string): string;

    removeLast(str: string): string;

    toCapital(): string;

    toDataAttr(): string;
}

/**
 * repeats a string by itself until it reaches given length
 * repeat of multiple char strings is possible eg 'hello'.repeat(10) would result in 'hellohello'
 * @param length how many chars
 */
String.prototype.repeat = function (length: number): string {
    let ret = this;
    while (ret.length < length) {
        ret += this;
    }
    return ret;
}

/**
 * checks if a string end with given str
 * @param str needle
 */
String.prototype.endsWith = function (str: string): boolean {
    return this.substring(0, this.length - str.length) === str;
}

/**
 * checks if a string starts with given str
 * @param str needle
 */
String.prototype.startsWith = function (str: string): boolean {
    return this.substring(0, str.length) === str;
}

/**
 * shorthand for substring(str.length) but checks if given str is at the start of the string
 * will return full string if str was not found
 * @param str needle
 */
String.prototype.removeFirst = function (str: string): string {
    return this.startsWith(str) ? this.substring(str.length) : this;
}

/**
 * shorthand for substring(0, length - str.length) but checks if given str is at the end of the string
 * will return full string if str was not found
 * @param str needle
 */
String.prototype.removeLast = function (str: string): string {
    return this.endsWith(str) ? this.substring(0, this.length - str.length) : this;
}

/**
 * converts beginning of a string to a uppercase char
 */
String.prototype.toCapital = function (): string {
    let tmp = this.substring(0, 1);
    return tmp.toUpperCase() + this.substring(1);
}

/**
 * string to use for data-* attribute name, not its value
 */
String.prototype.toDataAttr = function (): string {
    let tmp = this.split('-');
    let dsName = tmp.shift().toLowerCase();
    for (let s of tmp) {
        dsName += s.toCapital();
    }
    return dsName;
}

// noinspection JSUnusedGlobalSymbols
interface Document {
    get<T>(selector: string): T;

    getId<T>(selector: string): T;

    getDiv(selector: string): HTMLDivElement;

    getAll<T>(selector: string): T;

    create<T>(tag: string, namespace?: string): T;

    createSvg<T>(tag: string): T;

    div(): HTMLDivElement;

    span(): HTMLSpanElement;

    button(name: string, onClick: (HTMLInputElement) => void): HTMLButtonElement;

    headline(content: string, size?: number): HTMLHeadingElement;

    label(text: string, id?: string): HTMLLabelElement;

    inputRange(value: number, min: number, max: number, step?: number): HTMLInputElement;
}

/**
 * returns a specific element in the dom by css query
 * @param selector css query selector
 */
Document.prototype.get = function <T>(selector: string): T {
    return <T>this.querySelector(selector);
}

/**
 * returns a specific element in the dom by its ID property
 * @param selector css query selector without # in front
 */
Document.prototype.getId = function <T>(selector: string): T {
    return <T>this.get('#' + selector);
}

/**
 * alias for document.getId<HTMLDivElement>()
 * @param selector
 */
Document.prototype.getDiv = function (selector: string): HTMLDivElement {
    return this.getId(selector);
}

/**
 * returns all elements of given type T as an array filtered by the CSS selector
 * @param selector css query selector
 */
Document.prototype.getAll = function <T>(selector: string): T {
    return <T>this.querySelectorAll(selector);
}

/**
 * generic create function for tags
 * @param tag tag name
 * @param namespace optional
 */
Document.prototype.create = function <T>(tag: string, namespace: string = ''): T {
    if (namespace === '') {
        return <T>this.createElement(tag);
    }
    return <T>this.createElementNS(namespace, tag);
}

/**
 * creates a specific tag under SVG namespace
 * @param tag tag name
 */
Document.prototype.createSvg = function <T>(tag: string): T {
    return <T>this.create(tag, 'http://www.w3.org/2000/svg');
}

/**
 * creates an empty HTMLDivElement
 */
Document.prototype.div = function (): HTMLDivElement {
    return this.create('div');
}

/**
 * creates an empty HTMLSpanElement
 */
Document.prototype.span = function (): HTMLSpanElement {
    return this.create('span');
}

/**
 * create a button element with an onclick event attached to it
 * @param name button name
 * @param onClick event
 */
Document.prototype.button = function (name: string, onClick: (HTMLInputElement) => void): HTMLButtonElement {
    let button = document.create<HTMLInputElement>('button');
    button.innerText = name;
    button.onclick = onClick;
    return button;
}

/**
 * create a headline element
 * @param content headling
 * @param size optional size, default 1 (biggest)
 */
Document.prototype.headline = function (content: string, size: number = 1): HTMLHeadingElement {
    let line = document.create<HTMLHeadingElement>('h' + size.clamp(1, 7));
    line.innerText = content;
    return line;
}

/**
 * creates a label element
 * @param text
 * @param id
 * @private
 */
Document.prototype.label = function (text: string, id: string = null): HTMLLabelElement {
    let label = document.create<HTMLLabelElement>('label');
    if (id != null) {
        label.htmlFor = id;
    }
    label.innerText = text;

    return label;
}

/**
 * creates an input element of type range for color usage
 * @param value
 * @param min
 * @param max
 * @param step
 * @private
 */
Document.prototype.inputRange = function (value: number, min: number, max: number = 100, step: number = 1): HTMLInputElement {
    let input = document.create<HTMLInputElement>('input');
    input.type = 'range';
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString()
    input.value = value.toString();
    input.defaultValue = input.value;
    return input;
}

// noinspection JSUnusedGlobalSymbols
interface Array<T> {
    firstOrError(check?: (T) => boolean): T;

    last(): T;
}

/**
 * returns first element in an array
 * similar to C# LINQ's FirstOrDefault()
 * @param check predicate to determine first searched element, if empty the first element will be returned if exists
 */
Array.prototype.firstOrError = function <T>(check: (T) => boolean = null): T {
    let tmp = this;
    if (typeof check === 'function') {
        tmp = this.filter(check);
    }
    if (tmp.length != 1) {
        throw new Error('Unable to find first element!');
    }
    return tmp[0];
}

/**
 * returns the last element of an array for pre ES2022 compatibility
 */
Array.prototype.last = function <T>(): T {
    return this[this.length - 1];
}

/**
 * main entry point here
 * only run when DOM is fully loaded
 */
let overlay: Freakylay.Overlay;
window.onload = () => {
    overlay = new Freakylay.Overlay();
}