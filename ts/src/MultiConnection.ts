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
                    callback(JSON.parse(data.data));
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

        public getUrl(onlyIp: boolean = false): string {
            if (onlyIp) {
                return this.ip;
            }
            return 'ws:' + this.getUrl(true) + ':' + this.port + '/';
        }

        public reconnect(ip: string = null, port: number = null): void {
            if (ip != null) {
                this.ip = ip;
            }
            if (port != null) {
                this.port = port;
            }

            this.connections.forEach(conn => {
                conn.reconnect(this.getUrl());
            });
        }

        private static log(name: string, message: string): void {
            console.log('[' + name + '] ' + message);
        }
    }
}