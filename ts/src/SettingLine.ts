import {Helper} from "./Helper";
import {UI} from "./UI";

declare var ui: UI;

export class SettingLine {

    static index = 0;
    private element: HTMLInputElement;

    constructor(name: string, setting: any, isDirectCallback: boolean = false) {
        let line = Helper.create('div') as HTMLDivElement;
        let label = Helper.create('label') as HTMLLabelElement;
        this.element = Helper.create('input') as HTMLInputElement;

        label.htmlFor = 'input_' + SettingLine.index;
        label.innerHTML = name;
        this.element.id = label.htmlFor;
        this.element.type = 'checkbox';

        if (!isDirectCallback) {
            this.element.checked = ui.options[setting];
        }

        this.element.onclick = (e) => {
            let checked = !!(e.target as HTMLInputElement).checked;
            if (isDirectCallback) {
                setting(checked);
            } else {
                ui.options[setting] = checked;
            }
            ui.appendNewStyles();
        }

        line.append(this.element, label);
        ui.optionsLinesElement.append(line);

        SettingLine.index++;
    }
}