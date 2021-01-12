import {MultiConnection} from "./MultiConnection";
import {LiveData} from "./LiveData";
import {StaticData} from "./StaticData";
import {UI} from "./UI";

let connection;
let ui;

window.onload = () => {
    console.log('If you don\'t have the BSDataPuller mod then download the latest release from here and place it in your BS mods folder: https://github.com/kOFReadie/DataPuller/releases/latest');

    ui = new UI();
    ui.init();
    ui.buildOptionsPanel();

    connection = new MultiConnection(ui.options.ip, 2946);
    connection.addEndpoint('BSDataPuller/LiveData', (data) => {
        //console.log(data);
        data = new LiveData(data);
        ui.updateLive(data);
    });
    connection.addEndpoint('BSDataPuller/StaticData', (data) => {
        //console.log(data);
        data = new StaticData(data);
        ui.updateStatic(data);
    });

    ui.ipText.value = connection.getUrl(true);
}