///<reference path="../AbstractDataPuller.ts"/>
namespace Freakylay.Game.BeatSaber.Connection {
    import Config = Freakylay.Internal.Config.Config;

    export class DataPuller_2_0_12 extends AbstractDataPuller {
        constructor(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>, config: Config) {
            super(gameLinkStatus, config);
        }

        /**
         * returns unique name of the connection
         */
        public getName(): string {
            return 'DataPuller 2.0.12';
        }

        /**
         * changes compatibility
         * @protected
         */
        protected setCompatibility(): void {
            this.compatibility.supportsPlayerColorsUsage = false;
        }

        /**
         * event handler for map data for DataPuller 2.0.12 and earlier
         * @param data
         * @protected
         */
        protected handleMapData(data: {}): void {
            this.onSongInfoCoverImageChange.Value = data.isset('coverImage', 'img/BS_Logo.jpg');
            this.onTimeLengthChange.Value = data.isset('Length', 60);
        }

        /**
         * event handler for modifiers for DataPuller 2.0.12 and earlier
         * @param data
         * @protected
         */
        protected handleModifiers(data: {}) {
            this.onModifierNoFailChange.Value = data.isset('noFailOn0Energy', false);
            this.onModifierOneLifeChange.Value = data.isset('oneLife', false);
            this.onModifierFourLivesChange.Value = data.isset('fourLives', false);
            this.onModifierNoBombsChange.Value = data.isset('noBombs', false);
            this.onModifierNoWallsChange.Value = data.isset('noWalls', false);
            this.onModifierNoArrowsChange.Value = data.isset('noArrows', false);
            this.onModifierGhostNotesChange.Value = data.isset('ghostNotes', false);
            this.onModifierDisappearingArrowsChange.Value = data.isset('disappearingArrows', false);
            this.onModifierSmallNotesChange.Value = data.isset('smallNotes', false);
            this.onModifierProModeChange.Value = data.isset('proMode', false);
            this.onModifierStrictAnglesChange.Value = data.isset('strictAngles', false);
            this.onModifierZenModeChange.Value = data.isset('zenMode', false);
            this.onModifierSlowerSongChange.Value = data.isset('slowerSong', false);
            this.onModifierFasterSongChange.Value = data.isset('fasterSong', false);
            this.onModifierSuperFastSongChange.Value = data.isset('superFastSong', false);
        }

        /**
         * event handler for practice mode modifiers for DataPuller 2.0.12 and earlier
         * @param data
         * @protected
         */
        protected handlePracticeModifiers(data: {}) {
            this.onPracticeModeSpeedChange.Value = data.isset('songSpeedMul', 1);
            this.onPracticeModeTimeOffset.Value = Math.floor(data.isset('startSongTime', 0));
        }

        /**
         * test map data
         * @param isPause
         */
        public testMapData(isPause: boolean): void {
            this.handleMapData({
                'GameVersion': '1.24.1',
                'PluginVersion': '2.0.12.0',
                'InLevel': true,
                'LevelPaused': isPause,
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

        /**
         * test live data
         */
        public testLiveData(): void {
            this.handleLiveDataValid({
                'Score': 99999999,
                'ScoreWithMultipliers': 8888888,
                'MaxScore': 0,
                'MaxScoreWithMultipliers': 0,
                'Rank': 'E',
                'FullCombo': false,
                'Combo': 8888,
                'Misses': 9999,
                'Accuracy': 95.0,
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