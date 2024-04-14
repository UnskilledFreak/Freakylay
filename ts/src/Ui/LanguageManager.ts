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
        }
    }
}