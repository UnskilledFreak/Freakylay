///<reference path="../../Internal/EventProperty.ts"/>
///<reference path="../../DataTransfer/WebSocket/WebSocketConnection.ts"/>
///<reference path="../BaseConnection.ts"/>
namespace Freakylay.Game.BeatSaber {
    import WebSocketConnection = Freakylay.DataTransfer.WebSocket.WebSocketConnection;
    import EventProperty = Freakylay.Internal.EventProperty;
    import ConfigHelper = Freakylay.Ui.ConfigHelper;
    import Config = Freakylay.Internal.Config.Config;

    /**
     * abstract DataPuller class because there are breaking changes between version 2.0.12 and 2.1.0
     */
    export abstract class AbstractDataPuller extends BaseConnection {
        protected connection: WebSocketConnection = null;
        protected author: string;
        protected songSubName: string;
        protected difficulty: string;
        protected customDifficulty: string;
        protected score: number;
        protected maxScore: number;
        // workaround vars for bugs in DataPuller 2.0.12 (never fixed) and 2.1.0 (not fixed yet)
        protected lastCombo: number; // combo will not get reset on bad cut
        protected lastMiss: number;
        protected missOffset: number; // miss will not get incremented on bad cut
        protected lostFullCombo: boolean;

        private readonly onUseScoreWithMultipliers: EventProperty<boolean>;

        protected constructor(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>) {
            super(gameLinkStatus);
            // todo :: check plugin version return on connect to auto-select correct connection?
            // todo :: this would also mean that both versions would share the same file... hm...
            // todo :: let me think about this...
            this.author = '';
            this.songSubName = '';
            this.difficulty = '';
            this.customDifficulty = '';
            this.lastCombo = 0;
            this.lastMiss = 0;
            this.missOffset = 0;
            this.lostFullCombo = false;

            this.score = 0;
            this.maxScore = 0;

            this.onUseScoreWithMultipliers = new EventProperty<boolean>(false);

            this.port = 2946;
        }

        /**
         * event handler for map data
         * @param data
         * @protected
         */
        protected abstract handleMapData(data: {}): void;

        /**
         * event handler for modifiers
         * @param data
         * @protected
         */
        protected abstract handleModifiers(data: {}): void;

        /**
         * event handler for practice mode modifiers
         * @param data
         * @protected
         */
        protected abstract handlePracticeModifiers(data: {}): void;

        /**
         * DataPuller supports custom IP
         */
        public supportsCustomIp(): boolean {
            return true;
        }

        /**
         * DataPuller does not support custom port
         */
        public supportsCustomPort(): boolean {
            return false;
        }

        /**
         * tries to connect to DataPuller mod
         */
        public connect(): boolean {
            this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connecting;
            this.connection = new WebSocketConnection(this.ip, this.port);
            this.connection.addEndpoint('BSDataPuller/LiveData', (a) => {
                this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connected;
                this.handleLiveDataValid(a);
            }, true);
            this.connection.addEndpoint('BSDataPuller/MapData', (a) => {
                this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connected;
                this.handleMapDataValid(a);
            }, true);
            this.isConnected = this.connection.isConnected();
            return this.isConnected;
        }

        /**
         * disconnects from the mod
         */
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

        /**
         * tries to reconnect
         */
        public reconnect(): boolean {
            this.disconnect();
            return this.connect();
        }

        /**
         * displays additional setting and registers the event to the connection only settings
         * @param settingsTab
         * @param helper
         * @param config
         */
        public displayConnectionSettings(settingsTab: HTMLDivElement, helper: ConfigHelper, config: Config): void {
            settingsTab.append(
                helper.booleanSettingLine('use ScoreWithMultipliers', this.onUseScoreWithMultipliers)
            );

            this.onUseScoreWithMultipliers.register(() => {
                helper.generateUrlText();
            });
        }

        /**
         * unregisters everything, what displayConnectionSettings registers
         */
        public onUnregister(): void {
            this.onUseScoreWithMultipliers.unregister();
        }

        /**
         * loads DataPuller config
         * @param data
         */
        public loadConfig(data: any): void {
            this.ip = data.isset('a', '127.0.0.1');
            this.onUseScoreWithMultipliers.Value = data.isset('b', false);
        }

        /**
         * returns DataPuller config
         */
        public saveConfig(): any {
            return {
                a: this.ip,
                b: this.onUseScoreWithMultipliers.Value
            };
        }

