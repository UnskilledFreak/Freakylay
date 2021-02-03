let connection: Freakylay.Connector.MultiConnection;
let ui: Freakylay.UI;

window.onload = () => {
    console.log('If you don\'t have the BSDataPuller mod then download the latest release from here and place it in your BS mods folder: https://github.com/kOFReadie/DataPuller/releases/latest');

    ui = new Freakylay.UI();

    connection = new Freakylay.Connector.MultiConnection(ui.options.ip, 2946);
    connection.addEndpoint('BSDataPuller/LiveData', (data) => {
        ui.updateLive(data);
    });
    connection.addEndpoint('BSDataPuller/MapData', (data) => {
        ui.updateMap(data);
    });

    ui.ipText.value = connection.getUrl(true);
}