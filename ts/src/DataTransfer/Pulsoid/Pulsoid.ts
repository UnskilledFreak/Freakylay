///<reference path="../../Internal/EventProperty.ts"/>
///<reference path="../WebSocket/WebSocketConnection.ts"/>
namespace Freakylay.DataTransfer.Pulsoid {

    import EventProperty = Freakylay.Internal.EventProperty;
    import Config = Freakylay.Internal.Config.Config;
    import Logger = Freakylay.Internal.Logger;

    /**
     * Pulsoid class to get heart rate info
     */
    export class Pulsoid {

        private logger: Logger;
        private lastCheck: number;
        private currentState: ConnectionState = ConnectionState.Ready;
        private timeout: number;
        private tokenSocket: WebSocket;
        private config: Config;
        private internalMaxBpm: number;

        public maxBpm: EventProperty<number>;
        public bpm: EventProperty<number>;
        public connectionState: EventProperty<ConnectionState>;

        constructor(config: Config) {
            this.logger = new Logger('Pulsoid')
            this.config = config;
            this.bpm = new EventProperty<number>(0);
            this.maxBpm = new EventProperty<number>(this.config.pulsoid.maxStaticBpm.Value);
            this.connectionState = new EventProperty<ConnectionState>(ConnectionState.NotConnected);
            this.internalMaxBpm = 0;
        }

        /**
         * returns true if type and url is set up, otherwise false
         */
        get isInitialized(): boolean {
            return this.config.pulsoid.type.Value != FeedType.Disabled && this.config.pulsoid.tokenOrUrl.Value.length > 0;
        }

        /**
         * returns true if url (or token) is valid based on feed type
         */
        get isValid(): boolean {
            switch (this.config.pulsoid.type.Value) {
                case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                    return this.config.pulsoid.tokenOrUrl.Value.toLowerCase().startsWith('http');
                case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                    return this.config.pulsoid.tokenOrUrl.Value.length == 36;
                default:
                    return false;
            }
        }

        /**
         * starts data gathering
         */
        public start(): void {
            this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.NotConnected;

            // internal watch - this is ugly
            window.setInterval(() => {
                if (!this.isInitialized || !this.isValid) {
                    return;
                }
                switch (this.connectionState.Value) {
                    case Freakylay.DataTransfer.Pulsoid.ConnectionState.Error:
                    case Freakylay.DataTransfer.Pulsoid.ConnectionState.NotConnected:
                        this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Ready;
                        // try connecting
                        switch (this.config.pulsoid.type.Value) {
                            case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                                // this must only get executed when there is not already a connection
                                if (!(this.tokenSocket instanceof window.WebSocket)) {
                                    this.getTokenData();
                                }
                                return;
                            case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                                // this needs to be in a loop itself
                                if (this.lastCheck == 0) {
                                    return;
                                }
                                this.lastCheck = 0;
                                this.timeout = window.setInterval(() => {
                                    this.getJsonData();
                                    if (this.currentState == ConnectionState.Error) {
                                        this.connectionState.Value = ConnectionState.NotConnected;
                                        this.stop();
                                    }
                                }, 750);
                                return;
                            case Freakylay.DataTransfer.Pulsoid.FeedType.Disabled:
                                this.sendEvent(0);
                                return;
                        }
                        return;
                    case Freakylay.DataTransfer.Pulsoid.ConnectionState.Fetching:
                    case Freakylay.DataTransfer.Pulsoid.ConnectionState.Ready:
                        // nothing to do
                        return;
                }
            }, 10000);
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
         * sets values to event properties to trigger its callback's
         * @param bpm new heart rate number - 0 means not connected or error
         * @private
         */
        private sendEvent(bpm: number): void {
            this.internalMaxBpm = Math.max(this.internalMaxBpm, bpm);
            this.bpm.Value = bpm;
            this.maxBpm.Value = this.config.pulsoid.useDynamicBpm.Value
                ? this.internalMaxBpm
                : this.config.pulsoid.maxStaticBpm.Value;
        }

        /**
         * gets Pulsoid data based on JSON feed type
         * will get removed in near future
         * I'm so sorry to bypass old JSON integration CORS with this little hack found in the get*Date functions, but I don't know how to get CORS done via a local running script
         * @private
         */
        private getJsonData(): void {
            this.ajaxHelper(
                'http://u.unskilledfreak.zone/overlay/freakylay/pulsoid.php?pType=JSON&pFeed=' + this.config.pulsoid.tokenOrUrl.Value,
                (data: string) => {
                    this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Fetching;
                    let measured = data.isset('measured_at', 0);
                    let bpm = data.isset('bpm', 0);

                    if (measured >= this.lastCheck) {
                        this.sendEvent(bpm);
                        this.lastCheck = measured;
                    } else if (measured <= this.lastCheck) {
                        this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Error;
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
            this.tokenSocket = new window.WebSocket('wss://dev.pulsoid.net/api/v1/data/real_time?access_token=' + this.config.pulsoid.tokenOrUrl.Value);
            this.tokenSocket.onopen = () => {
                this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Ready;
            };
            this.tokenSocket.onerror = () => {
                this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Error;
                this.stop();
            };
            this.tokenSocket.onclose = () => {
                this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.NotConnected;
                this.stop();
            };
            this.tokenSocket.onmessage = (e) => {
                this.connectionState.Value = Freakylay.DataTransfer.Pulsoid.ConnectionState.Fetching;
                let data = JSON.parse(e.data);
                this.lastCheck = data.isset('measured_at', 0);
                this.sendEvent(data.isset('data', {}).isset('heart_rate', 0));
            }
        }

        /**
         * simple helper to send ajax requests and receive data which gets passed through a callback
         * @param url the url to get data from
         * @param callback callback when data was received
         * @private
         */
        private ajaxHelper(url: string, callback: (any) => void): void {

            this.currentState = ConnectionState.Fetching;

            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            if (this.config.pulsoid.type.Value == FeedType.JSON) {
                request.setRequestHeader('Accept', 'application/json');
            }
            request.onreadystatechange = () => {
                if (request.readyState != 4) {
                    this.currentState = ConnectionState.Error;
                    return;
                }

                callback(JSON.parse(request.responseText));

                this.currentState = ConnectionState.Ready;
            }
            request.send(null);
        }
    }
}