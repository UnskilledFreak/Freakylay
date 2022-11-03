namespace Freakylay.Internal {

    export class Logger {

        private static outputElement: HTMLDivElement = null;
        private name: string;

        get element(): HTMLDivElement {
            return Logger.outputElement;
        }

        constructor(name: string) {
            this.name = name;
            if (Logger.outputElement == null) {
                Logger.outputElement = document.div().addClass('debugger');
            }
            //this.log('logger created');
        }

        /**
         * lets you change the name of the created logger instance
         * the log will display the change to a new name
         * @param newName
         */
        public changeName(newName: string): void {
            //this.log('changed name to: ' + newName);
            this.name = newName;
        }

        /**
         * log any data
         * @param messages
         */
        public log(...messages: any[]): void {
            let x;
            let d = new Date();
            for (let m of messages) {
                x = document.div();
                x.innerText = d.toLocaleTimeString() + ' - ' + this.name + ': ' + m;
                console.log(m);
                Logger.outputElement.append(x);
            }
            x.scrollIntoView(false);
        }

        /**
         * similar to log() but with a stacktrace attached to it for debugging purposes
         * @param messages
         */
        public debug(...messages: any[]): void {
            messages.push((new Error().stack))
            this.log(...messages);
        }
    }
}