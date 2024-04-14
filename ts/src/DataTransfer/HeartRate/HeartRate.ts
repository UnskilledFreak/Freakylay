///<reference path="../../Internal/EventProperty.ts"/>
///<reference path="Connector/NullBeat.ts"/>
///<reference path="Connector/Pulsoid.ts"/>
///<reference path="Connector/Dummy.ts"/>
///<reference path="Connector/HypeRate.ts"/>
namespace Freakylay.DataTransfer.HeartRate {
    import Config = Freakylay.Internal.Config.Config;
    import Logger = Freakylay.Internal.Logger;
    import EventProperty = Freakylay.Internal.EventProperty;
    import NullBeat = Freakylay.DataTransfer.HeartRate.Connector.NullBeat;
    import Pulsoid = Freakylay.DataTransfer.HeartRate.Connector.Pulsoid;
    import Dummy = Freakylay.DataTransfer.HeartRate.Connector.Dummy;
    import HypeRate = Freakylay.DataTransfer.HeartRate.Connector.HypeRate;

    export class HeartRate {
        private readonly config: Config;

        private logger: Logger;
        private internalMaxBpm: number;
        private connector: AbstractConnector;

        public bpm: EventProperty<number>;
        public maxBpm: EventProperty<number>;
        public connectionState: EventProperty<ConnectionState>;

        /**
         * returns true if type and url is set up, otherwise false
         */
        get isInitialized(): boolean {
            if (this.config.heartRate.type.Value == Freakylay.DataTransfer.HeartRate.FeedType.Dummy) {
                return true;
            }
            return this.config.heartRate.type.Value != Freakylay.DataTransfer.HeartRate.FeedType.Disabled && this.config.heartRate.tokenOrUrl.Value.length > 0;
        }

        /**
         * returns true if url (or token) is valid based on feed type
         */
        get isValid(): boolean {
            switch (this.config.heartRate.type.Value) {
                case Freakylay.DataTransfer.HeartRate.FeedType.JSON:
                    return this.config.heartRate.tokenOrUrl.Value.toLowerCase().startsWith('http');
                case Freakylay.DataTransfer.HeartRate.FeedType.Token:
                    return this.config.heartRate.tokenOrUrl.Value.length == 36;
                case Freakylay.DataTransfer.HeartRate.FeedType.HypeRate:
                    return this.config.heartRate.tokenOrUrl.Value.length > 0;
                case Freakylay.DataTransfer.HeartRate.FeedType.Dummy:
                    return true;
                default:
                    return false;
            }
        }

        /**
         * abstract class to provide generalized heart rate data for the overlay
         * @param config
         * @protected
         */
        constructor(config: Config) {
            this.logger = new Logger('HeartRateManager');
            this.config = config;
            this.maxBpm = new EventProperty<number>(this.config.heartRate.maxStaticBpm.Value);
            this.bpm = new EventProperty<number>(0);
            this.connectionState = new EventProperty<ConnectionState>(ConnectionState.NotConnected);
            this.internalMaxBpm = 0;
        }

        /**
         * registers a new heart rate connector based on type stored in config
         */
        public registerNewType() {
            if (this.connector != null) {
                this.connector.bpm.unregister();
            }
            switch (this.config.heartRate.type.Value) {
                case Freakylay.DataTransfer.HeartRate.FeedType.Disabled:
                    this.connector = new NullBeat(this.config, this.connectionState);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Token:
                case Freakylay.DataTransfer.HeartRate.FeedType.JSON:
                    this.connector = new Pulsoid(this.config, this.connectionState);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Dummy:
                    this.connector = new Dummy(this.config, this.connectionState);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.HypeRate:
                    this.connector = new HypeRate(this.config, this.connectionState);
                    break;
            }

            this.connector.bpm.register((bpm) => {
                this.sendEvent(bpm);
            });

            this.connector.start();
        }

        /**
         * starts data gathering
         */
        public start(): void {
            if (this.isValid) {
                this.connector.start();
                return;
            }

            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.Error;
        }

        /**
         * stops the connection if any
         */
        public stop(): void {
            this.connector.stop();
            this.sendEvent(0);
        }

        /**
         * sets values to event properties to trigger its callback's
         * @param bpm new heart rate number - 0 means not connected or error
         * @private
         */
        protected sendEvent(bpm: number): void {
            this.internalMaxBpm = Math.max(this.internalMaxBpm, bpm);
            this.bpm.Value = bpm;
            this.maxBpm.Value = this.config.heartRate.useDynamicBpm.Value
                ? this.internalMaxBpm
                : this.config.heartRate.maxStaticBpm.Value;
        }
    }
}