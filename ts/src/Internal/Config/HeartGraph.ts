namespace Freakylay.Internal.Config {
    export class HeartGraph implements IConfigable {
        public enabled: EventProperty<boolean> = new EventProperty<boolean>(false);
        public anchor: EventProperty<number> = new EventProperty<number>(4);
        public offsetX: EventProperty<number> = new EventProperty<number>(window.outerWidth / 2);
        public offsetY: EventProperty<number> = new EventProperty<number>(300);
        public disableCircleBar: EventProperty<boolean> = new EventProperty<boolean>(false);
        public eventsToShow: EventProperty<number> = new EventProperty<number>(120);
        public displayNumbers: EventProperty<boolean> = new EventProperty<boolean>(true);
        public useBackground: EventProperty<boolean> = new EventProperty<boolean>(true);
        public width: EventProperty<number> = new EventProperty<number>(200);
        public height: EventProperty<number> = new EventProperty<number>(80);
        public useBackgroundColorForStroke: EventProperty<boolean> = new EventProperty<boolean>(false);
        public smallFontSize: EventProperty<number> = new EventProperty<number>(12);
        public bigFontSize: EventProperty<number> = new EventProperty<number>(20);

        public static MinTimespan = 10;
        public static MaxTimespan = 600;
        public static MinGraphSize = 50;
        public static MaxFontSize = 72;

        public load(data: {}): void {
            this.enabled.Value = data.isset('a', this.enabled.Value);
            this.anchor.Value = data.isset('b', this.anchor.Value).clamp(0, 4);
            this.offsetX.Value = data.isset('c', this.offsetX.Value).clamp(0, window.outerWidth);
            this.offsetY.Value = data.isset('d', this.offsetY.Value).clamp(0, window.outerHeight);
            this.disableCircleBar.Value = data.isset('e', this.disableCircleBar.Value);
            this.eventsToShow.Value = data.isset('f', this.eventsToShow.Value).clamp(Freakylay.Internal.Config.HeartGraph.MinTimespan, Freakylay.Internal.Config.HeartGraph.MaxTimespan);
            this.displayNumbers.Value = data.isset('g', this.displayNumbers.Value);
            this.useBackground.Value = data.isset('h', this.useBackground.Value);
            this.width.Value = data.isset('i', this.width.Value).clamp(Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerWidth);
            this.height.Value = data.isset('j', this.height.Value).clamp(Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerHeight);
            this.useBackgroundColorForStroke.Value = data.isset('k', this.useBackgroundColorForStroke.Value);
            this.smallFontSize.Value = data.isset('l', this.smallFontSize.Value);
            this.bigFontSize.Value = data.isset('m', this.bigFontSize.Value);
        }

        public save(): {} {
            return {
                a: this.enabled.Value,
                b: this.anchor.Value,
                c: this.offsetX.Value,
                d: this.offsetY.Value,
                e: this.disableCircleBar.Value,
                f: this.eventsToShow.Value,
                g: this.displayNumbers.Value,
                h: this.useBackground.Value,
                i: this.width.Value,
                j: this.height.Value,
                k: this.useBackgroundColorForStroke.Value,
                l: this.smallFontSize.Value,
                m: this.bigFontSize.Value
            };
        }
    }
}