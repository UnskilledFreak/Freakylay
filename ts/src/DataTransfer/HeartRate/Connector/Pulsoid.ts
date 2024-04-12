///<reference path="../../../Internal/EventProperty.ts"/>
namespace Freakylay.DataTransfer.HeartRate.Connector {
    import Config = Freakylay.Internal.Config.Config;
    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * Pulsoid class to get heart rate info
     */
    export class Pulsoid extends AbstractConnector {

        private tokenSocket: WebSocket;

        constructor(config: Config, connectionState: EventProperty<ConnectionState>) {
            super(config, 'Pulsoid', connectionState);
        }

        /**
         * starts data gathering
         */
        public start(): void {
            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;

            if (
                this.config.heartRate.type.Value === Freakylay.DataTransfer.HeartRate.FeedType.Token
                && !(this.tokenSocket instanceof window.WebSocket)
            ) {
                this.getTokenData();
            }
        }

        /**
         * stops the connection if any
         */
        public stop(): void {
            if (this.tokenSocket instanceof window.WebSocket) {
                this.tokenSocket.close();
            }
            this.tokenSocket = null;
        }

        /**
         * gets Pulsoid data based on token feed type
         * @private
         */
        private getTokenData(): void {
            // this should use WebSocketConnection but that does not allow handlers for error, close and open events
            this.tokenSocket = new window.WebSocket('wss://dev.pulsoid.net/api/v1/data/real_time?access_token=' + this.config.heartRate.tokenOrUrl.Value);
            this.tokenSocket.onopen = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Ready;
            };
            this.tokenSocket.onerror = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
                this.stop();
            };
            this.tokenSocket.onclose = () => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;
                this.stop();
            };
            this.tokenSocket.onmessage = (e) => {
                this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Fetching;
                let data = JSON.parse(e.data);
                this.bpm.Value = data.isset('data', {}).isset('heart_rate', 0);
            };
        }
    }
}