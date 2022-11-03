namespace Freakylay.Internal.Config {
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * config color file
     */
    export class Colors implements IConfigable {
        public text: EventProperty<Color> = new EventProperty<Color>();
        public background: EventProperty<Color> = new EventProperty<Color>();
        // todo :: those 2 will declare if the overlay should start with random colors
        // but on what base? new map? on reload? score? ...
        /*
        public textIsRandom: EventProperty<boolean> = new EventProperty<boolean>(false);
        public backgroundIsRandom: EventProperty<boolean> = new EventProperty<boolean>(false);
        */

        /*
        // todo :: use mapping instead of hard coded letters
        // dynamically loading and saving is not the issue but calling custom functions for some properties is
        // maybe by adding a boolean flag to indicate dynamic save/load or custom
        // but that might lead to unreadable code
        private mapping: [string, EventProperty<any>][] = [
            ['a', this.text],
            ['b', this.background],
            ['c', this.textIsRandom],
            ['d', this.backgroundIsRandom],
        ];
        */

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: any): void {
            this.text.Value = Color.fromUrl(data.isset('a', 'rgba(255, 133, 255, 0.7)'));
            this.background.Value = Color.fromUrl(data.isset('b', '#ffffff'));
            //this.textIsRandom.Value = data.c;
            //this.backgroundIsRandom.Value = data.d;
        }

        /**
         * saves config data from an json object
         */
        save(): any {
            return {
                a: this.text.Value.toCss(),
                b: this.background.Value.toCss(),
                //c: this.textIsRandom.Value,
                //d: this.backgroundIsRandom.Value
            };
        }
    }
}