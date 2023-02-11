namespace Freakylay.DataTransfer.HeartRate {
    import Config = Freakylay.Internal.Config.Config;
    import Logger = Freakylay.Internal.Logger;
    import EventProperty = Freakylay.Internal.EventProperty;

    export abstract class AbstractConnector {
        protected readonly config: Config;
        protected readonly logger: Logger;
        protected readonly connectionState: EventProperty<ConnectionState>;
        protected readonly internalMaxBpm: EventProperty<number>;
        public readonly bpm: EventProperty<number>;

        protected constructor(config: Config, loggerName: string, connectionState: EventProperty<ConnectionState>) {
            this.config = config;
            this.logger = new Logger('connector ' + loggerName);
            this.connectionState = connectionState;
            this.bpm = new EventProperty<number>(0);
        }

        /**
         * starts data gathering
         */
        public abstract start(): void;

        /**
         * stops data gathering
         */
        public abstract stop(): void;
    }
}