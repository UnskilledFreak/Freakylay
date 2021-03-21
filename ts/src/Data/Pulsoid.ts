namespace Freakylay.Data {

    import Helper = Freakylay.Internal.Helper;

    export class Pulsoid {

        public static EVENT = 'pulsoid';

        private url: string;
        private lastCheck: Date;

        constructor() {
            this.url = '';
        }

        public setUrl(url: string): void {
            this.url = url.trim().replace(/ /g, '');

            if (this.url == '') {
                this.sendEvent(0);
                return;
            }

            this.pulsoidData();
        }

        public getUrl(): string {
            return this.url;
        }

        public start(): void {
            this.lastCheck = new Date();
            window.setInterval(() => {
                this.pulsoidData();
            }, 1000);
        }

        public isInitialized(): boolean {
            return this.url.length > 0;
        }

        private sendEvent(bpm: number): void {
            // check again to prevent back enabling
            window.dispatchEvent(new CustomEvent(Pulsoid.EVENT, {detail: this.isInitialized() ? bpm : 0}))
        }

        private pulsoidData(): void {
            if (!this.isInitialized()) {
                return;
            }

            let request = new XMLHttpRequest();

            request.onreadystatechange = () => {
                if (request.readyState != 4) {
                    return;
                }

                let data = JSON.parse(request.responseText);
                let measured = new Date(Helper.isset(data, 'measured_at', (new Date()).toString()));
                let bpm = parseInt(Helper.isset(data, 'bpm', '0'));

                if (measured >= this.lastCheck) {
                    this.sendEvent(bpm);
                    this.lastCheck = measured;
                }
            };

            // im so sorry to bypass CORS with this little hack but idk how to get CORS done via a local running script
            request.open('GET', 'http://u.unskilledfreak.zone/overlay/freakylay/pulsoid.php?pFeed=' + this.url, true);
            request.setRequestHeader('Accept', 'application/json');
            request.send(null);
        }
    }

}