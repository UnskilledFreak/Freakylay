///<reference path="../Internal/EventProperty.ts"/>
///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import Config = Freakylay.Internal.Config.Config;
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;
    import FeedType = Freakylay.DataTransfer.Pulsoid.FeedType;
    import Logger = Freakylay.Internal.Logger;

    /**
     * helper for config <-> option panel
     * is used as an interface between option panel (UI) and config values
     */
    export class ConfigHelper {

        public optionsOpen: EventProperty<boolean>;

        private readonly logger: Logger;
        private config: Config;
        private options: HTMLDivElement;
        private urlText: HTMLTextAreaElement;

        private backgroundColorInput: ColorInput;
        private textColorInput: ColorInput;

        // pulsoid
        private pulsoidFeedText: HTMLLabelElement;
        private pulsoidFeedInput: HTMLInputElement;
        private pulsoidHintJson: HTMLDivElement;
        private pulsoidHintToken: HTMLDivElement;

        private readonly backgroundImageTest: EventProperty<boolean>;

        constructor(config: Config) {
            this.logger = new Logger('ConfigHelper');
            this.optionsOpen = new EventProperty<boolean>(false);
            this.config = config;
            this.urlText = document.get<HTMLTextAreaElement>('#urlText');
            this.backgroundImageTest = new EventProperty<boolean>(false);

            let version = 'Freakylay ' + Overlay.Version + (Overlay.IsAlpha ? ' Alpha' : '');;

            document.getId<HTMLDivElement>('copyright').innerText = version;
            document.getId<HTMLSpanElement>('welcomeVersion').innerText = version;
            document.getId<HTMLDivElement>('songInfo').ondblclick = () => {
                this.toggleOptionPanel();
            }

            if (Overlay.IsAlpha) {
                let alphaWarning = document.getId<HTMLDivElement>('alphaWarning');
                alphaWarning.innerText = version + ' - early testing version';
            }

            //this.buildGameTab();
            this.buildColorTab();
            this.buildSettingsTab();
            this.buildPulsoidTab();

            this.backgroundImageTest.register((enabled: boolean) => {
                document.body.toggleClassByValue(enabled, 'test');
            });

            // pulsoid
            this.pulsoidFeedText = document.getId<HTMLLabelElement>('pulsoidFeedUrlText');
            this.pulsoidFeedInput = document.getId<HTMLInputElement>('pulsoidFeed');
            this.pulsoidHintJson = document.getId<HTMLDivElement>('pulsoidHintJson');
            this.pulsoidHintToken = document.getId<HTMLDivElement>('pulsoidHintToken');

            this.config.pulsoid.type.register((type: FeedType) => {
                switch (type) {
                    case Freakylay.DataTransfer.Pulsoid.FeedType.Disabled:
                        this.pulsoidFeedText.innerText = 'URL or token';

                        this.pulsoidFeedInput.disabled = true;

                        this.pulsoidHintToken.display(false);
                        this.pulsoidHintJson.display(false);
                        break;
                    case Freakylay.DataTransfer.Pulsoid.FeedType.JSON:
                        this.pulsoidFeedText.innerText = 'JSON URL';

                        this.pulsoidFeedInput.value = '';
                        this.pulsoidFeedInput.disabled = false;
                        this.pulsoidFeedInput.type = 'text';

                        this.pulsoidHintToken.display(false);
                        this.pulsoidHintJson.display(true);
                        break;
                    case Freakylay.DataTransfer.Pulsoid.FeedType.Token:
                        this.pulsoidFeedText.innerText = 'Token';

                        this.pulsoidFeedInput.value = '';
                        this.pulsoidFeedInput.disabled = false;
                        this.pulsoidFeedInput.type = 'password';

                        this.pulsoidHintToken.display(true);
                        this.pulsoidHintJson.display(false);
                        break;
                }
                this.pulsoidFeedText.innerText += ':';
            });
        }

        /**
         * generates url safe string to paste into streaming software/browser sources
         */
        public generateUrlText(): void {
            let url = window.location.origin + window.location.pathname + '?';
            /*
            if (this.optionsOpen) {
                url += 'options&'
            }
            */
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
            this.backgroundColorInput.createInputMenu(document.getId<HTMLDivElement>('bgColor'));
            this.textColorInput.createInputMenu(document.getId<HTMLDivElement>('color'));

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
                this.booleanSettingLine('show if map ranked', this.config.looks.showRanked),
                this.booleanSettingLine('show ranked star info', this.config.looks.showStars),
                this.booleanSettingLine('show rank behind the accuracy circle', this.config.looks.showAccuracyRank),
                this.dropDownSetting(
                    'override background color with map color',
                    [
                        this.createOptionForSelect(0, 'No override'),
                        this.createOptionForSelect(1, 'Use left color'),
                        this.createOptionForSelect(2, 'Use right color'),
                    ],
                    (newValue: string) => {
                        //this.logger.log('bg: ' + newValue);
                        this.config.looks.useMapColorForBackgroundColor.Value = parseInt(newValue);
                        //this.logger.log(this.config.looks.useMapColorForBackgroundColor.Value);
                        this.checkUserOverrideColorSetting(colorInfo, defaultColorInfoText);
                    }
                ),
                this.dropDownSetting(
                    'override text color with map color',
                    [
                        this.createOptionForSelect(0, 'No override'),
                        this.createOptionForSelect(1, 'Use left color'),
                        this.createOptionForSelect(2, 'Use right color'),
                    ],
                    (newValue: string) => {
                        //this.logger.log('t:' + newValue);
                        this.config.looks.useMapColorForTextColor.Value = parseInt(newValue);
                        //this.logger.log(this.config.looks.useMapColorForTextColor.Value);
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
                        this.createOptionForSelect(0, 'do not compare'),
                        this.createOptionForSelect(1, 'legacy - Freakylay 2 Arrow'),
                        this.createOptionForSelect(2, 'use offset')
                    ],
                    (value: string) => {
                        this.config.looks.compareWithPreviousScore.Value = parseInt(value);
                        //this.logger.log('cwps: ' + this.config.looks.compareWithPreviousScore.Value);
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
                //this.logger.log('nope');
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

                selector.append(this.createOptionForSelect(value, value + (value == 'JSON' ? ' (deprecated)' : '')));
            });

            selector.onchange = () => {
                // not sure why I have to use full qualifier name here, but it won't work otherwise
                // this is because the use of enum's
                this.config.pulsoid.type.Value = Freakylay.DataTransfer.Pulsoid.FeedType[selector.value];
            };

            let feedInput = document.getId<HTMLInputElement>('pulsoidFeed');

            document.getId<HTMLInputElement>('pulsoidFeedButton').onclick = () => {
                this.config.pulsoid.tokenOrUrl.Value = feedInput.value;
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
        }

        /**
         * helper function to create ease html option elemeents
         * @param value
         * @param text
         * @private
         */
        private createOptionForSelect<T>(value: T, text?: string): HTMLOptionElement {
            let option = document.create<HTMLOptionElement>('option');
            option.value = value.toString();
            option.innerText = text == null ? value.toString() : text;
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
         * helper to generate a UI line for specific setting
         * @param name
         * @param property
         * @private
         */
        private booleanSettingLine(name: string, property: EventProperty<boolean>): HTMLDivElement {
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
    }
}