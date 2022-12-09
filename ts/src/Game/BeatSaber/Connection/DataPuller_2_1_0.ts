///<reference path="../AbstractDataPuller.ts"/>
namespace Freakylay.Game.BeatSaber.Connection {

    export class DataPuller_2_1_0 extends AbstractDataPuller {
        constructor() {
            super();
        }

        public getName(): string {
            return 'DataPuller 2.1.0 (WIP)';
        }

        protected setCompatibility(): void {
            this.compatibility.supportsPlayerColorsUsage = false;
        }

        public handleMapData(data: {}): void {
            let inLevel = data.isset('InLevel', false);
            let levelFinished = data.isset('LevelFinished', false);
            let levelFailed = data.isset('LevelFailed', false);
            let levelQuit = data.isset('LevelQuit', false);

            if (inLevel || levelFailed || levelQuit || levelFinished) {
                this.missOffset = 0;
                this.lostFullCombo = false;
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
            this.onPreviousKeyChange.Value = data.isset('PreviousKey', 'previous key');
            this.onSongInfoCoverImageChange.Value = data.isset('coverImage', 'img/BS_Logo.jpg');
            this.onTimeLengthChange.Value = data.isset('Duration', 60);
            //this.onTimeScaleChange.Value = data.isset('TimeScale', 0);
            // no MapType
            this.onSongInfoDifficultyChange.Value = data.isset('Difficulty', 'ExpertPlus');
            this.onSongInfoCustomDifficultyChange.Value = data.isset('CustomDifficultyLabel', '');
            this.onBpmChange.Value = data.isset('BPM', 0);
            this.onBlockSpeedChange.Value = data.isset('NJS', 0);
            let modifiers = data.isset('Modifiers', {});
            this.onModifierNoFailChange.Value = modifiers.isset('NoFailOn0Energy', false);
            this.onModifierOneLifeChange.Value = modifiers.isset('OneLife', false);
            this.onModifierFourLivesChange.Value = modifiers.isset('FourLives', false);
            this.onModifierNoBombsChange.Value = modifiers.isset('NoBombs', false);
            this.onModifierNoWallsChange.Value = modifiers.isset('NoWalls', false);
            this.onModifierNoArrowsChange.Value = modifiers.isset('NoArrows', false);
            this.onModifierGhostNotesChange.Value = modifiers.isset('GhostNotes', false);
            this.onModifierDisappearingArrowsChange.Value = modifiers.isset('DisappearingArrows', false);
            this.onModifierSmallNotesChange.Value = modifiers.isset('SmallNotes', false);
            this.onModifierProModeChange.Value = modifiers.isset('ProMode', false);
            this.onModifierStrictAnglesChange.Value = modifiers.isset('StrictAngles', false);
            this.onModifierZenModeChange.Value = modifiers.isset('ZenMode', false);
            this.onModifierSlowerSongChange.Value = modifiers.isset('SlowerSong', false);
            this.onModifierFasterSongChange.Value = modifiers.isset('FasterSong', false);
            this.onModifierSuperFastSongChange.Value = modifiers.isset('SuperFastSong', false);
            // no ModifiersMultiplier
            this.onPracticeModeChange.Value = data.isset('PracticeMode', false);
            let practiceData = data.isset('PracticeModeModifiers', {});
            this.onPracticeModeSpeedChange.Value = practiceData.isset('songSpeedMul', 1);
            // no StartInAdvanceAndClearNotes
            this.onPracticeModeTimeOffset.Value = Math.floor(practiceData.isset('startSongTime', 0));
            this.onPerformancePointsChange.Value = data.isset('PP', 0);
            this.onStarChange.Value = data.isset('Star', 0);
            // no GameVersion
            // no PluginVersion
            this.onMultiplayerChange.Value = data.isset('IsMultiplayer', false);
            this.onPreviousScoreChange.Value = data.isset('PreviousRecord', 0);
            this.onPreviousKeyChange.Value = data.isset('PreviousBSR', '');
            // no unixTimestamp
        }

        public handleLiveData(data: {}): void {
            this.score = data.isset('Score', 0);
            this.maxScore = data.isset('ScoreWithMultipliers', 0);
            this.sendCorrectScore();
            // no MaxScore
            // no MaxScoreWithMultipliers
            this.onRankChange.Value = data.isset('Rank', 'F');
            // fix missing full combo break on bad cut on DataPuller 2.0.12
            let combo = data.isset('Combo', 0);
            if (this.lastCombo > combo) {
                this.onFullComboChange.Value = false;
                this.lostFullCombo = true;
                this.missOffset++;
            } else if (!this.lostFullCombo) {
                this.onFullComboChange.Value = data.isset('FullCombo', false);
            }
            this.lastCombo = combo;
            // end fix
            // no NotesSpawned
            this.onComboChange.Value = combo;
            this.onMissChange.Value = data.isset('Misses', 0) + this.missOffset;
            this.onAccuracyChange.Value = data.isset('Accuracy', 0);
            // no BlockHitScore
            this.onHealthChange.Value = data.isset('PlayerHealth', 0);
            // no ColorType (yet)
            this.onTimeElapsedChange.Value = data.isset('TimeElapsed', 0);
            // no unixTimestamp
            // no EventTrigger
        }

        public testMapData(): void {
            this.handleMapData({
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