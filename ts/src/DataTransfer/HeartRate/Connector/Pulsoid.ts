///<reference path="../../../Internal/EventProperty.ts"/>
namespace Freakylay.DataTransfer.HeartRate.Connector {
    import Config = Freakylay.Internal.Config.Config;
    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * Pulsoid class to get heart rate info
     */
    export class Pulsoid extends AbstractConnector {

        private timeout: number;
        private tokenSocket: WebSocket;
        private lastCheck: number;

        constructor(config: Config, connectionState: EventProperty<ConnectionState>) {
            super(config, 'Pulsoid', connectionState);
        }

        /**
         * starts data gathering
         */
        public start(): void {
            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;

            switch (this.config.heartRate.type.Value) {
                case Freakylay.DataTransfer.HeartRate.FeedType.Token:
                    // this must only get executed when there is not already a connection
                    if (!(this.tokenSocket instanceof window.WebSocket)) {
                        this.getTokenData();
                    }
                    return;
                case Freakylay.DataTransfer.HeartRate.FeedType.JSON:
                    if (this.lastCheck == 0) {
                        return;
                    }
                    this.lastCheck = 0;
                    // this needs to be in a loop itself
                    this.timeout = window.setInterval(() => {
                        this.getJsonData();
                        if (this.connectionState.Value == Freakylay.DataTransfer.HeartRate.ConnectionState.Error) {
                            this.stop();
                        }
                    }, 750);
                    return;
            }
        }

        /**
         * stops the connection if any
         */
        public stop(): void {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            if (this.tokenSocket instanceof window.WebSocket) {
                this.tokenSocket.close();
            }
        }

        /**
         * gets Pulsoid data based on JSON feed type
         * will get removed in near future
         * I'm so sorry to bypass old JSON integration CORS with this little hack found in the get*Date functions, but I don't know how to get CORS done via a local running script
         * @private
         */
        private getJsonData(): void {
            this.ajaxHelper(
                'http://u.unskilledfreak.zone/overlay/freakylay/pulsoid.php?pType=JSON&pFeed=' + this.config.heartRate.tokenOrUrl.Value,
                (data: string) => {
                    this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Fetching;
                    let measured = data.isset('measured_at', 0);
                    let bpm = data.isset('bpm', 0);

                    if (measured >= this.lastCheck) {
                        this.bpm.Value = bpm;
                        this.lastCheck = measured;
                    } else if (measured <= this.lastCheck) {
                        this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
                    }
                }
            );
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
                this.lastCheck = data.isset('measured_at', 0);
                this.bpm.Value = data.isset('data', {}).isset('heart_rate', 0);
            };
        }

        /**
         * simple helper to send ajax requests and receive data which gets passed through a callback
         * @param url the url to get data from
         * @param callback callback when data was received
         * @private
         */
        private ajaxHelper(url: string, callback: (any) => void): void {

            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Fetching;

            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            if (this.config.heartRate.type.Value == FeedType.JSON) {
                request.setRequestHeader('Accept', 'application/json');
            }
            request.onreadystatechange = () => {
                if (request.readyState != 4) {
                    this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
                    return;
                }

                callback(JSON.parse(request.responseText));
            }
            request.send(null);
        }
    }
}