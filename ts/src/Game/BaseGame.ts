namespace Freakylay.Game {
    /**
     * abstract class which all Games must inherit
     */
    export abstract class BaseGame {
        protected name: string;
        protected connections: BaseConnection[];

        /**
         * returns connection list
         */
        get getConnections(): BaseConnection[] {
            return this.connections;
        }

        constructor() {
            this.connections = [];
        }

        /**
         * returns unique game name to use
         */
        public abstract getName(): string;

        /**
         * returns true if there is at least one possible connection
         */
        public isValid(): boolean {
            return this.connections.length > 0;
        }

        /**
         * load the name into name variable
         */
        public initialize(): void {
            this.name = this.getName();
        }

        /**
         * adds a new connection to the possible connection pool
         * @param connection
         */
        public addConnections(connection: BaseConnection[]): void {
            this.connections = connection;
        }
    }
}