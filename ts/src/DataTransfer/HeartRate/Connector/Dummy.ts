namespace Freakylay.DataTransfer.HeartRate.Connector {
    import Config = Freakylay.Internal.Config.Config;
    import EventProperty = Freakylay.Internal.EventProperty;

    export class Dummy extends AbstractConnector {

        private interval: number;

        constructor(config: Config, connectionState: EventProperty<ConnectionState>) {
            super(config, 'Dummy', connectionState);
        }

        public start(): void {
            this.stop();
            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Fetching;
            this.sendRandomBpm();
            this.interval = window.setInterval(() => {
                this.sendRandomBpm();
            }, 1000);
        }

        public stop(): void {
            if (this.interval) {
                window.clearInterval(this.interval);
            }
            this.interval = null;
            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;
        }

        private sendRandomBpm(): void {
            this.bpm.Value = Math.round(Math.random() * 200);
        }
    }
}