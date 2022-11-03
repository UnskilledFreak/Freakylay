namespace Freakylay.Game.BeatSaber.Connection {
    export class HttpSiraStatus extends BaseConnection {
        public connect(ip: string, port: number): boolean {
            return false;
        }

        public disconnect(): boolean {
            return false;
        }

        protected getCompatibility(): Freakylay.Game.Compatibility {
            return undefined;
        }

        protected getName(): string {
            return 'HttpSiraStatus 1.20.0';
        }

        protected initializeEvents(): void {
        }

        public reconnect(): boolean {
            return false;
        }

        protected setCompatibility(): void {
        }
    }
}