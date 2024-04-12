///<reference path="../AbstractDataPuller.ts"/>
namespace Freakylay.Game.BeatSaber.Connection {
    import Config = Freakylay.Internal.Config.Config;
    import LanguageManager = Freakylay.Ui.LanguageManager;

    export class DataPuller_2_1_0 extends AbstractDataPuller {
        constructor(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>, config: Config, languageManager: LanguageManager) {
            super(gameLinkStatus, config, languageManager);
        }

        /**
         * returns unique name of the connection
         */
        public getName(): string {
            return 'DataPuller 2.1.0+';
        }

        /**
         * changes compatibility
         * @protected
         */
        protected setCompatibility(): void {
            this.compatibility.supportsPlayerColorsUsage = false;
        }

        /**
         * event handler for map data since DataPuller 2.1.0
         * @param data
         * @protected
         */
        protected handleMapData(data: {}): void {
            this.onSongInfoCoverImageChange.Value = data.isset('CoverImage', 'img/BS_Logo.jpg');
            this.onTimeLengthChange.Value = data.isset('Duration', 60);
        }

        /**
         * event handler for modifiers sinde DataPuller 2.1.0
         * @param data
         * @protected
         */
        protected handleModifiers(data: {}): void {
            this.onModifierNoFailChange.Value = data.isset('NoFailOn0Energy', false);
            this.onModifierOneLifeChange.Value = data.isset('OneLife', false);
            this.onModifierFourLivesChange.Value = data.isset('FourLives', false);
            this.onModifierNoBombsChange.Value = data.isset('NoBombs', false);
            this.onModifierNoWallsChange.Value = data.isset('NoWalls', false);
            this.onModifierNoArrowsChange.Value = data.isset('NoArrows', false);
            this.onModifierGhostNotesChange.Value = data.isset('GhostNotes', false);
            this.onModifierDisappearingArrowsChange.Value = data.isset('DisappearingArrows', false);
            this.onModifierSmallNotesChange.Value = data.isset('SmallNotes', false);
            this.onModifierProModeChange.Value = data.isset('ProMode', false);
            this.onModifierStrictAnglesChange.Value = data.isset('StrictAngles', false);
            this.onModifierZenModeChange.Value = data.isset('ZenMode', false);
            this.onModifierSlowerSongChange.Value = data.isset('SlowerSong', false);
            this.onModifierFasterSongChange.Value = data.isset('FasterSong', false);
            this.onModifierSuperFastSongChange.Value = data.isset('SuperFastSong', false);
        }

        /**
         * event handler for practice mode modifiers since DataPuller 2.1.0
         * @param data
         * @protected
         */
        protected handlePracticeModifiers(data: {}): void {
            this.onPracticeModeSpeedChange.Value = data.isset('SongSpeedMul', 1);
            // no StartInAdvanceAndClearNotes
            this.onPracticeModeTimeOffset.Value = Math.floor(data.isset('SongStartTime', 0));
        }

        /**
         * test map data
         */
        public testMapData(): void {
            this.handleMapDataValid({
                'GameVersion': '1.24.1',
                'PluginVersion': '2.1.0',
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
                'CoverImage': 'https://eu.cdn.beatsaver.com/7f226aa6b106c9a0dbc0e183222c70d5fe7a5cfe.jpg',
                'Length': 51,
                'TimeScale': 0.0,
                'MapType': 'Standard',
                'Difficulty': 'Hard',
                'CustomDifficultyLabel': 'Expert',
                'BPM': 182,
                'NJS': 14.399999618530274,
                'Modifiers': {
                    'NoFailOn0Energy': false,
                    'OneLife': false,
                    'FourLives': false,
                    'NoBombs': false,
                    'NoWalls': false,
                    'NoArrows': false,
                    'GhostNotes': true,
                    'DisappearingArrows': false,
                    'SmallNotes': false,
                    'ProMode': false,
                    'StrictAngles': false,
                    'ZenMode': false,
                    'SlowerSong': false,
                    'FasterSong': false,
                    'SuperFastSong': false
                },
                'ModifiersMultiplier': 1.0,
                'PracticeMode': false,
                'PracticeModeModifiers': {
                    'SongSpeedMul': 1.0,
                    'StartInAdvanceAndClearNotes': 0.0,
                    'StartSongTime': 0.0
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
                'Score': 1234,
                'ScoreWithMultipliers': 0,
                'MaxScore': 0,
                'MaxScoreWithMultipliers': 0,
                'Rank': 'E',
                'FullCombo': false,
                'Combo': 4,
                'Misses': 4,
                'Accuracy': 95.0,
                'BlockHitScore': [
                    0,
                    0,
                    0
                ],
                'PlayerHealth': 75.0,
                'ColorType': 0,
                'TimeElapsed': 6,
                'unixTimestamp': 1662375499415,
                'EventTrigger': 0
            });
        }
    }
}