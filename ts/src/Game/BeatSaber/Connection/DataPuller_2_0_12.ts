///<reference path="../../BaseConnection.ts"/>
///<reference path="../../../DataTransfer/WebSocket/WebSocketConnection.ts"/>
namespace Freakylay.Game.BeatSaber.Connection {
    import WebSocketConnection = Freakylay.DataTransfer.WebSocket.WebSocketConnection;
    import ConfigHelper = Freakylay.Ui.ConfigHelper;

    export class DataPuller_2_0_12 extends BaseConnection {

        private connection: WebSocketConnection = null;
        private author: string;
        private songSubName: string;
        private difficulty: string;
        private customDifficulty: string;

        constructor() {
            super();

            this.author = '';
            this.songSubName = '';
            this.difficulty = '';
            this.customDifficulty = '';

            this.port = 2946;
        }

        public getName(): string {
            return 'DataPuller 2.0.12';
        }

        public connect(): boolean {
            this.connection = new WebSocketConnection(this.ip, this.port);
            this.connection.addEndpoint('BSDataPuller/LiveData', this.handleLiveData);
            this.connection.addEndpoint('BSDataPuller/MapData', this.handleMapData);
            this.isConnected = true;
            return true;
        }

        public disconnect(): boolean {
            this.isConnected = false;
            if (this.connection != null) {
                this.connection.disconnect();
                this.connection = null;
                return true;
            }
            return false;
        }

        public reconnect(): boolean {
            this.disconnect();
            this.connect();
            return false;
        }

        public displayConnectionSettings(settingsTab: HTMLDivElement, helper: ConfigHelper): void {
            settingsTab.append()
        }

        public loadConfig(data: any): void {
            this.ip = data.isset('a', '127.0.0.1');
        }

        public saveConfig(): any {
            return {
                a: this.ip
            };
        }

        protected setCompatibility(): void {
            this.compatibility.supportsPlayerColorsUsage = false;
        }

        private getCompleteAuthorLine(): string {
            if (this.songSubName.length > 0) {
                return this.author + ' - ' + this.songSubName;
            }

            return this.author;
        }

        public handleMapData(data): void {
            this.onLevelChange.Value = (data.isset('InLevel', false));
            this.onLevelPausedChange.Value = data.isset('LevelPaused', false);
            this.onLevelFinishedChange.Value = data.isset('LevelFinished', false);
            this.onLevelFailedChange.Value = data.isset('LevelFailed', false);
            this.onLevelQuitChange.Value = data.isset('LevelQuit', false);
            this.onSongInfoSongNameChange.Value = data.isset('SongName', '???');
            this.songSubName = data.isset('SongSubName', '');
            this.author = data.isset('SongAuthor', '');
            this.onSongInfoSongAuthorChange.Value = this.getCompleteAuthorLine();
            this.onSongInfoMapperNameChange.Value = data.isset('Mapper', '');
            this.onKeyChange.Value = data.isset('BSRKey', 'BSRKey');
            //this.onPreviousKeyChange.Value = this.onKeyChange.Value;
            this.onPreviousKeyChange.Value = data.isset('PreviousKey', 'previous key');
            this.onSongInfoCoverImageChange.Value = data.isset('coverImage', 'img/BS_Logo.jpg');
            this.onTimeLengthChange.Value = data.isset('Length', 60);
            this.onTimeScaleChange.Value = data.isset('TimeScale', 0);
            // no MapType
            this.onSongInfoDifficultyChange.Value = data.isset('Difficulty', 'ExpertPlus');
            this.onSongInfoCustomDifficultyChange.Value = data.isset('CustomDifficultyLabel', 'Freaky!');
            this.onBpmChange.Value = data.isset('BPM', 0);
            this.onBlockSpeedChange.Value = data.isset('NJS', 0);
            let modifiers = data.isset('Modifiers', {});
            this.onModifierNoFailChange.Value = modifiers.isset('noFailOn0Energy', false);
            this.onModifierOneLifeChange.Value = modifiers.isset('oneLife', false);
            this.onModifierFourLivesChange.Value = modifiers.isset('fourLives', false);
            this.onModifierNoBombsChange.Value = modifiers.isset('noBombs', false);
            this.onModifierNoWallsChange.Value = modifiers.isset('noWalls', false);
            this.onModifierNoArrowsChange.Value = modifiers.isset('noArrows', false);
            this.onModifierGhostNotesChange.Value = modifiers.isset('ghostNotes', false);
            this.onModifierDisappearingArrowsChange.Value = modifiers.isset('disappearingArrows', false);
            this.onModifierSmallNotesChange.Value = modifiers.isset('smallNotes', false);
            this.onModifierProModeChange.Value = modifiers.isset('proMode', false);
            this.onModifierStrictAnglesChange.Value = modifiers.isset('strictAngles', false);
            this.onModifierZenModeChange.Value = modifiers.isset('zenMode', false);
            this.onModifierSlowerSongChange.Value = modifiers.isset('slowerSong', false);
            this.onModifierFasterSongChange.Value = modifiers.isset('fasterSong', false);
            this.onModifierSuperFastSongChange.Value = modifiers.isset('superFastSong', false);
            // no ModifiersMultiplier
            this.onPracticeModeChange.Value = data.isset('PracticeMode', false);
            let practiceData = data.isset('PracticeModeModifiers', {});
            this.onPracticeModeSpeedChange.Value = practiceData.isset('songSpeedMul', 1);
            this.onPerformancePointsChange.Value = data.isset('PP', 0);
            this.onStarChange.Value = data.isset('Star', 0);
            this.onMultiplayerChange.Value = data.isset('IsMultiplayer', 0);
            this.onPreviousScoreChange.Value = data.isset('PreviousRecord', '');
            this.onPreviousKeyChange.Value = data.isset('PreviousBSR', '');
            // no unixTimestamp
        }

