///<reference path="../Color.ts"/>
///<reference path="../../DataTransfer/Pulsoid/FeedType.ts"/>
namespace Freakylay.Internal.Config {

    import Color = Freakylay.Internal.Color;
    import FeedType = Freakylay.DataTransfer.Pulsoid.FeedType;

    /**
     * main config
     */
    export class Config implements IConfigable {
        public colors: Colors;
        public looks: Looks;
        public pulsoid: Pulsoid;

        private selectedGame: string;
        private selectedConnection: string;
        private urlSearchParams: URLSearchParams;
        private randomBackground: Color = Color.random(.7);
        private randomText: Color = this.randomBackground.getHighLowComplementary(1);
        private shouldOpenOptionsAfterLoad: boolean = false;

        get game(): string {
            return this.selectedGame;
        }

        get connection(): string {
            return this.selectedConnection;
        }

        get shouldOpenOptionPanelAfterLoad(): boolean {
            return this.shouldOpenOptionsAfterLoad;
        }

        constructor() {
            this.selectedGame = '';
            this.selectedConnection = '';
            this.colors = new Colors();
            this.looks = new Looks();
            this.pulsoid = new Pulsoid();

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
            return this.urlSearchParams.has(key) ? (this.urlSearchParams.get(key) as unknown) as T : defaultValue;
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

            let pulsoidFeed = this.getConfig('r', '');
            if (pulsoidFeed != '') {
                this.pulsoid.type.Value = FeedType.JSON;
                this.pulsoid.tokenOrUrl.Value = pulsoidFeed;
            }

            //this.getConfig('s', false);
            this.looks.hideCounterSection.Value = this.getConfig('t', false);
            this.looks.hideSongInfo.Value = this.getConfig('u', false);

            let feedTypeData = this.getConfig('v', '').toLowerCase();
            if (feedTypeData != '') {
                switch (feedTypeData) {
                    case 'token':
                        this.pulsoid.type.Value = FeedType.Token;
                        break;
                    case 'json':
                        this.pulsoid.type.Value = FeedType.JSON;
                        break;
                    default:
                        if (pulsoidFeed == '') {
                            this.pulsoid.type.Value = FeedType.Disabled;
                        }
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
        }

        /**
         * new config setting style
         * @private
         */
        private useNewConfigIfExists(): void {
            if (!this.urlSearchParams.has('w')) {
                return;
            }

            this.load(JSON.parse(atob(this.getConfig('w', '{}'))));
        }

        /**
         * generates an url safe config string
         */
        public getConfigString(): string {
            return btoa(JSON.stringify(this.save()));
        }

        /**
         * loads config data from an json object
         * @param data
         */
        load(data: any) {
            this.selectedGame = data.a;
            this.selectedConnection = data.b;
            this.colors.load(data.c);
            this.looks.load(data.d);
            this.pulsoid.load(data.e);
        }

        /**
         * saves config data to an json object
         */
        save(): any {
            return {
                a: this.selectedGame,
                b: this.selectedConnection,
                c: this.colors.save(),
                d: this.looks.save(),
                e: this.pulsoid.save()
            };
        }
    }
}