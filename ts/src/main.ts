let connection: Freakylay.MultiConnection;
let ui: Freakylay.UI;

window.onload = () => {
    console.log('If you don\'t have the BSDataPuller mod then download the latest release from here and place it in your BS mods folder: https://github.com/kOFReadie/DataPuller/releases/latest');

    ui = new Freakylay.UI();
    ui.init();
    ui.buildOptionsPanel();

    connection = new Freakylay.MultiConnection(ui.options.ip, 2946);
    connection.addEndpoint('BSDataPuller/LiveData', (data) => {
        //console.log(data);
        data = new Freakylay.LiveData(data);
        ui.updateLive(data);
    });
    connection.addEndpoint('BSDataPuller/StaticData', (data) => {
        //console.log(data);
        data = new Freakylay.StaticData(data);
        ui.updateStatic(data);
    });

    ui.ipText.value = connection.getUrl(true);
}