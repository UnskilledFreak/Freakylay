namespace Freakylay {
    export class MultiConnection {

        private connections: Connection[];
        private ip: string;
        private port: number;

        constructor(ip, port) {
            this.connections = [];
            this.ip = ip;
            this.port = port;
        }

        public addEndpoint(name: string, callback: (string) => void): void {
            this.connections[name] = new Connection(
                this.getUrl() + name,
                (data) => {
                    data = JSON.parse(data.data);
                    callback(data);
                },
                () => {
                    MultiConnection.log(name, 'connected!');
                },
                () => {
                    MultiConnection.log(name, 'lost connection');
                    MultiConnection.log(name, 'reconnecting in 5 seconds');

                    window.setTimeout(() => {
                        this.addEndpoint(name, callback);
                    }, 5000);
                }
            );
        }

        public getUrl(a: boolean = false): string {
            if (a) {
                return this.ip + ':' + this.port;
            }
            return 'ws:' + this.getUrl(true) + '/';
        }

        public reconnect(ip: string = null, port: number = null): void {
            if (ip != null) {
                this.ip = ip;
            }
            if (port != null) {
                this.port = port;
            }

            for (let e of this.connections) {
                e.reconnect(this.getUrl());
            }
        }

        private static log(name: string, message: string): void {
            console.log('[' + name + '] ' + message);
        }
    }
}