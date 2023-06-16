namespace Freakylay.Lang {
    export enum Languages {
        en = 'English',
        zh_cn = '简体中文'
    }

    export function GetDefaultLanguage() {
        switch (navigator.language) {
            case "zh":
            case "zh-Hans":
            case "zh-CN":
                return "zh_cn";
            case "en":
            default:
                return "en";
        }
    }
}