        /**
         * will generate correct author line to use as text
         * @protected
         */
        protected getCompleteAuthorLine(): string {
            if (this.songSubName.length > 0) {
                return this.author + ' - ' + this.songSubName;
            }

            return this.author;
        }

        /**
         * returns score without or with modifiers
         * @protected
         */
        protected sendCorrectScore(): void {
            this.onScoreChange.Value = this.onUseScoreWithMultipliers.Value ? this.maxScore : this.score;
        }

        /**
         * event handler for live data
         * includes a workaround fix for a bug in DataPuller 2.0.12 and 2.1.0
         * @param data
         * @protected
         */
        protected handleLiveDataValid(data: {}): void {
            this.score = data.isset('Score', 0);
            this.maxScore = data.isset('ScoreWithMultipliers', 0);
            this.sendCorrectScore();
            // no MaxScore
            // no MaxScoreWithMultipliers
            this.onRankChange.Value = data.isset('Rank', 'F');

            // fix missing full combo break and miss increment on bad cut on DataPuller 2.0.12 & 2.1.0
            let misses = data.isset('Misses', 0);
            let combo = data.isset('Combo', 0);
            if (this.lastCombo > combo) {
                this.onFullComboChange.Value = false;
                this.lostFullCombo = true;
                // check here because it could also be a miss which is captured by DataPuller
                if (misses == this.lastMiss) {
                    this.missOffset++;
                }
            } else if (!this.lostFullCombo) {
                this.onFullComboChange.Value = data.isset('FullCombo', false);
            }
            this.lastCombo = combo;
            this.lastMiss = misses;
            this.onComboChange.Value = combo;
            this.onMissChange.Value = misses + this.missOffset;
            // end fix

            this.onAccuracyChange.Value = data.isset('Accuracy', 0);
            // no BlockHitScore
            this.onHealthChange.Value = data.isset('PlayerHealth', 0);
            this.onTimeElapsedChange.Value = data.isset('TimeElapsed', 0);
            // no unixTimestamp
        }

        /**
         * event handler for map data
         * @param data
         * @private
         */
        private handleMapDataValid(data: {}): void {
            let inLevel = data.isset('InLevel', false);
            let levelFinished = data.isset('LevelFinished', false);
            let levelFailed = data.isset('LevelFailed', false);
            let levelQuit = data.isset('LevelQuit', false);

            if (inLevel || levelFailed || levelQuit || levelFinished) {
                this.missOffset = 0;
                this.lostFullCombo = false;
                this.lastMiss = 0;
                this.lastCombo = 0;
            }

            this.onLevelChange.Value = inLevel;
            this.onLevelPausedChange.Value = data.isset('LevelPaused', false);
            this.onLevelFinishedChange.Value = levelFinished;
            this.onLevelFailedChange.Value = levelFailed;
            this.onLevelQuitChange.Value = levelQuit;
            // no Hash
            this.onSongInfoSongNameChange.Value = data.isset('SongName', '???');
            this.songSubName = data.isset('SongSubName', '');
            this.author = data.isset('SongAuthor', '');
            this.onSongInfoSongAuthorChange.Value = this.getCompleteAuthorLine();
            this.onSongInfoMapperNameChange.Value = data.isset('Mapper', '');
            this.onKeyChange.Value = data.isset('BSRKey', '');
            this.onPreviousKeyChange.Value = data.isset('PreviousKey', '');
            // no MapType
            this.onSongInfoDifficultyChange.Value = data.isset('Difficulty', 'ExpertPlus');
            this.onSongInfoCustomDifficultyChange.Value = data.isset('CustomDifficultyLabel', '');
            this.onBpmChange.Value = data.isset('BPM', 0);
            this.onBlockSpeedChange.Value = data.isset('NJS', 0);
            this.onPracticeModeChange.Value = data.isset('PracticeMode', false);
            this.onPerformancePointsChange.Value = data.isset('PP', 0);
            this.onStarChange.Value = data.isset('Star', 0);
            // no GameVersion
            // no PluginVersion
            this.onMultiplayerChange.Value = data.isset('IsMultiplayer', false);
            this.onPreviousScoreChange.Value = data.isset('PreviousRecord', 0);
            this.onPreviousKeyChange.Value = data.isset('PreviousBSR', '');
            // no unixTimestamp
            // no ModifiersMultiplier
            this.handleMapData(data);
            this.handleModifiers(data.isset('Modifiers', {}))
            this.handlePracticeModifiers(data.isset('PracticeModeModifiers', {}));
        }
    }
}