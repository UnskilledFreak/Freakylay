namespace Freakylay.DataTransfer.WebSocket {

    import Logger = Freakylay.Internal.Logger;

    /**
     * general WebSocket class to attach custom events to any given WebSocket event
     */
    export class WebSocketEndPoint {

        private readonly logger: Logger;
        private socket: WebSocket;
        private url: string;
        private callbacks: {
            message: (string) => void,
            open: (string) => void,
            close: () => void,
            error: () => void
        };
        private isConnected: boolean;

        get Connected(): boolean {
            return this.isConnected;
        }

        /**
         * stores all events and establishes a connection
         * @param url
         * @param messageCallback
         * @param openCallback
         * @param closeCallback
         * @param errorCallback
         */
        constructor(
            url: string,
            messageCallback: (string) => void,
            openCallback: (string) => void,
            closeCallback: () => void,
            errorCallback: () => void = null
        ) {
            this.logger = new Logger('WS ' + url);
            this.url = url;
            this.isConnected = false;
            this.callbacks = {
                message: messageCallback,
                open: openCallback,
                close: closeCallback,
                error: errorCallback
            }

            this.connect();
        }

        /**
         * useful for reconnecting or change the url/ip to connect to
         * @param url
         */
        public reconnect(url: string = null): void {
            this.isConnected = false;
            if (url != null) {
                this.url = url;
                this.logger.changeName('WS ' + url);
            }

            //this.logger.log('reconnecting');
            this.socket.close();
            this.connect();
        }

        /**
         * will close the WebSocket's connection if any
         */
        public disconnect(): void {
            if (this.socket) {
                this.isConnected = false;
                this.socket.close();
            }
        }

        /**
         * connects to the given WebSocket URL and registers the custom events set in the constructor
         * @private
         */
        private connect(): void {
            this.disconnect();
            this.socket = new window.WebSocket(this.url);
            this.socket.onopen = (message: Event) => {
                this.onOpen(message);
                this.isConnected = true;
            };
            this.socket.onmessage = (message: MessageEvent) => {
                //this.logger.log(message)
                this.isConnected = true;
                this.onMessage(message);
            };
            this.socket.onclose = () => {
                this.isConnected = false;
                this.onClose();
            };
            this.socket.onerror = () => {
                this.isConnected = false;
                this.onError();
            };
        }

        /**
         * handler when the WebSocket connection was successful
         * @param message
         * @private
         */
        private onOpen(message: Event): void {
            //this.logger.log('connection estabilished');
            this.callbacks.open(message);
        }

        /**
         * handler when the WebSocket connection was closed
         * @private
         */
        private onClose(): void {
            //this.logger.log('lost connection!');
            this.callbacks.close();
        }

        /**
         * handler when a message was received from the WebSocket server
         * @param message
         * @private
         */
        private onMessage(message: Event): void {
            this.callbacks.message(message);
        }

        /**
         * handler when there was any error regarding the WebSocket connection
         * @private
         */
        private onError(): void {
            if (typeof this.callbacks.error == 'function') {
                this.callbacks.error();
            }
        }
    }
}