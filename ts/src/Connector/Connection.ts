namespace Freakylay.Connector {
    export class Connection {

        private url: string;
        private callbacks: {
            message: (string) => void,
            open: (string) => void,
            close: () => void,
            error: () => void
        };
        private socket: WebSocket;

        constructor(url: string, messageCallback: (string) => void, openCallback: (string) => void, closeCallback: () => void, errorCallback: () => void = null) {
            this.url = url;

            this.callbacks = {
                message: messageCallback,
                open: openCallback,
                close: closeCallback,
                error: errorCallback
            }

            this.connect();
        }

        public reconnect(url: string = null): void {
            if (url != null) {
                this.url = url;
            }

            this.log('reconnecting');
            this.socket.close();
            this.connect();
        }

        private connect(): void {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = (message: Event) => {
                this.onOpen(message);
            };
            this.socket.onmessage = (message: Event) => {
                this.onMessage(message);
            };
            this.socket.onclose = () => {
                this.onClose();
            };
            this.socket.onerror = () => {
                this.onError();
            };
        }

        private log(msg: string): void {
            console.log('[' + this.url + '] ' + msg);
        }

        private onOpen(message: Event): void {
            this.log('connection estabilished');
            this.callbacks.open(message);
        }

        private onClose(): void {
            this.log('lost connection!');
            this.callbacks.close();
        }

        private onMessage(message: Event): void {
            this.callbacks.message(message);
        }

        private onError(): void {
            if (typeof this.callbacks.error == 'function') {
                this.callbacks.error();
            }
        }
    }
}