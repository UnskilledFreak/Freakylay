///<reference path="../../Internal/EventProperty.ts"/>
///<reference path="../../DataTransfer/WebSocket/WebSocketConnection.ts"/>
///<reference path="../BaseConnection.ts"/>
namespace Freakylay.Game.BeatSaber {
    import WebSocketConnection = Freakylay.DataTransfer.WebSocket.WebSocketConnection;
    import EventProperty = Freakylay.Internal.EventProperty;
    import ConfigHelper = Freakylay.Ui.ConfigHelper;
    import Config = Freakylay.Internal.Config.Config;

    export abstract class AbstractDataPuller extends BaseConnection {
        protected connection: WebSocketConnection = null;
        protected author: string;
        protected songSubName: string;
        protected difficulty: string;
        protected customDifficulty: string;
        protected linkStatus: EventProperty<GameLinkStatus>;
        protected score: number;
        protected maxScore: number;
        // workaround vars for bugs in DataPuller 2.0.12 (never fixed) and 2.1.0 (not fixed yet)
        protected lastCombo: number; // combo will not get reset on bad cut
        protected missOffset: number; // miss will not get incremented on bad cut
        protected lostFullCombo: boolean;

        private readonly onUseScoreWithMultipliers: EventProperty<boolean>;

        protected constructor() {
            super();

            this.author = '';
            this.songSubName = '';
            this.difficulty = '';
            this.customDifficulty = '';
            this.lastCombo = 0;
            this.missOffset = 0;
            this.lostFullCombo = false;

            this.score = 0;
            this.maxScore = 0;

            this.onUseScoreWithMultipliers = new EventProperty<boolean>(false);

            this.port = 2946;
        }

        public abstract handleMapData(data: {}): void;

        public abstract handleLiveData(data: {}): void;

        public supportsCustomIp(): boolean {
            return true;
        }

        public supportsCustomPort(): boolean {
            return false;
        }

        public connect(gameLinkStatus: EventProperty<GameLinkStatus>): boolean {
            this.linkStatus = gameLinkStatus;
            this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connecting;
            this.connection = new WebSocketConnection(this.ip, this.port);
            this.connection.addEndpoint('BSDataPuller/LiveData', (a) => {
                this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connected;
                this.handleLiveData(a);
            }, true);
            this.connection.addEndpoint('BSDataPuller/MapData', (a) => {
                this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connected;
                this.handleMapData(a);
            }, true);
            this.isConnected = this.connection.isConnected();
            return this.isConnected;
        }

        public disconnect(): boolean {
            this.isConnected = false;
            this.linkStatus.Value = Freakylay.Game.GameLinkStatus.NotConnected;
            if (this.connection != null) {
                this.connection.disconnect();
                this.connection = null;
                return true;
            }
            return false;
        }

        public reconnect(): boolean {
            this.disconnect();
            this.connect(this.linkStatus);
            return false;
        }

        public displayConnectionSettings(settingsTab: HTMLDivElement, helper: ConfigHelper, config: Config): void {
            settingsTab.append(
                helper.booleanSettingLine('use ScoreWithMultipliers', this.onUseScoreWithMultipliers)
            );

            this.onUseScoreWithMultipliers.register(() => {
                helper.generateUrlText();
            });
        }

        public onUnregister(): void {
            this.onUseScoreWithMultipliers.unregister();
        }

        public loadConfig(data: any): void {
            this.ip = data.isset('a', '127.0.0.1');
            this.onUseScoreWithMultipliers.Value = data.isset('b', false);
        }

        public saveConfig(): any {
            return {
                a: this.ip,
                b: this.onUseScoreWithMultipliers.Value
            };
        }

        protected getCompleteAuthorLine(): string {
            if (this.songSubName.length > 0) {
                return this.author + ' - ' + this.songSubName;
            }

            return this.author;
        }

        protected sendCorrectScore(): void {
            this.onScoreChange.Value = this.onUseScoreWithMultipliers.Value ? this.maxScore : this.score;
            console.log(this.score, this.maxScore, this.onUseScoreWithMultipliers.Value);
        }
    }
}