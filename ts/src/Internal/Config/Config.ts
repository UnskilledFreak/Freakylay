///<reference path="../Color.ts"/>
///<reference path="../../DataTransfer/HeartRate/FeedType.ts"/>
namespace Freakylay.Internal.Config {

    import Color = Freakylay.Internal.Color;
    import FeedType = Freakylay.DataTransfer.HeartRate.FeedType;

    /**
     * main config
     */
    export class Config implements IConfigable {
        public colors: Colors;
        public looks: Looks;
        public heartRate: HeartRate;
        public game: EventProperty<string>;
        public connection: EventProperty<string>;
        public connectionSetting: {};

        private oldConfigWasUsed: boolean;
        private urlSearchParams: URLSearchParams;
        private randomBackground: Color = Color.random(.7);
        private randomText: Color = this.randomBackground.getHighLowComplementary(1);
        private shouldOpenOptionsAfterLoad: boolean = false;

        get shouldOpenOptionPanelAfterLoad(): boolean {
            return this.shouldOpenOptionsAfterLoad;
        }

        get wasOldConfigUsed(): boolean {
            return this.oldConfigWasUsed;
        }

        constructor() {
            this.game = new EventProperty<string>('');
            this.connection = new EventProperty<string>('');
            this.colors = new Colors();
            this.looks = new Looks();
            this.heartRate = new HeartRate();
            this.connectionSetting = {};
            this.oldConfigWasUsed = false;

            // parse config from window search
            this.urlSearchParams = new URLSearchParams(location.search);
            this.shouldOpenOptionsAfterLoad = location.search.length == 0;

            this.useOldConfigAsDefault();
            this.useNewConfigIfExists();
        }

        /**
         * helper to get values from url
         * @param key
         * @param defaultValue
         * @private
         */
        private getConfig<T>(key: string, defaultValue: T): T {
            if (!this.oldConfigWasUsed && key != 'w') {
                this.oldConfigWasUsed = this.urlSearchParams.has(key)
            }

            return  this.urlSearchParams.has(key) ? (this.urlSearchParams.get(key) as unknown) as T : defaultValue;
        }

        /**
         * fallback for old saved configs but is also used to default all elements
         * @private
         */
        private useOldConfigAsDefault(): void {
            this.colors.background.Value = this.getConfig('a', this.randomBackground);
            this.colors.text.Value = this.getConfig('b', this.randomText);
            this.looks.shortModifierNames.Value = this.getConfig('c', false);
            this.looks.showPreviousKey.Value = this.getConfig('d', false);
            this.looks.showMissCounter.Value = this.getConfig('e', true);
            this.looks.showBpm.Value = this.getConfig('f', true);
            this.looks.showBlockSpeed.Value = this.getConfig('g', true);
            this.looks.showCombo.Value = this.getConfig('h', true);
            this.looks.songInfoOnRightSide.Value = this.getConfig('i', false);
            this.looks.counterSectionOnTop.Value = this.getConfig('j', false);
            this.looks.modifiersOnRightSide.Value = this.getConfig('k', false);
            this.looks.compareWithPreviousScore.Value = this.getConfig('l', 1);
            this.looks.hideFullComboModifier.Value = !this.getConfig('m', true);
            this.looks.timeCircleLikeOtherCircles.Value = this.getConfig('n', false);
            this.looks.songInfoOnTopSide.Value = this.getConfig('o', false);
            this.looks.hideDefaultDifficultyOnCustomDifficulty.Value = this.getConfig('p', false);
            this.looks.hideAllModifiers.Value = this.getConfig('q', false);

            let heartRateFeed = this.getConfig('r', '');
            if (heartRateFeed != '') {
                this.heartRate.type.Value = FeedType.JSON;
                this.heartRate.tokenOrUrl.Value = heartRateFeed;
            }

            //this.getConfig('s', false);
            this.looks.hideCounterSection.Value = this.getConfig('t', false);
            this.looks.hideSongInfo.Value = this.getConfig('u', false);

            let feedTypeData = this.getConfig('v', '').toLowerCase();
            if (feedTypeData != '') {
                switch (feedTypeData) {
                    case 'token':
                        this.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType.Token;
                        break;
                    case 'json':
                        this.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType.JSON;
                        break;
                    case 'dummy':
                        this.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType.Dummy;
                        break;
                    case 'hyperate':
                        this.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType.HypeRate;
                        break;
                    default:
                        this.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType.Disabled;
                        break;
                }
            }

            if (!this.shouldOpenOptionPanelAfterLoad) {
                this.shouldOpenOptionsAfterLoad = this.urlSearchParams.has('options');
            }

            // defaults for new fields
            this.looks.speedDisplayRelative.Value = true;
            this.looks.showRanked.Value = true;
            this.looks.showStars.Value = true;
            this.looks.useMapColorForBackgroundColor.Value = 0;
            this.looks.useMapColorForTextColor.Value = 0;
            this.looks.showAccuracyRank.Value = true;
            this.looks.borderRadius.Value = 10;
            this.looks.animateScore.Value = true;
        }

        /**
         * new config setting style
         * @private
         */
        private useNewConfigIfExists(): void {
            if (!this.urlSearchParams.has('w')) {
                return;
            }

            let jsonConfData = '{}';
            let confData = this.getConfig('w', '');

            if (confData.length > 0) {
                jsonConfData = atob('ey' + confData)
            }

            this.load(JSON.parse(jsonConfData));
        }

        /**
         * generates an url safe config string
         */
        public getConfigString(): string {
            return btoa(JSON.stringify(this.save())).substring(2);
        }

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: {}) {
            this.game.Value = data.isset('a', '');
            this.connection.Value = data.isset('b', '');
            this.colors.load(data.isset('c', {}));
            this.looks.load(data.isset('d', {}));
            this.heartRate.load(data.isset('e', {}));
            this.connectionSetting = data.isset('f', {});
        }

        /**
         * saves config data to an json object
         */
        save(): {} {
            return {
                a: this.game.Value,
                b: this.connection.Value,
                c: this.colors.save(),
                d: this.looks.save(),
                e: this.heartRate.save(),
                f: this.connectionSetting
            };
        }
    }
}