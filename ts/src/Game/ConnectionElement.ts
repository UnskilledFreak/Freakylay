namespace Freakylay.Game {
    export class ConnectionElement {
        public name: string;
        public connection: BaseConnection;

        constructor(name: string, connection: BaseConnection) {
            this.name = name;
            this.connection = connection;
        }
    }
}