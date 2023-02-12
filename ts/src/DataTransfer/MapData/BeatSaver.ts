namespace Freakylay.DataTransfer.MapData {
    export class BeatSaver {
        public requestKeyFromMapHash(hash: string, callback: (string) => void): void {
            let request = new XMLHttpRequest();
            request.open('GET', 'https://api.beatsaver.com/maps/hash/' + hash, true);
            request.setRequestHeader('Accept', 'application/json');
            request.onreadystatechange = () => {
                if (request.readyState != 4) {
                    callback('');
                    return;
                }

                let data = JSON.parse(request.responseText);
                callback(data.isset('id', ''))
            }
            request.send(null);
        }
    }
}