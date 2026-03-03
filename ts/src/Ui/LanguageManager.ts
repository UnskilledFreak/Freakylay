///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import Languages = Freakylay.Ui.Languages;
    import Logger = Freakylay.Internal.Logger;
    import Config = Freakylay.Internal.Config.Config;

    /**
     * localisation manager
     */
    export class LanguageManager {

        private logger: Logger;
        private currentLanguage: Languages;
        private currentLanguageObject: Object;
        private config: Config;

        /**
         * @constructor
         */
        constructor(config: Config) {
            this.logger = new Logger('LanguageManager');
            this.config = config;
            this.import(this.getDefaultLanguage());
        }

        /**
         * loads the selected language file
         * @param language
         */
        public import(language: Languages): void {
            this.currentLanguage = language;
            switch (this.currentLanguage) {
                case Freakylay.Ui.Languages.de:
                    this.loadData('de');
                    break;
                case Freakylay.Ui.Languages.es:
                    this.loadData('es');
                    break;
                default:
                case Freakylay.Ui.Languages.en:
                    this.loadData('en');
                    break;
                case Freakylay.Ui.Languages.zh_cn:
                    this.loadData('zh_cn');
                    break;
            }
        }

        /**
         * gets the current langauge in use by the browser or from config if it exists
         */
        public getDefaultLanguage() {
            let lang = this.config.language.Value == '' ? navigator.language.toLowerCase() : this.config.language.Value;
            switch (lang) {
                case 'de':
                case 'de-de':
                case 'de-at':
                case 'de-ch':
                    return Freakylay.Ui.Languages.de;
                case 'es':
                    return Freakylay.Ui.Languages.es;
                case 'zh':
                case 'zh-hans':
                case 'zh-cn':
                    return Freakylay.Ui.Languages.zh_cn;
                default:
                    return Freakylay.Ui.Languages.en;
            }
        }

        /**
         * gets a translated string from the given localisation id
         * @param id
         */
        public getLocalizedText(id: string): any {
            if (this.currentLanguageObject === null || this.currentLanguageObject === undefined) {
                this.logger.log('unable to get localized text for id: ' + id);
                return '';
            }
            return this.currentLanguageObject.hasOwnProperty(id) ? this.currentLanguageObject[id] : '';
        }

        /**
         * refreshes the whole UI, only needed when a language change was made
         * @param fullVersionString
         */
        public refreshLanguage(fullVersionString: string): void {
            let meta = document.getElementsByTagName("meta");
            let targetDom: HTMLElement;
            Object.keys(this.currentLanguageObject).forEach(key => {
                let value = this.currentLanguageObject[key];
                if (typeof (value) === "string") {
                    switch (key) {
                        case 'html_head_title':
                            for (let i = 0; i < meta.length; i++) {
                                if (meta[i].name.toLowerCase() == "title" || meta[i].name.toLowerCase() == "og:title") {
                                    meta[i].content = value;
                                }
                            }
                            return;
                        case 'html_meta_description':
                            for (let i = 0; i < meta.length; i++) {
                                if (meta[i].name.toLowerCase() == "description" || meta[i].name.toLowerCase() == "og:description") {
                                    meta[i].content = value;
                                }
                            }
                            return;
                        case 'languageListTranslatorLabel':
                            targetDom = document.getId<HTMLElement>(key);
                            targetDom.innerHTML = value;
                            return;
                        case 'heartRateFeedUrlText':
                            targetDom = document.getId<HTMLElement>("heartRateFeedUrlText");
                            let selectDom = document.getId<HTMLSelectElement>("heartRateFeedType");
                            switch (selectDom.value) {
                                case "Token":
                                    value = this.getLocalizedText('heartRateFeedTextToken');
                                    break;
                                case "JSON":
                                    value = this.getLocalizedText('heartRateFeedTextJSON');
                                    break;
                                case "Dummy":
                                    value = this.getLocalizedText('heartRateFeedTextDummy');
                                    break;
                                default:
                                    value = this.getLocalizedText('heartRateFeedTextDisabled');
                                    break;
                            }
                            targetDom.innerText = value;
                            return;
                        case 'alphaInfo':
                        case 'colorInputsTempPrefetch':
                        case 'colorBackgroundColor':
                        case 'colorTextColor':
                            let classElements = document.getElementsByClassName(key);
                            for (let i = 0; i < classElements.length; i++) {
                                classElements[i].textContent = value;
                            }
                            return;
                        case 'colorInputsRed':
                        case 'colorInputsGreen':
                        case 'colorInputsBlue':
                        case 'colorInputsAlpha':
                            let targets = document.getElementsByClassName(key);
                            for (let i = 0; i < targets.length; i++) {
                                if (targets[i].tagName.toLowerCase() != 'label') {
                                    continue;
                                }
                                (targets[i] as HTMLLabelElement).innerText = value + ': ';
                            }
                            return;
                        default:
                            targetDom = document.getId<HTMLElement>(key);
                            if (targetDom === null || targetDom === undefined) {
                                return;
                            }
                            if (targetDom.tagName === 'button') {
                                targetDom = targetDom as HTMLButtonElement;
                                targetDom.textContent = value;
                            } else if (targetDom.classList.contains('rangeSettingLine')) {
                                let input_value: string;
                                let idx = -1;
                                for (let i = 0; i < targetDom.children.length; i++) {
                                    if (targetDom.children[i].tagName.toLowerCase() === 'input') {
                                        input_value = (targetDom.children[i] as HTMLInputElement).value;
                                    } else if (targetDom.children[i].tagName.toLowerCase() === 'span') {
                                        idx = i;
                                    }
                                }
                                if (idx !== -1) {
                                    targetDom.children[idx].textContent = input_value + ' - ' + value;
                                }
                            } else {
                                targetDom.innerText = value;
                            }
                            return;
                    }
                } else {
                    let new_value = "";
                    targetDom = document.getId<HTMLElement>(key);

                    if (targetDom === null) {
                        return;
                    }

                    switch (key) {
                        case 'welcomeVersion':
                            new_value = fullVersionString;
                            break;
                        case 'gameLinkStatus':
                        case 'heartRateConnectionState':
                            if (value.hasOwnProperty(targetDom.innerText)) {
                                new_value = value[targetDom.innerText];
                            }
                            break;
                        case 'gameList':
                        case 'connectionList':
                        case 'heartRateFeedType':
                            targetDom = document.getDiv(key);
                            for (let i = 0; i < targetDom.children.length; i++) {
                                let target_option = targetDom.children.item(i) as HTMLOptionElement;
                                if (value.hasOwnProperty(target_option.value)) {
                                    target_option.text = value[target_option.value];
                                }
                            }
                            return;
                        default:
                            targetDom = document.getId<HTMLElement>(key);
                            if (targetDom === null || targetDom === undefined) {
                                return;
                            }
                            if (targetDom.classList.contains('dropDownSettingLine')) {
                                for (let i = 0; i < targetDom.children.length; i++) {
                                    if (targetDom.children[i].tagName.toLowerCase() === 'select') {
                                        for (let j = 0; j < (targetDom.children[i] as HTMLSelectElement).length; j++) {
                                            targetDom.children[i][j].textContent = value['options'][(targetDom.children[i][j] as HTMLOptionElement).value.toString()];
                                        }
                                    } else if (targetDom.children[i].tagName.toLowerCase() === 'span') {
                                        targetDom.children[i].textContent = value['label'];
                                    }
                                }
                                return;
                            }
                            break;
                    }

                    targetDom.innerText = new_value;
                }
            });
        }

        /**
         * tries to load translation data from a json file
         * @param lang
         * @private
         */
        private loadData(lang: string): void {
            try {
                let request = new XMLHttpRequest();
                request.open('GET', 'language/' + lang + '.json', false);
                request.overrideMimeType('application/json');
                request.send();

                if (request.status == 200 && request.readyState == 4) {
                    this.currentLanguageObject = JSON.parse(request.responseText);
                    return;
                }
                this.logger.log('couldn\'t load language file? meow?');
                this.logger.log(request.status);
                this.logger.log(request.readyState);
            } catch {
                this.currentLanguageObject = this.engDefault;
                this.logger.log('couldn\'t load language file? meow? falling back to default');
            }
        }

        private engDefault = {
            "html_head_title": "Freakylay - stream overlay for multiple games",
            "html_meta_description": "An easy to use and customizable overlay with many features like colors, circular bars and many more.",
            "previousBSRLabel": "PREVIOUS BSR",
            "bsr": "BSR",
            "mapper": "MAPPER",
            "marqueeDifficulty": "DIFFICULTY",
            "marqueeSongArtist": "ARTIST",
            "marqueeSongName": "SONGNAME SONGNAME SONGNAME SONGNAME SONGNAME SONGNAME",
            "fullComboLabel": "Full Combo",
            "rankedLabel": "Ranked",
            "starsLabel": "Stars ",
            "comboLabel": "Combo",
            "missLabel": "Miss",
            "score": "SCORE",
            "njsLabel": "NJS",
            "bpmLabel": "BPM",
            "HealthLabel": {
                "before": "Health",
                "after": "%"
            },
            "AccuracyLabel": {
                "before": "Accuracy",
                "after": "%"
            },
            "timeLabel": {
                "circle": {
                    "before": "Time<br>",
                    "after": ""
                },
                "notCircle": {
                    "before": "",
                    "middle": "<br>",
                    "after": ""
                }
            },
            "practiceMode": "Practice Mode",
            "practiceModeShort": "PM",
            "practiceModeSongSpeed": "Speed: 100%",
            "practiceModeSongSpeedLabel": {
                "before": "Speed: ",
                "after": "%"
            },
            "practiceModeTimeOffset": "Start: 0%",
            "practiceModeTimeOffsetLabel": {
                "before": "Start: ",
                "after": ""
            },
            "practiceModeSpacer": "",
            "noFailOn0Energy": "No Fail",
            "oneLife": "One Life",
            "fourLives": "Four Lives",
            "noBombs": "No Bombs",
            "noWalls": "No Walls",
            "noArrows": "No Arrows",
            "ghostNotes": "Ghost Notes",
            "disappearingArrows": "Disappearing Arrows",
            "smallNotes": "Small Notes",
            "proMode": "Pro Mode",
            "strictAngles": "Strict Angles",
            "zenMode": "Zen Mode",
            "slowerSong": "Slower Song",
            "fasterSong": "Faster Song",
            "superFastSong": "Super Fast Song",
            "noFailOn0EnergyShort": "NF",
            "oneLifeShort": "1L",
            "fourLivesShort": "4L",
            "noBombsShort": "NB",
            "noWallsShort": "NW",
            "noArrowsShort": "NA",
            "ghostNotesShort": "GN",
            "disappearingArrowsShort": "DA",
            "smallNotesShort": "SN",
            "proModeShort": "PRO",
            "strictAnglesShort": "SA",
            "zenModeShort": "ZM",
            "slowerSongShort": "SS",
            "fasterSongShort": "FS",
            "superFastSongShort": "SFS",
            "tabs-Welcome": "Welcome",
            "tabs-Game-Connection": "Game & Connection",
            "tabs-Colors": "Colors",
            "tabs-Settings": "Settings",
            "tabs-HeartRate": "Heart Rate",

            "welcomeLine1-1": "Welcome to ",
            "welcomeVersion": {
                "before": "Freakylay ",
                "after": ""
            },
            "welcomeLine1-2": "!",
            "welcomeLine2": "Please use 'Game & Connection' tab first to choose the correct game and mod you are using.",
            "welcomeLine3": "Version 3 was completely overhauled under its hood with focus of supporting multiple games and mods while still containing a bunch of useful features for content creators.",
            "welcomeLine4-1": "If you have any suggestions, issues or need help, let me know at ",
            "welcomeLine4-2": "Github issues",
            "welcomeLine4-3": ". Please provide as many infos as you can like what game and connection was in use and what went wrong.",
            "welcomeLine5": "Thanks! UnskilledFreak",
            "languageListLabel": "🌐Language:",
            "languageListTranslatorLabel": "Translator: <a target=\"_blank\" href=\"https://github.com/UnskilledFreak\">UnskilledFreak</a>",
            "gameLinkStatusLabel": "Status:",
            "gameLinkStatus": {
                "Not Connected": "Not Connected",
                "Connecting...": "Connecting...",
                "Connected!": "Connected!"
            },
            "gameLinkStatusNotice": "If this stays at 'Connecting...' for more than 20 seconds that means that something went wrong. Check the settings if any and make sure your game is running and mods are working.",
            "gameListLabel": "Select game:",
            "gameList": {
                "None": "choose",
                "Beat Saber": "Beat Saber"
            },
            "connectionListLabel": "Connection:",
            "connectionList": {
                "None": "choose",
                "DataPuller_2_0_12": "DataPuller 2.0.12",
                "DataPuller_2_1_0": "DataPuller 2.1.0+",
                "HttpSiraStatus_9_0_1": "Http(Sira)Status 9.0.1+"
            },
            "connectionUseScoreWithMultipliers": "use ScoreWithMultipliers",
            "connectionIP": "IP: ",
            "connectionPort": "Port: ",
            "connectToGame": "Connect!",
            "colorManagement": "Color management",
            "colorBackgroundColor": "Background color",
            "colorTextColor": "Text color",
            "colorRandomBackgroundColor": "Random background color",
            "colorInputsRed": "Red",
            "colorInputsGreen": "Green",
            "colorInputsBlue": "Blue",
            "colorInputsAlpha": "Alpha",
            "alphaInfo": "Not recommended but might work great ;)",
            "colorRandomTextColor": "Random text color",
            "defaultColorInfoText": "It will not change the alpha channel, only RGB will get used!",
            "UserOverrideColorSetting": " ....... this does not make any sense at all to set both to the same color...",
            "settingsBanner": "Please note: Not all settings are supported by the selected game or connection.",
            "settingsLooks": "Looks",
            "settingsLooksDisplayShortModifierNames": "display short modifier names",
            "settingsLooksShowPreviousMapKey": "show previous map key (DataPuller)",
            "settingsLooksShowMissBadHitCounter": "show miss/bad hit counter",
            "settingsLooksShowBPM": "show BPM",
            "settingsLooksShowBlockSpeed": "show block speed",
            "settingsLooksShowCombo": "show combo",
            "settingsLooksHideFullComboInfo": "hide full combo info",
            "settingsLooksHideDefaultDifficultyIfDifficultyHasCustomName": "hide default difficulty if difficulty has custom name (DataPuller)",
            "settingsLooksHideCompleteModifierSection": "hide complete modifier section",
            "settingsLooksHideCompleteCounterSection": "hide complete counter section",
            "settingsLooksHideCompleteSongInfoSection": "hide complete song info section",
            "settingsLooksTimeCircleMatchesOtherCircles": "time circle matches other circles",
            "settingsLooksShowIfMapIsRanked": "show if map is ranked (DataPuller)",
            "settingsLooksShowRankedStarDifficultyInfo": "show ranked star/difficulty info (DataPuller)",
            "settingsLooksShowRankBehindTheAccuracyCircle": "show rank behind the accuracy circle",
            "settingsLooksBorderRadius": "border radius",
            "settingsLooksOverrideBackgroundColorWithMapColor": {
                "label": "override background color with map color (HttpSiraStatus)",
                "options": {
                    "0": "No override",
                    "1": "Use left environment color",
                    "2": "Use right environment color",
                    "3": "Use obstacle color",
                    "4": "Use wall color (only Sira!)",
                    "5": "Use left saber color",
                    "6": "Use right saber color"
                }
            },
            "settingsLooksOverrideTextColorWithMapColor": {
                "label": "override text color with map color (HttpSiraStatus)",
                "options": {
                    "0": "No override",
                    "1": "Use left environment color",
                    "2": "Use right environment color",
                    "3": "Use obstacle color",
                    "4": "Use wall color (only Sira!)",
                    "5": "Use left saber color",
                    "6": "Use right saber color"
                }
            },
            "settingsPositions": "Positions",
            "settingsPositionsMoveSongInfoToRightSide": "move song info to left side",
            "settingsPositionsMoveSongInfoToTop": "move song into to top",
            "settingsPositionsMoveCounterSectionToTop": "move counter section to top",
            "settingsPositionsMoveModifiersToRightSide": "move modifiers to left side",
            "settingsPositionsMargin": "margin",
            "settingsMisc": "Misc",
            "settingsMiscCompareScoreWithLastScore": {
                "label": "compare score with last score (DataPuller)",
                "options": {
                    "0": "do not compare",
                    "1": "legacy - Freakylay 2 Arrow",
                    "2": "use offset"
                }
            },
            "settingsMiscAnimateScoreIncrement": "animate score increment",
            "settingsMiscShowSongSpeedAsRelativeValues": "show song speed as relative values (-20% instead of 80%)",
            "settingsMiscTestWithBackgroundImage": "test with background image",
            "heartRateConnectionType": "Connection type",
            "heartRateConnectionStateLabel": "Connection state: ",
            "heartRateConnectionState": {
                "Ready": "Ready",
                "Fetching": "Fetching",
                "Error": "Error",
                "NotConnected": "NotConnected"
            },
            "heartRateFeedButton": "Apply",
            "heartRateFeedTypeLabel": "Feed type:",
            "heartRateFeedType": {
                "Disabled": "Disabled",
                "Token": "Pulsoid",
                "HypeRate": "HypeRate"
            },
            "heartRateHintPulsoid-1": "Get or refresh Token ",
            "heartRateAuthLink": "here",
            "heartRateHintPulsoid-2": ".\nPaste generated token into the input field above.",
            "heartRateHintSession": "Paste your Session-ID given by the app.",
            "heartRateFeedUrlText": "URL or token",
            "heartRateFeedTextDisabled": "URL or token",
            "heartRateFeedTextJSON": "JSON URL",
            "heartRateFeedTextToken": "Token",
            "heartRateFeedTextDummy": "Token",
            "heartRateFeedTextDummyValue": "not needed =)",
            "heartRateFeedTextHypeRate": "Session-ID",
            "pulsoidThanks": "Special thanks to the Pulsoid team for making this possible!",
            "hypeRateThanks": "Special thanks to the HypeRate team for making this possible!",
            "heartRateCircleBarLabel": {
                "before": "Heart<br>",
                "after": ""
            },
            "heartRateOffsetHint": "If it does not show up, it might be out of bounds. Try adjusting the offset values and make sure the connection is in fetching state.",
            "heartRatePullInfo": "A higher number means more data to show, lower will show a more fast paced graph. Normally a bpm event is received about every second but it can vary.",
            "heartRateSettingsUseDynamicMaxBPM": "use dynamic max bpm",
            "heartRateSettingsMaximumBPMToDisplay": "maximum bpm to display (affects circle)",
            "heartRateSettingsGraph": "Graph",
            "heartRateSettingsDisplayGraph": "display graph",
            "heartRateSettingsUseBackground": "use background",
            "heartRateSettingsStrokeLineWithBackgroundColorInNoBackgroundMode": "stroke line with background color in no background mode",
            "heartRateSettingsGraphWidth": "width",
            "heartRateSettingsGraphHeight": "height",
            "heartRateSettingsDisableCircleBarInCounterSection": "disable circle bar in counter section",
            "heartRateSettingsDisplayNumbers": "display numbers",
            "heartRateSettingsDisplayNumbersMaxBpm": "display maximum BPM",
            "heartRateSettingsDisplayNumbersMinBPM": "display minimum BPM",
            "heartRateSettingsDisplayNumbersCurrentBPMLeft": "display left current BPM",
            "heartRateSettingsDisplayNumbersCurrentBPMRight": "display right current BPM",
            "heartRateSettingsFontSizeForMinAndMaxBPM": "font size for min and max bpm",
            "heartRateSettingsFontSizeForCurrentBPM": "font size for current bpm",
            "heartRateSettingsAnchor": {
                "label": "anchor",
                "options": {
                    "0": "top left",
                    "1": "top right",
                    "2": "bottom left",
                    "3": "bottom right",
                    "4": "center screen"
                }
            },
            "heartRateSettingsOffsetX": "offset X",
            "heartRateSettingsOffsetY": "offset Y",
            "heartRateSettingsEventsToShow": "events to show",
            "settings": "Settings",
            "urlTextLabel": "URL to use:",
            "huh": "Who needs a fancy settings panel when it's not visible for 99.9% of usage time?",
            "copyright": "Freakylay",
            "versionHint1": "Welcome & sorry to bother!",
            "versionHint2-1": "You are using an old config for Freakylay.<br>This is the new version ",
            "versionHint2-2": "!",
            "versionHint3": "While the new version is compatible with the old one's config, you have to change the game and connection in the options panel.",
            "versionHint4": "Please use the button bellow to open the option panel and make additional changes!",
            "versionHintOptions": "Open Options",
            "versionWarning": "Freakylay"
        };
    }
}