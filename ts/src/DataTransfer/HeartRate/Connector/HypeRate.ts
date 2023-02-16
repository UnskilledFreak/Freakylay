namespace Freakylay.DataTransfer.HeartRate.Connector {
    import Config = Freakylay.Internal.Config.Config;
    import EventProperty = Freakylay.Internal.EventProperty;

    export class HypeRate extends AbstractConnector {
        private socket: WebSocket;
        private heartBeat: number;
        private ref: number = 0;

        constructor(config: Config, connectionState: EventProperty<ConnectionState>) {
            super(config, 'HypeRate', connectionState);

            this.heartBeat = null;
        }

        public start(): void {
            if (this.config.heartRate.tokenOrUrl.Value.length < 1) {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
                return;
            }

            this.socket = new window.WebSocket('wss://app.hyperate.io/socket/websocket?token=YydSvONFDC7NifNfIQB62KzxOH9CjvRaeT9awH3PRvHSFsqkNna5LpADddsnmAeV');
            this.socket.onopen = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Ready;
                // seems we are connected, request session channel
                this.socket.send(JSON.stringify({
                    //'topic': 'hr:internal-testing',
                    'topic': 'hr:' + this.config.heartRate.tokenOrUrl.Value,
                    'event': 'phx_join',
                    'payload': {},
                    'ref': this.ref
                }));

                this.heartBeat = window.setInterval(() => {
                    this.socket.send(JSON.stringify({
                        'topic': 'phoenix',
                        'event': 'heartbeat',
                        'payload': {},
                        'ref': this.ref
                    }));
                }, 29000);
            };
            this.socket.onerror = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
                this.stop();
            };
            this.socket.onclose = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;
                this.stop();
            };
            this.socket.onmessage = (e) => {
                let stringData = e.isset('data', '');
                if (stringData == '') {
                    this.bpm.Value = 0;
                    return;
                }

                let data = JSON.parse(stringData);
                let event = data.isset('event', '');
                if (event != 'hr_update') {
                    this.logger.log(data);
                    return;
                }

                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Fetching;
                this.bpm.Value = data.isset('payload', {}).isset('hr', 0);
            };
        }

        public stop(): void {
            if (this.socket instanceof window.WebSocket) {
                this.socket.close();
            }

            if (this.heartBeat != null) {
                window.clearInterval(this.heartBeat);
                this.heartBeat = null;
            }
        }
    }
}