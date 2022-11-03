namespace Freakylay.Game {

    /**
     * abstract class which all Games must inherit
     * todo :: further explanation on methods
     */
    export abstract class BaseGame {
        protected name: string;
        protected connections: BaseConnection[];

        get getConnections(): BaseConnection[] {
            return this.connections;
        }

        constructor() {
            this.connections = [];
        }

        public abstract getName(): string;

        public isValid(): boolean {
            return this.connections.length > 0;
        }

        public initialize(): void {
            this.name = this.getName();
        }

        public addConnections(connection: BaseConnection[]): void {
            this.connections = connection;
        }
    }
}