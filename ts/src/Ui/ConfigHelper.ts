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

        // heart rate
        private heartRate: AbstractHeartRate;
        private heartRateFeedText: HTMLLabelElement;
        private heartRateFeedInput: HTMLInputElement;
        private heartRateHintJson: HTMLDivElement;
        private heartRateHintToken: HTMLDivElement;
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

        get fullVersionString(): string {
            return 'Freakylay ' + Overlay.Version + (Overlay.Branch.length > 0 ? ' ' + Overlay.Branch : '');
        }

        constructor(config: Config, heartRate: AbstractHeartRate, gameList: BaseGame[], gameLinkState: EventProperty<GameLinkStatus>, isDev: boolean) {
            this.logger = new Logger('ConfigHelper');
            this.optionsOpen = new EventProperty<boolean>(false);
            this.config = config;
            this.heartRate = heartRate;
            this.gameList = gameList;
            this.isDev = isDev;
            this.urlText = document.get<HTMLTextAreaElement>('#urlText');
            this.backgroundImageTest = new EventProperty<boolean>(false);
            this.onGameChange = new EventProperty<BaseGame>();
            this.onGameConnectionChange = new EventProperty<BaseConnection>();
            this.onConnection = new EventProperty<boolean>(false);

            document.getDiv('copyright').innerText = this.fullVersionString;
            document.getId<HTMLSpanElement>('welcomeVersion').innerText = this.fullVersionString;
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

            this.gameListElement = document.getId<HTMLSelectElement>('gameList');
            this.connectionListElement = document.getId<HTMLSelectElement>('connectionList');

            // heart rate elements
            this.heartRateFeedText = document.getId<HTMLLabelElement>('heartRateFeedUrlText');
            this.heartRateFeedInput = document.getId<HTMLInputElement>('heartRateFeed');
            this.heartRateHintJson = document.getDiv('heartRateHintJson');
            this.heartRateHintToken = document.getDiv('heartRateHintToken');
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
                this.heartRateConnectionState.innerText = Freakylay.DataTransfer.HeartRate.ConnectionState[state];
            });
            this.heartRate.connectionState.trigger();
            this.checkHeartRateFeedType(true);

            this.onGameChange.register((game: BaseGame) => {
                if (game == null) {
                    return;
                }
                this.connectionListElement.removeChildren();
                this.connectionListElement.append(this.createOptionForSelect('None', 'choose', true));
                game.getConnections.forEach((connection: BaseConnection) => {
                    let name = connection.getName();
                    this.connectionListElement.append(this.createOptionForSelect(name, name, name == this.config.connection.Value));
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
                        document.label('IP: ', 'customIp'),
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
                        document.label('Port: ', 'customPort'),
                        input
                    );
                    this.gameConnectionSettingElement.append(line);
                }

                con.displayConnectionSettings(this.gameConnectionSettingElement, this);
            });

            let gameLinkStatus = document.getDiv('gameLinkStatus');
            gameLinkState.register((newStatus: GameLinkStatus) => {
                gameLinkStatus.innerText = newStatus.toString();
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
            this.backgroundColorInput = new ColorInput('Background color', this.config.colors.background.Value, (alpha: number) => {
                return alpha > .03 && (alpha < .49 || alpha > .9);
            });
            this.textColorInput = new ColorInput('Text color', this.config.colors.text.Value, (alpha: number) => {
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
            this.getTabContentDom('colors').append(
                document.button('Random background color', (_) => {
                    this.backgroundColorInput.color.Value = Color.random(.7);

                }),
                document.button('Random text color', (_) => {
                    this.textColorInput.color.Value = Color.random(1);
                }),
            );
        }

        /**
         * builds setting tab, all of those are boolean values
         * @private
         */
        private buildSettingsTab(): void {
            let info = document.div();
            let colorInfo = document.div();
            let defaultColorInfoText = 'It will not change the alpha channel, only RGB will get used!';

            info.innerText = 'Please note: Not all settings are supported by the selected game or connection.';
            colorInfo.innerText = defaultColorInfoText;

            this.getTabContentDom('settings').append(
                //document.headline('Info'),
                info,
                document.headline('Looks'),
                this.booleanSettingLine('display short modifier names', this.config.looks.shortModifierNames),
                this.booleanSettingLine('show previous map key (DataPuller)', this.config.looks.showPreviousKey),
                this.booleanSettingLine('show miss/bad hit counter', this.config.looks.showMissCounter),
                this.booleanSettingLine('show BPM', this.config.looks.showBpm),
                this.booleanSettingLine('show block speed', this.config.looks.showBlockSpeed),
                this.booleanSettingLine('show combo', this.config.looks.showCombo),
                this.booleanSettingLine('hide full combo info', this.config.looks.hideFullComboModifier),
                this.booleanSettingLine('hide default difficulty if difficulty has custom name (DataPuller)', this.config.looks.hideDefaultDifficultyOnCustomDifficulty),
                this.booleanSettingLine('hide complete modifier section', this.config.looks.hideAllModifiers),
                this.booleanSettingLine('hide complete counter section', this.config.looks.hideCounterSection),
                this.booleanSettingLine('hide complete song info section', this.config.looks.hideSongInfo),
                this.booleanSettingLine('time circle matches other circles', this.config.looks.timeCircleLikeOtherCircles),
                this.booleanSettingLine('show if map is ranked (DataPuller)', this.config.looks.showRanked),
                this.booleanSettingLine('show ranked star/difficulty info (DataPuller)', this.config.looks.showStars),
                this.booleanSettingLine('show rank behind the accuracy circle (DataPuller)', this.config.looks.showAccuracyRank),
                this.rangeSettingLine('border radius', this.config.looks.borderRadius, 0, 20, 1),
                this.dropDownSettingLine(
                    'override background color with map color (HttpSiraStatus)',
                    [
                        this.createOptionForSelect(0, 'No override', this.config.looks.useMapColorForBackgroundColor.Value == 0),
                        this.createOptionForSelect(1, 'Use left environment color', this.config.looks.useMapColorForBackgroundColor.Value == 1),
                        this.createOptionForSelect(2, 'Use right environment color', this.config.looks.useMapColorForBackgroundColor.Value == 2),
                        this.createOptionForSelect(3, 'Use obstacle color', this.config.looks.useMapColorForBackgroundColor.Value == 3),
                        this.createOptionForSelect(4, 'Use wall color (only Sira!)', this.config.looks.useMapColorForBackgroundColor.Value == 4),
                        this.createOptionForSelect(5, 'Use left saber color', this.config.looks.useMapColorForBackgroundColor.Value == 5),
                        this.createOptionForSelect(6, 'Use right saber color', this.config.looks.useMapColorForBackgroundColor.Value == 6),
                    ],
                    (newValue: string) => {
                        this.config.looks.useMapColorForBackgroundColor.Value = parseInt(newValue);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                this.dropDownSettingLine(
                    'override text color with map color (HttpSiraStatus)',
                    [
                        this.createOptionForSelect(0, 'No override', this.config.looks.useMapColorForTextColor.Value == 0),
                        this.createOptionForSelect(1, 'Use left environment color', this.config.looks.useMapColorForTextColor.Value == 1),
                        this.createOptionForSelect(2, 'Use right environment color', this.config.looks.useMapColorForTextColor.Value == 2),
                        this.createOptionForSelect(3, 'Use obstacle color', this.config.looks.useMapColorForBackgroundColor.Value == 3),
                        this.createOptionForSelect(4, 'Use wall color (only Sira!)', this.config.looks.useMapColorForBackgroundColor.Value == 4),
                        this.createOptionForSelect(5, 'Use left saber color', this.config.looks.useMapColorForBackgroundColor.Value == 5),
                        this.createOptionForSelect(6, 'Use right saber color', this.config.looks.useMapColorForBackgroundColor.Value == 6),
                    ],
                    (newValue: string) => {
                        this.config.looks.useMapColorForTextColor.Value = parseInt(newValue);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                colorInfo,
                document.headline('Positions'),
                this.booleanSettingLine('move song info to right side', this.config.looks.songInfoOnRightSide),
                this.booleanSettingLine('move song into to top', this.config.looks.songInfoOnTopSide),
                this.booleanSettingLine('move counter section to top', this.config.looks.counterSectionOnTop),
                this.booleanSettingLine('move modifiers to right side', this.config.looks.modifiersOnRightSide),
                this.rangeSettingLine('margin', this.config.looks.margin, -5, 50, 1),
                document.headline('Misc'),
                this.dropDownSettingLine(
                    'compare score with last score (DataPuller)',
                    [
                        this.createOptionForSelect(0, 'do not compare', this.config.looks.compareWithPreviousScore.Value == 0),
                        this.createOptionForSelect(1, 'legacy - Freakylay 2 Arrow', this.config.looks.compareWithPreviousScore.Value == 1),
                        this.createOptionForSelect(2, 'use offset', this.config.looks.compareWithPreviousScore.Value == 2)
                    ],
                    (value: string) => {
                        this.config.looks.compareWithPreviousScore.Value = parseInt(value);
                    }
                ),
                this.booleanSettingLine('animate score increment', this.config.looks.animateScore),
                this.booleanSettingLine('show song speed as relative values (-20% instead of 80%)', this.config.looks.speedDisplayRelative),
                this.booleanSettingLine('test with background image', this.backgroundImageTest),
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
                element.innerText = defaultText + ' ....... this does not make any sense at all to set both to the same color...';
            }
        }

        /**
         * builds Pulsoid tab, see Pulsoid config and data classes for more information
         * @private
         */
        private buildHeartRateTab(): void {
            let selector = document.getId<HTMLSelectElement>('heartRateFeedType');

            Freakylay.DataTransfer.HeartRate.FeedType.foreach((value: string) => {
                if (!isNaN(Number(value))) {
                    return;
                }

                let name;
                switch (value) {
                    default:
                        name = value;
                        break;
                    case 'JSON':
                        name = 'Pulsoid JSON (deprecated)';
                        break;
                    case 'Token':
                        name = 'Pulsoid Token';
                        break;
                    case 'Dummy':
                        if (!this.isDev) {
                            return;
                        }
                        name = value;
                        break;
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
            offsetHint.innerHTML = 'If it does not show up, it might be out of bounds. Try adjusting the offset values and make sure the connection is in fetching state.';

            let pullInfo = document.div();
            pullInfo.innerHTML = 'A higher number means more data to show, lower will show a more fast paced graph. Normally a bpm event is received about every second but it can vary.';

            let settings = document.getDiv('heartRateSettingList');
            settings.append(
                this.booleanSettingLine('use dynamic max bpm', this.config.heartRate.useDynamicBpm),
                this.numberSettingLine('maximum bpm to display (affects circle)', this.config.heartRate.maxStaticBpm, 30, 500, 1),
                document.headline('Graph'),
                offsetHint,
                this.booleanSettingLine('display graph', this.config.heartRate.graph.enabled),
                this.booleanSettingLine('use background', this.config.heartRate.graph.useBackground),
                this.booleanSettingLine('stroke line with background color in no background mode', this.config.heartRate.graph.useBackgroundColorForStroke),
                this.rangeSettingLine('width', this.config.heartRate.graph.width, Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerWidth, 1),
                this.rangeSettingLine('height', this.config.heartRate.graph.height, Freakylay.Internal.Config.HeartGraph.MinGraphSize, window.outerHeight, 1),
                this.booleanSettingLine('disable circle bar in counter section', this.config.heartRate.graph.disableCircleBar),
                this.booleanSettingLine('display numbers', this.config.heartRate.graph.displayNumbers),
                this.rangeSettingLine('font size for min and max bpm', this.config.heartRate.graph.smallFontSize, 0, Freakylay.Internal.Config.HeartGraph.MaxFontSize, 1),
                this.rangeSettingLine('font size for current bpm', this.config.heartRate.graph.bigFontSize, 0, Freakylay.Internal.Config.HeartGraph.MaxFontSize, 1),
                this.dropDownSettingLine(
                    'anchor',
                    [
                        this.createOptionForSelect(0, 'top left', this.config.heartRate.graph.anchor.Value == 0),
                        this.createOptionForSelect(1, 'top right', this.config.heartRate.graph.anchor.Value == 1),
                        this.createOptionForSelect(2, 'bottom left', this.config.heartRate.graph.anchor.Value == 2),
                        this.createOptionForSelect(3, 'bottom right', this.config.heartRate.graph.anchor.Value == 3),
                        this.createOptionForSelect(4, 'center screen', this.config.heartRate.graph.anchor.Value == 4),
                    ],
                    (change) => {
                        this.config.heartRate.graph.anchor.Value = parseInt(change);
                    }
                ),
                this.rangeSettingLine('offset X', this.config.heartRate.graph.offsetX, 0, window.outerWidth, 1),
                this.rangeSettingLine('offset Y', this.config.heartRate.graph.offsetY, 0, window.outerHeight, 1),
                this.rangeSettingLine('events to show', this.config.heartRate.graph.eventsToShow, Freakylay.Internal.Config.HeartGraph.MinTimespan, Freakylay.Internal.Config.HeartGraph.MaxTimespan, 10),
                pullInfo
            );
        }

        /**
         * checks the feed type and enables or disables specific functions for heart rate settings
         * @param firstStart
         * @private
         */
        private checkHeartRateFeedType(firstStart: boolean): void {
            this.heartRateHintToken.display(false);
            this.heartRateHintJson.display(false);
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
                    this.heartRateFeedText.innerText = 'URL or token';

                    this.heartRateFeedInput.disabled = true;

                    this.heartRateHintToken.display(false);
                    this.heartRateHintJson.display(false);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.JSON:
                    this.heartRateFeedText.innerText = 'JSON URL';

                    if (!firstStart) {
                        this.heartRateFeedInput.value = '';
                    }

                    this.heartRateFeedInput.disabled = false;
                    this.heartRateFeedInput.type = 'text';

                    this.heartRateHintJson.display(true);
                    this.heartRatePulsoidThanks.display(true);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Token:
                    this.heartRateFeedText.innerText = 'Token';

                    if (!firstStart) {
                        this.heartRateFeedInput.value = '';
                    }

                    this.heartRateFeedInput.disabled = false;
                    this.heartRateFeedInput.type = 'password';

                    this.heartRateHintToken.display(true);
                    this.heartRatePulsoidThanks.display(true);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.Dummy:
                    this.heartRateFeedText.innerText = 'Token';
                    this.heartRateFeedInput.disabled = true;
                    this.heartRateFeedInput.value = 'not needed =)';
                    this.heartRateFeedInput.type = 'text';

                    this.heartRateHintJson.display(false);
                    this.heartRateHintToken.display(false);
                    break;
                case Freakylay.DataTransfer.HeartRate.FeedType.HypeRate:
                    this.heartRateFeedText.innerText = 'Session-ID';

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
         * @param property
         * @private
         */
        public booleanSettingLine(name: string, property: EventProperty<boolean>): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingsLine');
            let info = document.span();
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
         * @param property
         * @param min
         * @param max
         * @param step
         * @private
         */
        private numberSettingLine(name: string, property: EventProperty<number>, min: number, max: number, step: number): HTMLDivElement {
            let line = document.div().addClass<HTMLDivElement>('settingLine');
            let info = document.span();
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

            line.append(input, name);

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
            let line = document.div().addClass<HTMLDivElement>('settingsLine');
            let info = document.span();
            let select = document.create<HTMLSelectElement>('select');

            info.innerText = name;

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
            let line = document.div().addClass<HTMLDivElement>('settingsLine');
            let info = document.span();

            info.innerText = property.Value + ' - ' + name;

            let input = document.inputRange(property.Value, min, max, step);
            input.oninput = () => {
                property.Value = parseInt(input.value);
                info.innerText = property.Value + ' - ' + name;
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