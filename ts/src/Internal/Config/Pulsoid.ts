namespace Freakylay.Internal.Config {
    import EventProperty = Freakylay.Internal.EventProperty;
    import FeedType = Freakylay.DataTransfer.Pulsoid.FeedType;

    /**
     * main pulsoid config file
     */
    export class Pulsoid implements IConfigable {
        public useDynamicBpm: EventProperty<boolean> = new EventProperty<boolean>(true);
        public maxStaticBpm: EventProperty<number> = new EventProperty<number>(210);
        public minStaticBpm: EventProperty<number> = new EventProperty<number>(60);
        public type: EventProperty<FeedType> = new EventProperty<FeedType>(FeedType.Disabled);
        public tokenOrUrl: EventProperty<string> = new EventProperty<string>('');

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: any): void {
            this.useDynamicBpm.Value = data.isset('a', this.useDynamicBpm.Value);
            this.maxStaticBpm.Value = data.isset('b', this.maxStaticBpm.Value);
            this.minStaticBpm.Value = data.isset('c', this.minStaticBpm.Value);
            this.type.Value = data.isset('d', this.type.Value);
            this.tokenOrUrl.Value = data.isset('e', this.tokenOrUrl.Value);
        }

        /**
         * saves config data from an json object
         */
        save(): any {
            return {
                a: this.useDynamicBpm.Value,
                b: this.maxStaticBpm.Value,
                c: this.minStaticBpm.Value,
                d: this.type.Value,
                e: this.tokenOrUrl.Value
            };
        }
    }
}