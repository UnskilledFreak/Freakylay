namespace Freakylay.DataTransfer.WebSocket {

    /**
     * class that allows to connect to multiple endpoints on a single WebSocket server
     */
    export class WebSocketConnection {

        private connections: WebSocketEndPoint[];
        private ip: string;
        private port: number;

        /**
         * generic info to connect to a WebSocket server with
         * @param urlOrIp
         * @param port
         */
        constructor(urlOrIp: string, port: number) {
            this.connections = [];
            this.ip = urlOrIp;
            this.port = port;
        }

        /**
         * adds a connection to the given url or ip from the constructor and the endpoints name
         * will also get used to receive data from the WebSocket and can be set to JSON
         * @param name
         * @param callback
         * @param isJsonData
         */
        public addEndpoint(name: string, callback: (string) => void, isJsonData: boolean = true): void {
            this.connections[name] = new WebSocketEndPoint(
                this.getUrl() + name,
                (data) => {
                    let d = isJsonData ? JSON.parse(data.data) : data.data;
                    //console.log(d);
                    callback(d);
                },
                () => {},
                () => {
                    window.setTimeout(() => {
                        this.addEndpoint(name, callback);
                    }, 5000);
                }
            );
        }

        /**
         * generates a usable url for the WebSocket protocol
         * @param onlyIp
         */
        public getUrl(onlyIp: boolean = false): string {
            if (onlyIp) {
                return this.ip;
            }
            return 'ws:' + this.getUrl(true) + ':' + this.port + '/';
        }

        /**
         * allows to reconnect to the same server or a new one
         * will also reconnect all registered endpoints if any
         * @param ip
         * @param port
         */
        public reconnect(ip: string = null, port: number = null): void {
            if (ip != null) {
                this.ip = ip;
            }
            if (port != null) {
                this.port = port;
            }

            this.connections.forEach(conn => {
                conn.reconnect(this.getUrl());
            }, this);
        }

        /**
         * closes all connections to the WebSocket server
         */
        public disconnect(): void {
            this.connections.forEach(conn => {
                conn.disconnect();
            }, this);
        }

        /**
         * returns true if at least one endpoint is connected
         */
        public isConnected(): boolean {
            return this.connections.length > 0 && this.connections.some(x => x.Connected);
        }
    }
}