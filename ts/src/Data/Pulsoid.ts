namespace Freakylay.Data {

    import Helper = Freakylay.Internal.Helper;

    export class Pulsoid {

        public static EVENT = 'pulsoid';

        private url: string;
        private lastCheck: Date;

        constructor() {
            this.url = '';
            this.lastCheck = new Date();
        }

        public setUrl(url: string): void {
            this.url = url.trim().replace(/ /g, '');
        }

        public start(): void {
            this.pulsoidData();
        }

        public isInitialized(): boolean {
            return this.url.length > 0;
        }

        private pulsoidData(): void {
            if (!this.isInitialized()) {
                console.log('pulsoid not initialized');
                this.fetchFeed(10000);
                return;
            }

            window.dispatchEvent(new CustomEvent(Pulsoid.EVENT, {detail: 123}));
            this.fetchFeed();
            /*
            let request = new XMLHttpRequest();

            request.onreadystatechange = (ev: Event) => {
                if (request.readyState != 4) {
                    return;
                }
                console.log(request);
                let data = JSON.parse(request.responseText);
                let measured = new Date(data.measured_at);

                if (measured >= this.lastCheck) {
                    window.dispatchEvent(new CustomEvent(Pulsoid.EVENT, {detail: data.bpm}))
                    this.lastCheck = measured;
                }

                this.fetchFeed();
            };

            request.open('GET', this.url, true);

            //request.setRequestHeader('Access-Control-Allow-Origin', '*');
            //request.setRequestHeader('Origin', window.location.href);
            request.setRequestHeader('Accept', 'application/json');

            request.send(null);
            */
        }

        private fetchFeed(timeout: number = 1000): void {
            window.setTimeout(() => {
                this.pulsoidData();
            }, 1000);
        }
    }

}