        public handleLiveData(data): void {
            this.onScoreChange.Value = data.isset('Score', 0);
            // no ScoreWithMultipliers
            // no MaxScore
            // no MaxScoreWithMultipliers
            this.onRankChange.Value = data.isset('Rank', 'F');
            this.onFullComboChange.Value = data.isset('FullCombo', false);
            this.onComboChange.Value = data.isset('Combo', 0);
            this.onMissChange.Value = data.isset('Misses', 0);
            this.onAccuracyChange.Value = data.isset('Accuracy', 0);
            // no BlockHitScore
            this.onHealthChange.Value = data.isset('Health', 0);
            this.onTimeElapsedChange.Value = data.isset('TimeElapsed', 0);
            // no unixTimestamp
        }

        public testMapData(): void {
            this.handleMapData({
                'GameVersion': '1.24.1',
                'PluginVersion': '2.0.12.0',
                'InLevel': true,
                'LevelPaused': false,
                'LevelFinished': false,
                'LevelFailed': true,
                'LevelQuit': false,
                'Hash': '7F226AA6B106C9A0DBC0E183222C70D5FE7A5CFE',
                'SongName': 'Ne! Ko!',
                'SongSubName': '',
                'SongAuthor': 'Takamori Natsumi, Sendai Eri, Asakawa Yuu, Tanezaki Atsumi',
                'Mapper': 'OreoZe',
                'BSRKey': '565f',
                'coverImage': 'https://eu.cdn.beatsaver.com/7f226aa6b106c9a0dbc0e183222c70d5fe7a5cfe.jpg',
                'Length': 51,
                'TimeScale': 0.0,
                'MapType': 'Standard',
                'Difficulty': 'Hard',
                'CustomDifficultyLabel': 'Expert',
                'BPM': 182,
                'NJS': 14.399999618530274,
                'Modifiers': {
                    'noFailOn0Energy': false,
                    'oneLife': false,
                    'fourLives': false,
                    'noBombs': false,
                    'noWalls': false,
                    'noArrows': false,
                    'ghostNotes': true,
                    'disappearingArrows': false,
                    'smallNotes': false,
                    'proMode': false,
                    'strictAngles': false,
                    'zenMode': false,
                    'slowerSong': false,
                    'fasterSong': false,
                    'superFastSong': false
                },
                'ModifiersMultiplier': 1.0,
                'PracticeMode': false,
                'PracticeModeModifiers': {
                    'songSpeedMul': 1.0,
                    'startInAdvanceAndClearNotes': 0.0,
                    'startSongTime': 0.0
                },
                'PP': 0.0,
                'Star': 0.0,
                'IsMultiplayer': false,
                'PreviousRecord': 254941,
                'PreviousBSR': null,
                'unixTimestamp': 1662375408171
            });
        }

        public testLiveData(): void {
            this.handleLiveData({
                'Score': 1234,
                'ScoreWithMultipliers': 0,
                'MaxScore': 0,
                'MaxScoreWithMultipliers': 0,
                'Rank': 'E',
                'FullCombo': false,
                'Combo': 4,
                'Misses': 4,
                'Accuracy': 0.0,
                'BlockHitScore': [
                    0,
                    0,
                    0
                ],
                'PlayerHealth': 100.0,
                'ColorType': 0,
                'TimeElapsed': 6,
                'unixTimestamp': 1662375499415,
                'EventTrigger': 0
            });
        }
    }
}