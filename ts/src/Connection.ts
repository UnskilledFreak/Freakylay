namespace Freakylay {
    export class Connection {

        private url: string;
        private callbacks: {
            message: (string) => void,
            open: (string) => void,
            close: () => void
        };
        private socket: WebSocket;

        constructor(url: string, messageCallback: (string) => void, openCallback: (string) => void, closeCallback: () => void) {
            this.url = url;

            this.callbacks = {
                message: messageCallback,
                open: openCallback,
                close: closeCallback
            }

            this.connect();
        }

        public reconnect(url: string = null) {
            if (url != null) {
                this.url = url;
            }

            this.socket.close();
            this.connect();
        }

        private connect() {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = (message: Event) => {
                this.onOpen(message);
            };
            this.socket.onmessage = (message: Event) => {
                this.onMessage(message);
            }
            this.socket.onclose = () => {
                this.onClose();
            }
        }

        private onOpen(message: Event) {
            this.callbacks.open(message);
        }

        private onClose() {
            this.callbacks.close();
        }

        private onMessage(message: Event) {
            this.callbacks.message(message);
        }
    }
}