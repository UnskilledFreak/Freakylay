namespace Freakylay.Internal {
    /**
     * event based property
     * will trigger events when the value gets changed
     */
    export class EventProperty<T> {

        private static nameCache: string[] = [];

        private _value: T;
        private _oldValue: T;
        private readonly _eventName: string;
        private _internal: ((ev: CustomEvent) => void)[];
        private _callbacks: ((value: T, oldValue?: T) => void)[] = [];
        private readonly logger: Logger;
        private isRegistered: boolean = false;

        constructor(defaultValue?: T) {
            this.logger = new Logger('EventProperty')
            this._eventName = EventProperty.generateRandomEventName();
            this._value = defaultValue;
            this._oldValue = null;
            this._callbacks = [];
            this._internal = [];

            this.logger.changeName('Event ' + this._eventName);
        }

        get Value(): T {
            return this._value;
        }

        get OldValue(): T {
            return this._oldValue;
        }

        set Value(value: T) {
            this._oldValue = this._value;
            this._value = value;

            this.trigger();
        }

        /**
         * force the event
         */
        public trigger(): void {
            window.dispatchEvent(new CustomEvent(this._eventName, {
                detail: {
                    new: this.Value,
                    old: this.OldValue
                }
            }));
        }

        /**
         * register a handler to value change
         * @param callback
         */
        public register(callback: (value: T, oldValue?: T) => void): void {
            this._callbacks.push(callback);

            if (!this.isRegistered) {
                this._internal.push((ev: CustomEvent) => {
                    this.internalEventHandler(ev);
                });
                window.addEventListener(this._eventName, this._internal.last());
                this.isRegistered = !this.isRegistered;
            }
        }

        /**
         * unregisters all handlers from the value change
         */
        public unregister(): void {
            for (let int of this._internal) {
                window.removeEventListener(this._eventName, int);
            }
            this._callbacks = [];
            this._internal = [];
            this.isRegistered = false;
        }

        /**
         * handles internal event calling for register and unregister purposes
         * @param ev
         * @private
         */
        private internalEventHandler(ev: CustomEvent): void {
            if (this._callbacks.length > 0) {
                for (let call of this._callbacks) {
                    call(ev.detail.new, ev.detail.old);
                }
            }
        }

        /**
         * generates a random but unique event name so each property will have its own unique name
         * @private
         */
        private static generateRandomEventName() {
            let test;
            do {
                test = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 32);
            } while (EventProperty.nameCache.includes(test))

            EventProperty.nameCache.push(test);
            return test;
        }
    }
}