namespace Freakylay.Internal.Config {
    import EventProperty = Freakylay.Internal.EventProperty;

    /**
     * look config file
     * determines what element should be visible and where on screen
     */
    export class Looks implements IConfigable {
        public shortModifierNames: EventProperty<boolean> = new EventProperty<boolean>();
        public showPreviousKey: EventProperty<boolean> = new EventProperty<boolean>();
        public showMissCounter: EventProperty<boolean> = new EventProperty<boolean>();
        public showBpm: EventProperty<boolean> = new EventProperty<boolean>();
        public showBlockSpeed: EventProperty<boolean> = new EventProperty<boolean>();
        public showCombo: EventProperty<boolean> = new EventProperty<boolean>();
        public songInfoOnRightSide: EventProperty<boolean> = new EventProperty<boolean>();
        public counterSectionOnTop: EventProperty<boolean> = new EventProperty<boolean>();
        public modifiersOnRightSide: EventProperty<boolean> = new EventProperty<boolean>();
        public compareWithPreviousScore: EventProperty<number> = new EventProperty<number>();
        public hideFullComboModifier: EventProperty<boolean> = new EventProperty<boolean>();
        public timeCircleLikeOtherCircles: EventProperty<boolean> = new EventProperty<boolean>();
        public songInfoOnTopSide: EventProperty<boolean> = new EventProperty<boolean>();
        public hideDefaultDifficultyOnCustomDifficulty: EventProperty<boolean> = new EventProperty<boolean>();
        public hideAllModifiers: EventProperty<boolean> = new EventProperty<boolean>();
        public hideCounterSection: EventProperty<boolean> = new EventProperty<boolean>();
        public hideSongInfo: EventProperty<boolean> = new EventProperty<boolean>();
        // if true, speed is displayed as +50% or -50%
        // if false then it's basically the percent of speed where 100% is normal, everything lower than 100% is slower and everything higher is faster
        public speedDisplayRelative: EventProperty<boolean> = new EventProperty<boolean>();
        public showRanked: EventProperty<boolean> = new EventProperty<boolean>();
        public showStars: EventProperty<boolean> = new EventProperty<boolean>();
        public useMapColorForBackgroundColor: EventProperty<number> = new EventProperty<number>();
        public useMapColorForTextColor: EventProperty<number> = new EventProperty<number>();
        public showAccuracyRank: EventProperty<boolean> = new EventProperty<boolean>();

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: any): void {
            this.shortModifierNames.Value = data.isset('a', this.shortModifierNames.Value);
            this.showPreviousKey.Value = data.isset('b', this.showPreviousKey.Value);
            this.showMissCounter.Value = data.isset('c', this.showMissCounter.Value);
            this.showBpm.Value = data.isset('d', this.showBpm.Value);
            this.showBlockSpeed.Value = data.isset('e', this.showBlockSpeed.Value);
            this.showCombo.Value = data.isset('f', this.showCombo.Value);
            this.songInfoOnRightSide.Value = data.isset('g', this.songInfoOnRightSide.Value);
            this.counterSectionOnTop.Value = data.isset('h', this.counterSectionOnTop.Value);
            this.modifiersOnRightSide.Value = data.isset('i', this.modifiersOnRightSide.Value);
            this.compareWithPreviousScore.Value = data.isset('j', this.compareWithPreviousScore.Value);
            this.hideFullComboModifier.Value = data.isset('k', this.hideFullComboModifier.Value);
            this.timeCircleLikeOtherCircles.Value = data.isset('l', this.timeCircleLikeOtherCircles.Value);
            this.songInfoOnTopSide.Value = data.isset('m', this.songInfoOnTopSide.Value);
            this.hideDefaultDifficultyOnCustomDifficulty.Value = data.isset('n', this.hideDefaultDifficultyOnCustomDifficulty.Value);
            this.hideAllModifiers.Value = data.isset('o', this.hideAllModifiers.Value);
            this.hideCounterSection.Value = data.isset('p', this.hideCounterSection.Value);
            this.hideSongInfo.Value = data.isset('q', this.hideSongInfo.Value);
            this.speedDisplayRelative.Value = data.isset('r', this.speedDisplayRelative.Value);
            this.showRanked.Value = data.isset('s', this.showRanked.Value);
            this.showStars.Value = data.isset('t', this.showStars.Value);
            this.useMapColorForBackgroundColor.Value = data.isset('u', this.useMapColorForBackgroundColor.Value);
            this.useMapColorForTextColor.Value = data.isset('v', this.useMapColorForTextColor.Value);
            this.showAccuracyRank.Value = data.isset('w', this.showAccuracyRank.Value);
        }

        /**
         * saves config data from an json object
         */
        save(): any {
            return {
                a: this.shortModifierNames.Value,
                b: this.showPreviousKey.Value,
                c: this.showMissCounter.Value,
                d: this.showBpm.Value,
                e: this.showBlockSpeed.Value,
                f: this.showCombo.Value,
                g: this.songInfoOnRightSide.Value,
                h: this.counterSectionOnTop.Value,
                i: this.modifiersOnRightSide.Value,
                j: this.compareWithPreviousScore.Value,
                k: this.hideFullComboModifier.Value,
                l: this.timeCircleLikeOtherCircles.Value,
                m: this.songInfoOnTopSide.Value,
                n: this.hideDefaultDifficultyOnCustomDifficulty.Value,
                o: this.hideAllModifiers.Value,
                p: this.hideCounterSection.Value,
                q: this.hideSongInfo.Value,
                r: this.speedDisplayRelative.Value,
                s: this.showRanked.Value,
                t: this.showStars.Value,
                u: this.useMapColorForBackgroundColor.Value,
                v: this.useMapColorForTextColor.Value,
                w: this.showAccuracyRank.Value
            };
        }
    }
}