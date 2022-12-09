///<reference path="../Internal/EventProperty.ts"/>
///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import Config = Freakylay.Internal.Config.Config;
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;
    import FeedType = Freakylay.DataTransfer.Pulsoid.FeedType;
    import Logger = Freakylay.Internal.Logger;
    import Pulsoid = Freakylay.DataTransfer.Pulsoid.Pulsoid;
    import ConnectionState = Freakylay.DataTransfer.Pulsoid.ConnectionState;
    import BaseGame = Freakylay.Game.BaseGame;
    import BaseConnection = Freakylay.Game.BaseConnection;
    import GameLinkStatus = Freakylay.Game.GameLinkStatus;

    /**
     * helper for config <-> option panel
     * is used as an interface between option panel (UI) and config values
     */
    export class ConfigHelper {

        public readonly optionsOpen: EventProperty<boolean>;
        public readonly onGameChange: EventProperty<BaseGame>;
        public readonly onGameConnectionChange: EventProperty<BaseConnection>;
        public readonly onConnection: EventProperty<boolean>;

        private readonly logger: Logger;
        private readonly config: Config;
        private readonly pulsoid: Pulsoid;
        private readonly urlText: HTMLTextAreaElement;
        private options: HTMLDivElement;
        private gameConnectionSetting: HTMLDivElement;

        private backgroundColorInput: ColorInput;
        private textColorInput: ColorInput;

        private readonly backgroundImageTest: EventProperty<boolean>;

        private gameList: BaseGame[];

        // pulsoid
        private pulsoidFeedText: HTMLLabelElement;
        private pulsoidFeedInput: HTMLInputElement;
        private pulsoidHintJson: HTMLDivElement;
        private pulsoidHintToken: HTMLDivElement;
        private pulsoidConnectionState: HTMLSpanElement;
        private gameListElement: HTMLSelectElement;
        private connectionListElement: HTMLSelectElement;
        private applyGameButton: HTMLButtonElement;

        constructor(config: Config, pulsoid: Pulsoid, gameList: BaseGame[], gameLinkState: EventProperty<GameLinkStatus>) {
            this.logger = new Logger('ConfigHelper');
            this.optionsOpen = new EventProperty<boolean>(false);
            this.config = config;
            this.pulsoid = pulsoid;
            this.gameList = gameList;
            this.urlText = document.get<HTMLTextAreaElement>('#urlText');
            this.backgroundImageTest = new EventProperty<boolean>(false);
            this.onGameChange = new EventProperty<BaseGame>();
            this.onGameConnectionChange = new EventProperty<BaseConnection>();
            this.onConnection = new EventProperty<boolean>(false);

            let version = 'Freakylay ' + Overlay.Version + (Overlay.IsAlpha ? ' Alpha' : '');

            document.getDiv('copyright').innerText = version;
            document.getId<HTMLSpanElement>('welcomeVersion').innerText = version;
            document.getDiv('songInfo').ondblclick = () => {
                this.toggleOptionPanel();
            }

            if (Overlay.IsAlpha) {
                let alphaWarning = document.getDiv('alphaWarning');
                alphaWarning.innerText = version + ' - early testing version';
            }

            this.gameListElement = document.getId<HTMLSelectElement>('gameList');
            this.connectionListElement = document.getId<HTMLSelectElement>('connectionList');

            this.buildGameTab();
            this.buildColorTab();
            this.buildSettingsTab();
            this.buildPulsoidTab();

            this.backgroundImageTest.register((enabled: boolean) => {
                document.body.toggleClassByValue(enabled, 'test');
            });

            // pulsoid
            this.pulsoidFeedText = document.getId<HTMLLabelElement>('pulsoidFeedUrlText');
            this.pulsoidFeedInput = document.getId<HTMLInputElement>('pulsoidFeed');
            this.pulsoidHintJson = document.getDiv('pulsoidHintJson');
            this.pulsoidHintToken = document.getDiv('pulsoidHintToken');
            this.pulsoidConnectionState = document.getDiv('pulsoidConnectionState');

            this.pulsoid.connectionState.register((state: ConnectionState) => {
                this.pulsoidConnectionState.innerText = Freakylay.DataTransfer.Pulsoid.ConnectionState[state];
            });

            this.checkPulsoidFeedType(this.config.pulsoid.type.Value, true);

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

            this.onGameConnectionChange.register((con: BaseConnection) => {
                if (this.onGameConnectionChange.OldValue != null) {
                    this.onGameConnectionChange.OldValue.disconnect();
                    this.onGameConnectionChange.OldValue.onUnregister();
                }
                this.gameConnectionSetting.removeChildren();
                if (con == null) {
                    return;
                }
                if (this.config.connection.Value != con.getName()) {
                    this.config.connection.Value = con.getName();
                    this.generateUrlText();
                }
                con.loadConfig(this.config.connectionSetting);
                if (con.supportsCustomIp()) {
                    let input = document.create('input') as HTMLInputElement;
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
                    this.gameConnectionSetting.append(line);
                }
                if (con.supportsCustomPort()) {
                    // todo :: this
                }
                con.displayConnectionSettings(this.gameConnectionSetting, this, this.config);
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
                document.headline('Looks'),
                this.booleanSettingLine('display short modifier names', this.config.looks.shortModifierNames),
                this.booleanSettingLine('show previous map key', this.config.looks.showPreviousKey),
                this.booleanSettingLine('show miss/bad hit counter', this.config.looks.showMissCounter),
                this.booleanSettingLine('show BPM', this.config.looks.showBpm),
                this.booleanSettingLine('show block speed', this.config.looks.showBlockSpeed),
                this.booleanSettingLine('show combo', this.config.looks.showCombo),
                this.booleanSettingLine('hide full combo info', this.config.looks.hideFullComboModifier),
                this.booleanSettingLine('hide default difficulty if difficulty has custom name', this.config.looks.hideDefaultDifficultyOnCustomDifficulty),
                this.booleanSettingLine('hide complete modifier section', this.config.looks.hideAllModifiers),
                this.booleanSettingLine('hide complete counter section', this.config.looks.hideCounterSection),
                this.booleanSettingLine('hide complete song info section', this.config.looks.hideSongInfo),
                this.booleanSettingLine('time circle matches other circles', this.config.looks.timeCircleLikeOtherCircles),
                this.booleanSettingLine('show if map is ranked', this.config.looks.showRanked),
                this.booleanSettingLine('show ranked star/difficulty info', this.config.looks.showStars),
                this.booleanSettingLine('show rank behind the accuracy circle', this.config.looks.showAccuracyRank),
                this.rangeSetting('border radius', this.config.looks.borderRadius, 0, 20, 1),
                this.dropDownSetting(
                    'override background color with map color',
                    [
                        this.createOptionForSelect(0, 'No override', this.config.looks.useMapColorForBackgroundColor.Value == 0),
                        this.createOptionForSelect(1, 'Use left color', this.config.looks.useMapColorForBackgroundColor.Value == 1),
                        this.createOptionForSelect(2, 'Use right color', this.config.looks.useMapColorForBackgroundColor.Value == 2),
                    ],
                    (newValue: string) => {
                        this.config.looks.useMapColorForBackgroundColor.Value = parseInt(newValue);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                this.dropDownSetting(
                    'override text color with map color',
                    [
                        this.createOptionForSelect(0, 'No override', this.config.looks.useMapColorForTextColor.Value == 0),
                        this.createOptionForSelect(1, 'Use left color', this.config.looks.useMapColorForTextColor.Value == 1),
                        this.createOptionForSelect(2, 'Use right color', this.config.looks.useMapColorForTextColor.Value == 2)
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
                document.headline('Misc'),
                this.dropDownSetting(
                    'compare score with last score',
                    [
                        this.createOptionForSelect(0, 'do not compare', this.config.looks.compareWithPreviousScore.Value == 0),
                        this.createOptionForSelect(1, 'legacy - Freakylay 2 Arrow', this.config.looks.compareWithPreviousScore.Value == 1),
                        this.createOptionForSelect(2, 'use offset', this.config.looks.compareWithPreviousScore.Value == 2)
                    ],
                    (value: string) => {
                        this.config.looks.compareWithPreviousScore.Value = parseInt(value);
                    }
                ),
                this.booleanSettingLine('show song speed as relative values (-20% instead of 80%)', this.config.looks.speedDisplayRelative),
                this.booleanSettingLine('test with background image', this.backgroundImageTest),
                document.headline('Info'),
                info
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
         * builds pulsoid tab, see pulsoid config and data classes for more information
         * @private
         */
        private buildPulsoidTab(): void {
            let selector = document.getId<HTMLSelectElement>('pulsoidFeedType');

            Freakylay.DataTransfer.Pulsoid.FeedType.foreach((value: string) => {
                if (!isNaN(Number(value))) {
                    return;
                }

                selector.append(this.createOptionForSelect(
                    value,
                    value + (value == 'JSON' ? ' (deprecated)' : ''),
                    Freakylay.DataTransfer.Pulsoid.FeedType[value] == this.config.pulsoid.type.Value
                ));
            });

            selector.onchange = () => {
                this.checkPulsoidFeedType(Freakylay.DataTransfer.Pulsoid.FeedType[selector.value], false);
            };

            let feedInput = document.getId<HTMLInputElement>('pulsoidFeed');
            feedInput.value = this.config.pulsoid.tokenOrUrl.Value;

            document.getId<HTMLInputElement>('pulsoidFeedButton').onclick = () => {
                this.config.pulsoid.tokenOrUrl.Value = feedInput.value;
                this.config.pulsoid.type.Value = Freakylay.DataTransfer.Pulsoid.FeedType[selector.value];

                this.generateUrlText();
            }

            let url = new URL('https://pulsoid.net/oauth2/authorize');

            url.searchParams.append('response_type', 'token');
            url.searchParams.append('redirect_uri', '');
            url.searchParams.append('scope', 'data:heart_rate:read');
            url.searchParams.append('state', 'a52beaeb-c491-4cd3-b915-16fed71e17a8');
            url.searchParams.append('response_mode', 'web_page');
            url.searchParams.append('client_id', 'a5cd6120-1f13-4a74-9bb9-1183523517aa');

            document.getId<HTMLButtonElement>('pulsoidAuthLink').onclick = () => {
                window.open(url, '_blank');
            };

            let settings = document.getDiv('pulsoidSettingList');
            settings.append(
                this.booleanSettingLine('use dynamic max bpm', this.config.pulsoid.useDynamicBpm),
                this.numberSettingLine('maximum bpm to display (affects circle)', this.config.pulsoid.maxStaticBpm, 30, 500, 1)
            );
        }

        /**
         * checks feedtype and enables or disables specific functions for pulsoid settings
         * @param type
         * @param firstStart
         * @private
         */
        private checkPulsoidFeedType(type: FeedType, firstStart: boolean): void {
            switch (type) {
                case Freakylay.DataTransfer.Pulsoid.FeedType.Disabled:
                    this.pulsoidFeedText.innerText = 'URL or token';

                    this.pulsoidFeedInput.disabled = true;

                    this.pulsoidHintToken.display(false);
                    this.pulsoidHintJson.display(false);
                    break;
                case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                    this.pulsoidFeedText.innerText = 'JSON URL';

                    if (!firstStart) {
                        this.pulsoidFeedInput.value = '';
                    }

                    this.pulsoidFeedInput.disabled = false;
                    this.pulsoidFeedInput.type = 'text';

                    this.pulsoidHintToken.display(false);
                    this.pulsoidHintJson.display(true);
                    break;
                case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                    this.pulsoidFeedText.innerText = 'Token';

                    if (!firstStart) {
                        this.pulsoidFeedInput.value = '';
                    }

                    this.pulsoidFeedInput.disabled = false;
                    this.pulsoidFeedInput.type = 'password';

                    this.pulsoidHintToken.display(true);
                    this.pulsoidHintJson.display(false);
                    break;
            }
            this.pulsoidFeedText.innerText += ':';
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
        private dropDownSetting(name: string, valueArray: HTMLOptionElement[], changeCallback: (value: string) => void): HTMLDivElement {
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
                    this.logger.log('nani????');
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
                    this.logger.log('nani con????');
                }
            };

            this.gameList.forEach((game: BaseGame) => {
                let name = game.getName();
                this.gameListElement.append(this.createOptionForSelect(name, name, name == this.config.game.Value));
            });

            this.gameConnectionSetting = document.getDiv('gameConnectionSetting');
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
        private rangeSetting(name: string, property: EventProperty<number>, min: number, max: number, step: number): HTMLDivElement {
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
            this.applyGameButton.disabled = this.onGameChange.Value != null && this.onGameConnectionChange.Value != null;
        }
    }
}