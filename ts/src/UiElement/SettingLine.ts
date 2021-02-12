/// <reference path="../Internal/Helper.ts" />

namespace Freakylay.UiElement {
    import Helper = Freakylay.Internal.Helper;
    import UrlParam = Freakylay.Internal.UrlParam;

    export class SettingLine {

        static index = 0;
        private readonly element: HTMLInputElement;
        private readonly setting: UrlParam<boolean>;

        constructor(name: string, setting: UrlParam<boolean> = null, directCallback: (bool) => void = null) {
            let line = Helper.create('div') as HTMLDivElement;
            let label = Helper.create('label') as HTMLLabelElement;

            this.element = Helper.create('input') as HTMLInputElement;
            this.setting = setting;

            label.htmlFor = 'input_' + SettingLine.index;
            label.innerHTML = name;
            this.element.id = label.htmlFor;
            this.element.type = 'checkbox';

            if (directCallback == null) {
                this.element.checked = this.setting.getValue();
            }

            this.element.onclick = (e) => {
                let checked = !!(e.target as HTMLInputElement).checked;
                if (directCallback != null && typeof directCallback == 'function') {
                    directCallback(checked);
                } else {
                    this.setting.setValue(checked);
                }
                ui.onStyleChange();
            }

            line.append(this.element, label);
            ui.optionsLinesElement.append(line);

            SettingLine.index++;
        }
    }
}