namespace Freakylay.Internal.Config {
    import EventProperty = Freakylay.Internal.EventProperty;
    import FeedType = Freakylay.DataTransfer.Pulsoid.FeedType;

    /**
     * main Pulsoid config file
     */
    export class Pulsoid implements IConfigable {
        public maxStaticBpm: EventProperty<number> = new EventProperty<number>(220);
        public useDynamicBpm: EventProperty<boolean> = new EventProperty<boolean>(true);
        public type: EventProperty<FeedType> = new EventProperty<FeedType>(FeedType.Disabled);
        public tokenOrUrl: EventProperty<string> = new EventProperty<string>('');

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: {}): void {
            this.useDynamicBpm.Value = data.isset('a', this.useDynamicBpm.Value);
            this.maxStaticBpm.Value = data.isset('b', this.maxStaticBpm.Value);
            this.type.Value = data.isset('c', this.type.Value);
            this.tokenOrUrl.Value = data.isset('d', this.tokenOrUrl.Value);
        }

        /**
         * saves config data from an json object
         */
        save(): {} {
            return {
                a: this.useDynamicBpm.Value,
                b: this.maxStaticBpm.Value,
                c: this.type.Value,
                d: this.tokenOrUrl.Value
            };
        }
    }
}