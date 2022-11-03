///<reference path="../../Internal/EventProperty.ts"/>
namespace Freakylay.DataTransfer.Pulsoid {

    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * Pulsoid class to get heart rate info
     * I'm so sorry to bypass CORS with this little hack found in the get*Date functions, but I don't know how to get CORS done via a local running script
     */
    export class Pulsoid {

        public static MaxStaticBpm: number = 210;

        private url: string;
        private lastCheck: Date;
        private type: FeedType = FeedType.Disabled;
        private currentState: ConnectionState = ConnectionState.Ready;
        private timeout: number;

        public maxBpm: EventProperty<number>;
        public bpm: EventProperty<number>;

        constructor() {
            this.bpm = new EventProperty<number>(0);
            this.maxBpm = new EventProperty<number>(Pulsoid.MaxStaticBpm);
            this.url = '';
        }

        /**
         * returns true if type and url is set up, otherwise false
         */
        get isInitialized(): boolean {
            return this.type != FeedType.Disabled && this.url.length > 0;
        }

        /**
         * returns true if url (or token) is valid based on feed type
         */
        get isValid(): boolean {
            switch (this.type) {
                case Freakylay.DataTransfer.Pulsoid.FeedType.Disabled:
                    return false;
                case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                    return this.url.toLowerCase().startsWith('http');
                case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                    return true;
                default:
                    return false;
            }
        }

        /**
         * sets the url and will start data gathering, will do nothing if type is not set up yet
         * @param url new url or token to use
         */
        public setUrl(url: string): void {
            if (this.type == FeedType.Disabled) {
                return;
            }

            this.url = url.trim().replace(/ /g, '');

            if (this.url == '') {
                this.sendEvent(0);
                return;
            }

            if (this.currentState == ConnectionState.Error) {
                this.currentState = ConnectionState.Ready;
                this.start();
            }
        }

        /**
         * starts data gathering
         */
        public start(): void {
            if (!this.isValid) {
                return;
            }

            this.lastCheck = new Date();
            this.timeout = window.setInterval(() => {
                if (this.currentState == ConnectionState.Ready) {
                    this.pulsoidData();
                } else if (this.currentState == ConnectionState.Error) {
                    console.log('unable to fetch pulsoid data');
                    window.clearTimeout(this.timeout);
                }
            }, 1000);
        }

        /**
         * sets values to event properties to trigger its callback's
         * @param bpm new heart rate number - 0 means not connected or error
         * @private
         */
        private sendEvent(bpm: number): void {
            this.bpm.Value = bpm;
            this.maxBpm.Value = Math.max(this.maxBpm.Value, bpm);
        }

        /**
         * general data gather, will use the correct method based on feed type
         * @private
         */
        private pulsoidData(): void {
            if (!this.isInitialized) {
                return;
            }

            switch (this.type) {
                case Freakylay.DataTransfer.Pulsoid.FeedType.Disabled:
                    this.sendEvent(0);
                    return;
                case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                    this.getJsonData();
                    return;
                case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                    this.getTokenData();
                    return;
            }
        }

        /**
         * gets Pulsoid data based on JSON feed type
         * @private
         */
        private getJsonData(): void {
            this.ajaxHelper(
                'http://u.unskilledfreak.zone/overlay/freakylay/pulsoid.php?pType=JSON&pFeed=' + this.url,
                (data: string) => {
                    let measured = new Date(data.isset('measured_at', (new Date()).toString()));
                    let bpm = parseInt(data.isset('bpm', '0'));

                    if (measured >= this.lastCheck) {
                        this.sendEvent(bpm);
                        this.lastCheck = measured;
                    }
                }
            );
        }

        /**
         * gets Pulsoid data based on token feed type
         * @private
         */
        private getTokenData(): void {
            this.ajaxHelper(
                'http://u.unskilledfreak.zone/overlay/freakylay/3.0.0_test/pulsoid.php?pType=Token&pFeed=' + this.url,
                (data: any) => {
                    let measured = new Date(data.isset('measured_at', (new Date()).toString()));
                    let heartRate = data.isset('data', {}).isset('heart_rate', 0);

                    if (measured >= this.lastCheck) {
                        this.sendEvent(heartRate);
                        this.lastCheck = measured;
                    }
                }
            );
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
            if (this.type == FeedType.JSON) {
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