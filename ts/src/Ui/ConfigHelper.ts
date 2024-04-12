///<reference path="../Internal/EventProperty.ts"/>
///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import Config = Freakylay.Internal.Config.Config;
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;
    import Logger = Freakylay.Internal.Logger;
    import AbstractHeartRate = Freakylay.DataTransfer.HeartRate.HeartRate;
    import ConnectionState = Freakylay.DataTransfer.HeartRate.ConnectionState;
    import BaseGame = Freakylay.Game.BaseGame;
    import BaseConnection = Freakylay.Game.BaseConnection;
    import GameLinkStatus = Freakylay.Game.GameLinkStatus;

    /**
     * helper for config <-> option panel
     * is used as an interface between option panel (UI) and config values
     */
    export class ConfigHelper {
        // generic
        private readonly logger: Logger;
        private readonly config: Config;
        private readonly urlText: HTMLTextAreaElement;
        private readonly isDev: boolean;
        private options: HTMLDivElement;
        private gameConnectionSettingElement: HTMLDivElement;
        private backgroundColorInput: ColorInput;
        private textColorInput: ColorInput;
        private languageListElement: HTMLSelectElement;

        // heart rate
        private heartRate: AbstractHeartRate;
        private heartRateFeedText: HTMLLabelElement;
        private heartRateFeedInput: HTMLInputElement;
        private heartRateHintPulsoid: HTMLDivElement;
        private heartRateHintSession: HTMLDivElement;
        private heartRatePulsoidThanks: HTMLDivElement;
        private heartRateHypeRateThanks: HTMLDivElement;
        private heartRateConnectionState: HTMLSpanElement;

        // game
        private gameList: BaseGame[];
        private gameListElement: HTMLSelectElement;
        private connectionListElement: HTMLSelectElement;
        private applyGameButton: HTMLButtonElement;

        // helper events
        private readonly backgroundImageTest: EventProperty<boolean>;
        public readonly optionsOpen: EventProperty<boolean>;
        public readonly onGameChange: EventProperty<BaseGame>;
        public readonly onGameConnectionChange: EventProperty<BaseConnection>;
        public readonly onConnection: EventProperty<boolean>;
        public readonly onLanguageChange: EventProperty<Freakylay.Ui.Languages>;

        // Localization
        private readonly languageManager: Freakylay.Ui.LanguageManager;

        get fullVersionString(): string {
            let welcomeVersion = this.languageManager.getLocalizedText("welcomeVersion");
            return welcomeVersion["before"] + Overlay.Version + (Overlay.Branch.length > 0 ? ' ' + Overlay.Branch : '') + welcomeVersion["after"];
        }

        constructor(config: Config, heartRate: AbstractHeartRate, gameList: BaseGame[], gameLinkState: EventProperty<GameLinkStatus>, languageManager: LanguageManager, isDev: boolean) {
            this.logger = new Logger('ConfigHelper');
            this.optionsOpen = new EventProperty<boolean>(false);
            this.config = config;
            this.heartRate = heartRate;
            this.gameList = gameList;
            this.isDev = isDev;
            this.languageManager = languageManager;
            this.urlText = document.get<HTMLTextAreaElement>('#urlText');
            this.backgroundImageTest = new EventProperty<boolean>(false);
            this.onGameChange = new EventProperty<BaseGame>();
            this.onGameConnectionChange = new EventProperty<BaseConnection>();
            this.onConnection = new EventProperty<boolean>(false);
            this.onLanguageChange = new EventProperty<Freakylay.Ui.Languages>();

            window.setTimeout(() => {
                // ok this is weird, why do I have to delay that line by 1ms to make it work?
                // it won't work without that delay...
                document.getDiv('copyright').innerText = this.fullVersionString;
            }, 1);
            document.getId<HTMLSpanElement>('welcomeVersion').innerText = this.fullVersionString;
            let languageSelector = document.getId<HTMLSelectElement>('languageList');
            languageSelector.removeChildren();

            Freakylay.Ui.Languages.foreach((value: string) => {
                if (!isNaN(Number(value))) {
                    return;
                }

                languageSelector.append(this.createOptionForSelect(
                    value,
                    Freakylay.Ui.Languages[value],
                    Freakylay.Ui.Languages[value] == this.config.language.Value
                ));

                this.languageManager.refreshLanguage(this.fullVersionString);
            });

            languageSelector.onchange = () => {
                this.onLanguageChange.Value = Freakylay.Ui.Languages[languageSelector.value];
            };

            document.body.ondblclick = () => {
                this.toggleOptionPanel();
            };

            let alphaWarning = document.getDiv('versionWarning');
            if (Overlay.Branch.toLowerCase() != 'release') {
                alphaWarning.display(true);
                alphaWarning.innerText = this.fullVersionString;
            } else {
                alphaWarning.display(false);
            }

            this.languageListElement = document.getId<HTMLSelectElement>('languageList');

            this.gameListElement = document.getId<HTMLSelectElement>('gameList');
            this.connectionListElement = document.getId<HTMLSelectElement>('connectionList');

            // heart rate elements
            this.heartRateFeedText = document.getId<HTMLLabelElement>('heartRateFeedUrlText');
            this.heartRateFeedInput = document.getId<HTMLInputElement>('heartRateFeed');
            this.heartRateHintPulsoid = document.getDiv('heartRateHintPulsoid');
            this.heartRateHintSession = document.getDiv('heartRateHintSession');
            this.heartRateConnectionState = document.getDiv('heartRateConnectionState');
            this.heartRatePulsoidThanks = document.getDiv('pulsoidThanks');
            this.heartRateHypeRateThanks = document.getDiv('hypeRateThanks');

            // build panels
            this.buildGameTab();
            this.buildColorTab();
            this.buildSettingsTab();
            this.buildHeartRateTab();

            // register events
            this.backgroundImageTest.register((enabled: boolean) => {
                document.body.toggleClassByValue(enabled, 'test');
            });

            this.heartRate.connectionState.register((state: ConnectionState) => {
                this.heartRateConnectionState.innerText = this.languageManager.getLocalizedText('heartRateConnectionState')[Freakylay.DataTransfer.HeartRate.ConnectionState[state]];
            });
            this.heartRate.connectionState.trigger();
            this.checkHeartRateFeedType(true);

            this.onLanguageChange.register((language: Freakylay.Ui.Languages) => {
                this.languageManager.import(language);
                this.languageManager.refreshLanguage(this.fullVersionString);

                let new_lang = Object.keys(Freakylay.Ui.Languages)[(<any>Object).values(Freakylay.Ui.Languages).indexOf(language)];
                if (this.config.language.Value != new_lang) {
                    this.config.language.Value = new_lang;
                    this.generateUrlText();
                }
            });

            this.onGameChange.register((game: BaseGame) => {
                if (game == null) {
                    return;
                }
                let connectionNames = this.languageManager.getLocalizedText('connectionList');
                this.connectionListElement.removeChildren();
                this.connectionListElement.append(this.createOptionForSelect('None', connectionNames['None'], true));
                game.getConnections.forEach((connection: BaseConnection) => {
                    let name = connection.getName();
                    this.connectionListElement.append(this.createOptionForSelect(name, connectionNames.hasOwnProperty(name) ? connectionNames['name'] : name, name == this.config.connection.Value));
                });
                this.connectionListElement.inline(true);
                if (this.config.game.Value != game.getName()) {
                    this.config.game.Value = game.getName();
                    this.generateUrlText();
                }
            });

            this.onGameConnectionChange.register((con: BaseConnection, oldCon: BaseConnection) => {
                if (oldCon != null) {
                    oldCon.disconnect();
                    oldCon.onUnregister();
                }

                this.gameConnectionSettingElement.removeChildren();

                if (con == null) {
                    return;
                }

                if (this.config.connection.Value != con.getName()) {
                    this.config.connection.Value = con.getName();
                    this.generateUrlText();
                }

                con.loadConfig(this.config.connectionSetting);

                if (con.supportsCustomIp()) {
                    let input = document.create<HTMLInputElement>('input');
                    input.type = 'text';
                    input.value = con.ip;
                    input.onchange = () => {
                        con.ip = input.value;
                        this.generateUrlText();
                    };
                    let line = document.div();
                    line.addClass('settingsLine');
                    line.append(
                        document.label(this.languageManager.getLocalizedText("connectionIP"), 'customIp'),
                        input
                    );
                    this.gameConnectionSettingElement.append(line);
                }
                if (con.supportsCustomPort()) {
                    let input = document.create<HTMLInputElement>('input');
                    input.type = 'number';
                    input.value = con.port.toString();
                    input.min = '1';
                    input.max = '65535';
                    input.step = '1';
                    input.onchange = () => {
                        con.port = parseInt(input.value);
                        this.generateUrlText();
                    };
                    let line = document.div();
                    line.addClass('settingsLine');
                    line.append(
                        document.label(this.languageManager.getLocalizedText("connectionPort"), 'customPort'),
                        input
                    );
                    this.gameConnectionSettingElement.append(line);
                }

                con.displayConnectionSettings(this.gameConnectionSettingElement, this);
            });

            let gameLinkStatus = document.getDiv('gameLinkStatus');
            gameLinkState.register((newStatus: GameLinkStatus) => {
                let status = this.languageManager.getLocalizedText('gameLinkStatus');
                gameLinkStatus.innerText = status.hasOwnProperty(newStatus.toString()) ? status[newStatus.toString()] : newStatus.toString();
            });

            this.applyGameButton = document.getId<HTMLButtonElement>('connectToGame');
            this.applyGameButton.onclick = () => {
                this.onConnection.Value = true;
            };
        }

        /**
         * will look if config contains valid game and connection data and trys to connect automatically
         */
        public initLoader(): void {
            // search for selected game and connection
            if (this.config.game.Value.length > 0) {
                try {
                    let game = this.gameList.firstOrError(x => x.getName() == this.config.game.Value);
                    this.onGameChange.Value = game;

                    if (this.config.connection.Value.length > 0) {
                        this.onGameConnectionChange.Value = game.getConnections.firstOrError(x => x.getName() == this.config.connection.Value);
                    }
                } catch {
                    // game not found
                }
            }

            // search for selected language and update UI
            if (this.config.language.Value !== null && (<any>Object).keys(Freakylay.Ui.Languages).includes(this.config.language.Value)) {
                this.onLanguageChange.Value = Freakylay.Ui.Languages[this.config.language.Value];
            }
        }

        /**
         * generates url safe string to paste into streaming software/browser sources
         */
        public generateUrlText(): void {
            let url = window.location.origin + window.location.pathname + '?';

            // ignore options field because the overlay will open settings itself without any custom settings
            /*
            if (this.optionsOpen) {
                url += 'options&'
            }
            */

            if (this.onGameConnectionChange.Value != null) {
                this.config.connectionSetting = this.onGameConnectionChange.Value.saveConfig();
            }

            url += 'w=' + this.config.getConfigString();
            url = url.removeLast('?');
            url = url.removeLast('&');

            this.urlText.innerText = url;
        }

        /**
         * shows or hides option panel
         * @public
         */
        public toggleOptionPanel(): void {
            if (!(this.options instanceof HTMLDivElement)) {
                this.options = document.getId('options');
            }

            this.optionsOpen.Value = !this.optionsOpen.Value;
            this.options.toggleClass('show');
        }

        /**
         * generates the color tab
         * @private
         */
        private buildColorTab(): void {
            // color inputs
            this.backgroundColorInput = new ColorInput(this.languageManager, this.languageManager.getLocalizedText('colorBackgroundColor'), 'colorBackgroundColor', this.config.colors.background.Value, (alpha: number) => {
                return alpha > .03 && (alpha < .49 || alpha > .9);
            });
            this.textColorInput = new ColorInput(this.languageManager, this.languageManager.getLocalizedText('colorTextColor'), 'colorTextColor', this.config.colors.text.Value, (alpha: number) => {
                return alpha < .49;
            });

            // register color change events
            this.backgroundColorInput.color.register((color: Color) => {
                this.config.colors.background.Value = color;
            });
            this.textColorInput.color.register((color: Color) => {
                this.config.colors.text.Value = color;
            });

            // create inputs in dom
            this.backgroundColorInput.createInputMenu(document.getDiv('bgColor'));
            this.textColorInput.createInputMenu(document.getDiv('color'));

            // append generate random color buttons
            let colorRandomBackgroundColorButton = document.button('Random background color', (_) => {
                this.backgroundColorInput.color.Value = Color.random(.7);
            });
            let colorRandomTextColorButton = document.button('Random text color', (_) => {
                this.textColorInput.color.Value = Color.random(1);
            });
            (colorRandomBackgroundColorButton as HTMLElement).id = 'colorRandomBackgroundColor';
            (colorRandomTextColorButton as HTMLElement).id = 'colorRandomTextColor';
            this.getTabContentDom('colors').append(
                colorRandomBackgroundColorButton,
                colorRandomTextColorButton,
            );
        }

        /**
         * builds setting tab, all of those are boolean values
         * @private
         */
        private buildSettingsTab(): void {
            let info = document.div();
            let colorInfo = document.div();
            colorInfo.id = 'defaultColorInfoText';
            let defaultColorInfoText = this.languageManager.getLocalizedText("defaultColorInfoText");

            info.id = 'settingsBanner';
            info.textContent = this.languageManager.getLocalizedText('settingsBanner');
            colorInfo.innerText = defaultColorInfoText;

            let look = document.headline(this.languageManager.getLocalizedText('settingsLooks')) as HTMLElement;
            let positions = document.headline(this.languageManager.getLocalizedText('settingsPositions')) as HTMLElement;
            let misc = document.headline(this.languageManager.getLocalizedText('settingsMisc')) as HTMLElement;
            look.id = 'settingsLooks';
            positions.id = 'settingsPositions';
            misc.id = 'settingsMisc';

            this.getTabContentDom('settings').append(
                info,
                look,
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksDisplayShortModifierNames'), 'settingsLooksDisplayShortModifierNames', this.config.looks.shortModifierNames),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowPreviousMapKey'), 'settingsLooksShowPreviousMapKey', this.config.looks.showPreviousKey),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowMissBadHitCounter'), 'settingsLooksShowMissBadHitCounter', this.config.looks.showMissCounter),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowBPM'), 'settingsLooksShowBPM', this.config.looks.showBpm),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowBlockSpeed'), 'settingsLooksShowBlockSpeed', this.config.looks.showBlockSpeed),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowCombo'), 'settingsLooksShowCombo', this.config.looks.showCombo),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksHideFullComboInfo'), 'settingsLooksHideFullComboInfo', this.config.looks.hideFullComboModifier),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksHideDefaultDifficultyIfDifficultyHasCustomName'), 'settingsLooksHideDefaultDifficultyIfDifficultyHasCustomName', this.config.looks.hideDefaultDifficultyOnCustomDifficulty),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksHideCompleteModifierSection'), 'settingsLooksHideCompleteModifierSection', this.config.looks.hideAllModifiers),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksHideCompleteCounterSection'), 'settingsLooksHideCompleteCounterSection', this.config.looks.hideCounterSection),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksHideCompleteSongInfoSection'), 'settingsLooksHideCompleteSongInfoSection', this.config.looks.hideSongInfo),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksTimeCircleMatchesOtherCircles'), 'settingsLooksTimeCircleMatchesOtherCircles', this.config.looks.timeCircleLikeOtherCircles),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowIfMapIsRanked'), 'settingsLooksShowIfMapIsRanked', this.config.looks.showRanked),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowRankedStarDifficultyInfo'), 'settingsLooksShowRankedStarDifficultyInfo', this.config.looks.showStars),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsLooksShowRankBehindTheAccuracyCircle'), 'settingsLooksShowRankBehindTheAccuracyCircle', this.config.looks.showAccuracyRank),
                this.rangeSettingLine('settingsLooksBorderRadius', this.config.looks.borderRadius, 0, 20, 1),
                this.dropDownSettingLine(
                    'settingsLooksOverrideBackgroundColorWithMapColor',
                    [
                        this.createOptionForSelect(0, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['0'], this.config.looks.useMapColorForBackgroundColor.Value == 0),
                        this.createOptionForSelect(1, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['1'], this.config.looks.useMapColorForBackgroundColor.Value == 1),
                        this.createOptionForSelect(2, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['2'], this.config.looks.useMapColorForBackgroundColor.Value == 2),
                        this.createOptionForSelect(3, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['3'], this.config.looks.useMapColorForBackgroundColor.Value == 3),
                        this.createOptionForSelect(4, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['4'], this.config.looks.useMapColorForBackgroundColor.Value == 4),
                        this.createOptionForSelect(5, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['5'], this.config.looks.useMapColorForBackgroundColor.Value == 5),
                        this.createOptionForSelect(6, this.languageManager.getLocalizedText('settingsLooksOverrideBackgroundColorWithMapColor')['options']['6'], this.config.looks.useMapColorForBackgroundColor.Value == 6),
                    ],
                    (newValue: string) => {
                        this.config.looks.useMapColorForBackgroundColor.Value = parseInt(newValue);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                this.dropDownSettingLine(
                    'settingsLooksOverrideTextColorWithMapColor',
                    [
                        this.createOptionForSelect(0, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['0'], this.config.looks.useMapColorForTextColor.Value == 0),
                        this.createOptionForSelect(1, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['1'], this.config.looks.useMapColorForTextColor.Value == 1),
                        this.createOptionForSelect(2, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['2'], this.config.looks.useMapColorForTextColor.Value == 2),
                        this.createOptionForSelect(3, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['3'], this.config.looks.useMapColorForTextColor.Value == 3),
                        this.createOptionForSelect(4, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['4'], this.config.looks.useMapColorForTextColor.Value == 4),
                        this.createOptionForSelect(5, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['5'], this.config.looks.useMapColorForTextColor.Value == 5),
                        this.createOptionForSelect(6, this.languageManager.getLocalizedText('settingsLooksOverrideTextColorWithMapColor')['options']['6'], this.config.looks.useMapColorForTextColor.Value == 6),
                    ],
                    (newValue: string) => {
                        this.config.looks.useMapColorForTextColor.Value = parseInt(newValue);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                colorInfo,
                positions,
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsPositionsMoveSongInfoToRightSide'), 'settingsPositionsMoveSongInfoToRightSide', this.config.looks.songInfoOnRightSide),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsPositionsMoveSongInfoToTop'), 'settingsPositionsMoveSongInfoToTop', this.config.looks.songInfoOnTopSide),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsPositionsMoveCounterSectionToTop'), 'settingsPositionsMoveCounterSectionToTop', this.config.looks.counterSectionOnTop),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsPositionsMoveModifiersToRightSide'), 'settingsPositionsMoveModifiersToRightSide', this.config.looks.modifiersOnRightSide),
                this.rangeSettingLine('settingsPositionsMargin', this.config.looks.margin, -5, 50, 1),
                misc,
                this.dropDownSettingLine(
                    'settingsMiscCompareScoreWithLastScore',
                    [
                        this.createOptionForSelect(0, this.languageManager.getLocalizedText('settingsMiscCompareScoreWithLastScore')['options']['0'], this.config.looks.compareWithPreviousScore.Value == 0),
                        this.createOptionForSelect(1, this.languageManager.getLocalizedText('settingsMiscCompareScoreWithLastScore')['options']['1'], this.config.looks.compareWithPreviousScore.Value == 1),
                        this.createOptionForSelect(2, this.languageManager.getLocalizedText('settingsMiscCompareScoreWithLastScore')['options']['2'], this.config.looks.compareWithPreviousScore.Value == 2)
                    ],
                    (value: string) => {
                        this.config.looks.compareWithPreviousScore.Value = parseInt(value);
                    }
                ),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsMiscAnimateScoreIncrement'), 'settingsMiscAnimateScoreIncrement', this.config.looks.animateScore),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsMiscShowSongSpeedAsRelativeValues'), 'settingsMiscShowSongSpeedAsRelativeValues', this.config.looks.speedDisplayRelative),
                this.booleanSettingLine(this.languageManager.getLocalizedText('settingsMiscTestWithBackgroundImage'), 'settingsMiscTestWithBackgroundImage', this.backgroundImageTest),
            );
        }

        /**
         * function to check color override setting to make sure user get a proper info when selecting same for both
         * @param element
         * @param defaultText
         * @private
         */
        private checkUserOverrideColorSetting(element: HTMLDivElement, defaultText: string): void {
            element.innerText = defaultText;
            if (this.config.looks.useMapColorForBackgroundColor.Value == 0 || this.config.looks.useMapColorForTextColor.Value == 0) {
                return;
            }

            if (this.config.looks.useMapColorForBackgroundColor.Value == this.config.looks.useMapColorForTextColor.Value) {
                element.innerText = defaultText + this.languageManager.getLocalizedText("UserOverrideColorSetting");
            }
        }

        /**
         * builds Pulsoid tab, see Pulsoid config and data classes for more information
         * @private
         */
        private buildHeartRateTab(): void {
            let selector = document.getId<HTMLSelectElement>('heartRateFeedType');
            let names = this.languageManager.getLocalizedText('heartRateFeedType');

            Freakylay.DataTransfer.HeartRate.FeedType.foreach((value: string) => {
                if (!isNaN(Number(value))) {
                    return;
                }

                let name: string;
                if (
                    (value === 'Dummy' && !this.isDev)
                    || value == 'JSON'
                ) {
                    return;
                } else if (names.hasOwnProperty(value)) {
                    name = names[value];
                } else {
                    name = value;
                }

                selector.append(this.createOptionForSelect(
                    value,
                    name,
                    Freakylay.DataTransfer.HeartRate.FeedType[value] == this.config.heartRate.type.Value
                ));
            });

            selector.onchange = () => {
                this.heartRate.stop();
                this.config.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType[selector.value];
                this.checkHeartRateFeedType(false);
            };

            this.heartRateFeedInput.value = this.config.heartRate.tokenOrUrl.Value;
            /*
            this.heartRateFeedInput.onchange = () => {
                this.config.heartRate.tokenOrUrl.Value = this.heartRateFeedInput.value;
            }
            */

            document.getId<HTMLInputElement>('heartRateFeedButton').onclick = () => {
                this.config.heartRate.tokenOrUrl.Value = this.heartRateFeedInput.value;
                this.config.heartRate.type.Value = Freakylay.DataTransfer.HeartRate.FeedType[selector.value];

                this.heartRate.registerNewType();
            }

            let offsetHint = document.div();
            offsetHint.id = 'heartRateOffsetHint';
            offsetHint.innerHTML = this.languageManager.getLocalizedText("heartRateOffsetHint");

            let pullInfo = document.div();
            pullInfo.id = 'heartRatePullInfo';
            pullInfo.innerHTML = this.languageManager.getLocalizedText("heartRatePullInfo");

            let settings = document.getDiv('heartRateSettingList');
            let graph = document.headline(this.languageManager.getLocalizedText('heartRateSettingsGraph')) as HTMLElement;
            graph.id = 'heartRateSettingsGraph';

            settings.append(
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsUseDynamicMaxBPM'), 'heartRateSettingsUseDynamicMaxBPM', this.config.heartRate.useDynamicBpm),
                this.numberSettingLine(this.languageManager.getLocalizedText('heartRateSettingsMaximumBPMToDisplay'), 'heartRateSettingsMaximumBPMToDisplay', this.config.heartRate.maxStaticBpm, 30, 500, 1),
                graph,
                offsetHint,
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsDisplayGraph'), 'heartRateSettingsDisplayGraph', this.config.heartRate.graph.enabled),
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsUseBackground'), 'heartRateSettingsUseBackground', this.config.heartRate.graph.useBackground),
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsStrokeLineWithBackgroundColorInNoBackgroundMode'), 'heartRateSettingsStrokeLineWithBackgroundColorInNoBackgroundMode', this.config.heartRate.graph.useBackgroundColorForStroke),
                this.rangeSettingLine('heartRateSettingsGraphWidth', this.config.heartRate.graph.width, Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerWidth, 1),
                this.rangeSettingLine('heartRateSettingsGraphHeight', this.config.heartRate.graph.height, Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerHeight, 1),
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsDisableCircleBarInCounterSection'), 'heartRateSettingsDisableCircleBarInCounterSection', this.config.heartRate.graph.disableCircleBar),
                this.booleanSettingLine(this.languageManager.getLocalizedText('heartRateSettingsDisplayNumbers'), 'heartRateSettingsDisplayNumbers', this.config.heartRate.graph.displayNumbers),
                this.rangeSettingLine('heartRateSettingsFontSizeForMinAndMaxBPM', this.config.heartRate.graph.smallFontSize, 0, Freakylay.Internal.Config.HeartGraph.MaxFontSize, 1),
                this.rangeSettingLine('heartRateSettingsFontSizeForCurrentBPM', this.config.heartRate.graph.bigFontSize, 0, Freakylay.Internal.Config.HeartGraph.MaxFontSize, 1),
                this.dropDownSettingLine(
                    'heartRateSettingsAnchor',
                    [
                        this.createOptionForSelect(0, this.languageManager.getLocalizedText('heartRateSettingsAnchor')['options']['0'], this.config.heartRate.graph.anchor.Value == 0),
                        this.createOptionForSelect(1, this.languageManager.getLocalizedText('heartRateSettingsAnchor')['options']['1'], this.config.heartRate.graph.anchor.Value == 1),
                        this.createOptionForSelect(2, this.languageManager.getLocalizedText('heartRateSettingsAnchor')['options']['2'], this.config.heartRate.graph.anchor.Value == 2),
                        this.createOptionForSelect(3, this.languageManager.getLocalizedText('heartRateSettingsAnchor')['options']['3'], this.config.heartRate.graph.anchor.Value == 3),
                        this.createOptionForSelect(4, this.languageManager.getLocalizedText('heartRateSettingsAnchor')['options']['4'], this.config.heartRate.graph.anchor.Value == 4),
                    ],
                    (change) => {
                        this.config.heartRate.graph.anchor.Value = parseInt(change);
                    }
                ),
                this.rangeSettingLine('heartRateSettingsOffsetX', this.config.heartRate.graph.offsetX, 0, window.outerWidth, 1),
                this.rangeSettingLine('heartRateSettingsOffsetY', this.config.heartRate.graph.offsetY, 0, window.outerHeight, 1),
                this.rangeSettingLine('heartRateSettingsEventsToShow', this.config.heartRate.graph.eventsToShow, Freakylay.Internal.Config.HeartGraph.MinTimespan, Freakylay.Internal.Config.HeartGraph.MaxTimespan, 10),
                pullInfo
            );
        }

        /**
         * checks the feed type and enables or disables specific functions for heart rate settings
         * @param firstStart
         * @private
         */
        private checkHeartRateFeedType(firstStart: boolean): void {
            this.heartRateHintPulsoid.display(false);
            this.heartRateHintSession.display(false);
            this.heartRatePulsoidThanks.display(false);
            this.heartRateHypeRateThanks.display(false);

            let pulsoidUrl = new URL('https://pulsoid.net/oauth2/authorize');

            pulsoidUrl.searchParams.append('response_type', 'token');
            pulsoidUrl.searchParams.append('redirect_uri', '');
            pulsoidUrl.searchParams.append('scope', 'data:heart_rate:read');
            pulsoidUrl.searchParams.append('state', 'a52beaeb-c491-4cd3-b915-16fed71e17a8');
            pulsoidUrl.searchParams.append('response_mode', 'web_page');
            pulsoidUrl.searchParams.append('client_id', 'a5cd6120-1f13-4a74-9bb9-1183523517aa');

            document.getId<HTMLButtonElement>('heartRateAuthLink').onclick = () => {
                window.open(pulsoidUrl, '_blank');
            };

            switch (this.config.heartRate.type.Value) {
                case Freakylay.DataTransfer.HeartRate.FeedType.Disabled:
                    this.heartRateFeedText.innerText = this.languageManager.getLocalizedText("heartRateFeedTextDisabled");

                    this.heartRateFeedInput.disabled = true;

                    this.heartRateHintPulsoid.display(false);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.JSON:
                    this.heartRateFeedText.innerText = this.languageManager.getLocalizedText("heartRateFeedTextJSON");

                    if (!firstStart) {
                        this.heartRateFeedInput.value = '';
                    }

                    this.heartRateFeedInput.disabled = false;
                    this.heartRateFeedInput.type = 'text';

                    this.heartRatePulsoidThanks.display(true);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Token:
                    this.heartRateFeedText.innerText = this.languageManager.getLocalizedText("heartRateFeedTextToken");

                    if (!firstStart) {
                        this.heartRateFeedInput.value = '';
                    }

                    this.heartRateFeedInput.disabled = false;
                    this.heartRateFeedInput.type = 'password';

                    this.heartRateHintPulsoid.display(true);
                    this.heartRatePulsoidThanks.display(true);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Dummy:
                    this.heartRateFeedText.innerText = this.languageManager.getLocalizedText("heartRateFeedTextDummy");
                    this.heartRateFeedInput.disabled = true;
                    this.heartRateFeedInput.value = this.languageManager.getLocalizedText("heartRateFeedTextDummyValue");
                    this.heartRateFeedInput.type = 'text';

                    this.heartRateHintPulsoid.display(false);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.HypeRate:
                    this.heartRateFeedText.innerText = this.languageManager.getLocalizedText("heartRateFeedTextHypeRate");

                    if (!firstStart) {
                        this.heartRateFeedInput.value = '';
                    }

                    this.heartRateFeedInput.disabled = false;
                    this.heartRateFeedInput.type = 'text';

                    this.heartRateHintSession.display(true);
                    this.heartRateHypeRateThanks.display(true);
                    break;
            }
            this.heartRateFeedText.innerText += ':';
        }

        /**
         * helper function to create ease html option elemeents
         * @param value
         * @param text
         * @param selected
         * @private
         */
        private createOptionForSelect<T>(value: T, text?: string, selected?: boolean): HTMLOptionElement {
            let option = document.create<HTMLOptionElement>('option');
            option.value = value.toString();
            option.innerText = text == null ? value.toString() : text;
            option.selected = selected == null ? false : selected;
            return option;
        }

        /**
         * helper to get specific tab in options panel
         * @param contentName
         * @private
         */
        private getTabContentDom(contentName: string): HTMLDivElement {
            return document.get<HTMLDivElement>('.tabContent[data-tab-content=' + contentName + ']');
        }

        /**
         * helper to generate a UI line for boolean setting
         * @param name
         * @param id
         * @param property
         * @private
         */
        public booleanSettingLine(name: string, id: string, property: EventProperty<boolean>): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingsLine');
            let info = document.span();
            info.id = id;
            let input = document.create<HTMLInputElement>('input');

            input.type = 'checkbox';
            input.checked = property.Value;

            info.innerText = name;
            info.onclick = () => {
                this.toggleProperty(input, property);
            };

            input.onchange = () => {
                this.toggleProperty(input, property);
            };

            line.append(input, info);

            return line;
        }

        /**
         * helper to generate a UI line for number setting
         * @param name
         * @param id
         * @param property
         * @param min
         * @param max
         * @param step
         * @private
         */
        private numberSettingLine(name: string, id: string, property: EventProperty<number>, min: number, max: number, step: number): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingLine');
            let info = document.span();
            info.id = id;
            let input = document.create<HTMLInputElement>('input');

            input.type = 'number';
            input.min = min.toString();
            input.max = max.toString();
            input.step = step.toString();
            input.value = property.Value.toString();
            input.oninput = () => {
                property.Value = parseInt(input.value);
            };

            info.innerText = name;

            line.append(input, info);

            return line;
        }

        /**
         * helper to generate a UI line for dropdown setting
         * @param name
         * @param valueArray
         * @param changeCallback
         * @private
         */
        private dropDownSettingLine(name: string, valueArray: HTMLOptionElement[], changeCallback: (value: string) => void): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingsLine').addClass<HTMLDivElement>('dropDownSettingLine');
            let info = document.span();
            let select = document.create<HTMLSelectElement>('select');

            line.id = name;
            info.innerText = this.languageManager.getLocalizedText(name)["label"];

            select.append(...valueArray);

            line.append(select, info);

            select.onchange = () => {
                changeCallback(select.value);
            };

            return line;
        }

        /**
         * event handler when a setting line is toggled
         * @param input
         * @param property
         * @private
         */
        private toggleProperty(input: HTMLInputElement, property: EventProperty<boolean>): void {
            property.Value = !property.Value;
            input.checked = property.Value;
        }

        /**
         * creates the UI for selecting game and connection/mods
         * @private
         */
        private buildGameTab(): void {
            this.connectionListElement.inline(false);

            this.gameListElement.onchange = () => {
                if (this.gameListElement.value == 'None') {
                    return;
                }
                try {
                    this.onGameConnectionChange.Value = null;
                    this.onGameChange.Value = this.gameList.firstOrError((game: BaseGame) => game.getName() == this.gameListElement.value);
                    this.enableDisableGameButton();
                } catch {
                    this.logger.log('gameListElement onchange ????');
                }
            };

            this.connectionListElement.onchange = () => {
                if (this.connectionListElement.value == 'None') {
                    return;
                }

                try {
                    this.onGameConnectionChange.Value = this.onGameChange.Value.getConnections.firstOrError((con: BaseConnection) => con.getName() == this.connectionListElement.value);
                    this.enableDisableGameButton();
                } catch {
                    this.logger.log('connectionListElement onchange ????');
                }
            };

            this.gameList.forEach((game: BaseGame) => {
                let name = game.getName();
                this.gameListElement.append(this.createOptionForSelect(name, name, name == this.config.game.Value));
            });

            this.gameConnectionSettingElement = document.getDiv('gameConnectionSetting');
        }

        /**
         * creates a input range element
         * @param name
         * @param property
         * @param min
         * @param max
         * @param step
         * @private
         */
        private rangeSettingLine(name: string, property: EventProperty<number>, min: number, max: number, step: number): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingsLine').addClass<HTMLDivElement>('rangeSettingLine');
            let info = document.span();
            line.id = name;

            info.innerText = property.Value + ' - ' + this.languageManager.getLocalizedText(name);

            let input = document.inputRange(property.Value, min, max, step);
            input.oninput = () => {
                property.Value = parseInt(input.value);
                info.innerText = property.Value + ' - ' + this.languageManager.getLocalizedText(name);
            };

            line.append(input, info);

            return line;
        }

        /**
         * enables or disables apply button when game and connection is set
         * @private
         */
        private enableDisableGameButton(): void {
            this.applyGameButton.disabled = this.onGameChange.Value == null || this.onGameConnectionChange.Value == null;
        }
    }
}