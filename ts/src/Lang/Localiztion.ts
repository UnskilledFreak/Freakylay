namespace Freakylay.Lang {
    export class Localization {
        public localization_text: Object;

        constructor(language: Languages) {
            if (language !== null)
            {
                this.import(language);
            }
        }

        public import(language: Languages): Object {
            switch (language){
                case Languages.en:
                    this.localization_text = new Localization_en().getData();
                    break;
                case Languages.zh_cn:
                    this.localization_text = new Localization_zh_cn().getData();
                    break;
            }
            return this.localization_text;
        }

        public getLocalizedText(id: string): any {
            if (this.localization_text === null || this.localization_text === undefined)
            {
                console.log(this.localization_text);
                return "";
            }
            return this.localization_text.hasOwnProperty(id) ? this.localization_text[id] : "";
        }
    }
}