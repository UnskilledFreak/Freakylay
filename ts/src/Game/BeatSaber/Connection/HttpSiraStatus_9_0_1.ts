///<reference path="../../../DataTransfer/MapData/BeatSaver.ts"/>
namespace Freakylay.Game.BeatSaber.Connection {
    import WebSocketConnection = Freakylay.DataTransfer.WebSocket.WebSocketConnection;
    import Color = Freakylay.Internal.Color;
    import Config = Freakylay.Internal.Config.Config;
    import BeatSaver = Freakylay.DataTransfer.MapData.BeatSaver;

    export class HttpSiraStatus_9_0_1 extends BaseConnection {
        private connection: WebSocketConnection = null;
        private author: string;
        private songSubName: string;
        private nullColor: Color;
        private timeTimeout: number;
        private beatSaver: BeatSaver;

        constructor(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>, config: Config) {
            super(gameLinkStatus, config);
            this.author = '';
            this.songSubName = '';
            this.nullColor = new Color(0, 0, 0);
            this.beatSaver = new BeatSaver();
        }

        /**
         * tries to connect to the WebSocketServer
         */
        public connect(): boolean {
            this.linkStatus.Value = Freakylay.Game.GameLinkStatus.Connecting;
            this.connection = new WebSocketConnection(this.ip, this.port);
            this.connection.addEndpoint('socket', (a) => {
                this.handleData(a);
            }, true);
            return this.isConnected;
        }

        /**
         * disconnects from the WebSocketServer
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
         * returns unique name for the connection
         */
        public getName(): string {
            return 'Http(Sira)Status 9.0.1+';
        }

        /**
         * loads config data
         * @param data
         */
        public loadConfig(data: {}): void {
            this.ip = data.isset('a', '127.0.0.1');
            this.port = data.isset('b', 6557);
        }

        /**
         * displays additional setting and registers the event to the connection only settings
         * @param settingsTab
         * @param helper
         */
        public displayConnectionSettings(settingsTab: HTMLDivElement, helper: Freakylay.Ui.ConfigHelper): void {
            // no additional settings yet
        }

        /**
         * unregisters everything, what displayConnectionSettings registers
         */
        public onUnregister(): void {
            // no additional settings yet
        }

        /**
         * tries to reconnect
         */
        public reconnect(): boolean {
            this.disconnect();
            return this.connect();
        }

        /**
         * returns the config data
         */
        public saveConfig(): {} {
            return {
                a: this.ip,
                b: this.port
            };
        }

        /**
         * disables compatibility stuff which is not supported from the connection
         * @protected
         */
        protected setCompatibility(): void {
            this.compatibility.supportsSongInfoCustomDifficulty = false;
            this.compatibility.supportsPreviousKey = false;
            this.compatibility.supportsPreviousScore = false;
            this.compatibility.supportsStar = false;
            this.compatibility.supportsPerformancePoints = false;
            this.compatibility.supportsPracticeMode = false;
        }

        /**
         * returns true, the WebSocketServer is created at 0.0.0.0, so it should be accessible from LAN
         */
        public supportsCustomIp(): boolean {
            return true;
        }

        /**
         * returns true, it is possible to change to port via config
         */
        public supportsCustomPort(): boolean {
            return true;
        }

        /**
         * general json data handler
         * @param data
         * @private
         */
        private handleData(data: {}): void {
            let event: string = data.isset('event', '');
            let time = data.isset('time', 0);
            let status = data.isset('status', {});
            let beatMap = status.isset('beatmap', {});
            // no game
            let modifier = status.isset('mod', {});
            let performance = status.isset('performance', {});
            // no playerSettings
            // no noteCut

            switch (event) {
                case 'hello':
                    this.reset();

                    this.parseBeatMapData(beatMap, time);
                    this.parseModifiers(modifier);
                    this.parsePerformance(performance);
                    break;
                case 'songStart':
                    this.onLevelChange.Value = true;
                    this.parseBeatMapData(beatMap, time);
                    this.parseModifiers(modifier);
                    this.parsePerformance(performance);
                    break;
                case 'pause':
                    this.onLevelPausedChange.Value = true;
                    this.clearInternalTimeTimeout();
                    break;
                case 'resume':
                    this.onLevelPausedChange.Value = false;
                    this.clearInternalTimeTimeout();
                    break;
                case 'finished':
                    this.onLevelChange.Value = false;
                    this.onLevelFinishedChange.Value = true;
                    this.clearInternalTimeTimeout();
                    break;
                case 'menu':
                    this.reset();
                    break;
                case 'noteMissed':
                case 'scoreChanged':
                case 'energyChanged':
                    this.parsePerformance(performance);
                    break;
                default:
                    // ignore
                    break;
            }
        }

        /**
         * requests map key via BeatSaver API
         * @param mapHash
         * @private
         */
        private requestMapData(mapHash: string): void {
            this.onKeyChange.Value = 'Loading...';
            this.beatSaver.requestKeyFromMapHash(mapHash, (data: string) => {
                this.onKeyChange.Value = data;
            });
        }

        /**
         * resets all needed events and variables for next map
         * @private
         */
        private reset(): void {
            this.author = '';
            this.songSubName = '';
            this.onLevelChange.Value = false;
            this.onLevelFinishedChange.Value = false;
            this.onLevelFailedChange.Value = false;
            this.onLevelQuitChange.Value = false;
            this.onLevelPausedChange.Value = false;

            this.clearInternalTimeTimeout();
        }

        /**
         * internal beat map handler
         * @param data
         * @param time
         * @private
         */
        private parseBeatMapData(data: {}, time: number): void {
            // beat map data
            // no bombsCount
            // no characteristic
            let color = data.isset('color', {});
            this.handleColor(color);

            this.onSongInfoDifficultyChange.Value = data.isset('difficulty', '');
            // no difficultyEnum
            // no environmentName
            this.onTimeLengthChange.Value = Math.floor(data.isset('length', 12000) / 1000);
            this.onSongInfoMapperNameChange.Value = data.isset('levelAuthorName', '');
            // no levelId
            // no maxRank
            this.onMaxScoreChange.Value = data.isset('maxScore', 0);
            this.onBlockSpeedChange.Value = data.isset('noteJumpSpeed', 10);
            // no noteJumpStartBeatOffset
            // no notesCount
            // no obstaclesCount
            let paused: null | number = data.isset('paused', null);
            this.onLevelPausedChange.Value = typeof paused == 'number' && paused > 0;
            this.author = data.isset('songAuthorName', '');
            this.onSongInfoSongAuthorChange.Value = this.getCompleteAuthorLine();
            this.onBpmChange.Value = data.isset('songBPM', 120);

            let cover = data.isset('songCover', '');
            if (cover.length > 0) {
                cover = 'data:image/png;base64,' + cover;
            }

            this.onSongInfoCoverImageChange.Value = cover;
            let songHash = data.isset('songHash', '');
            if (songHash != '') {
                this.requestMapData(songHash);
            }
            // no songHash
            this.onSongInfoSongNameChange.Value = data.isset('songName', '???');
            this.songSubName = data.isset('songSubName', '');
            // no songTimeOffset
            let start = data.isset('start', 0);
            this.onPracticeModeTimeOffset.Value = Math.floor((time - start) / 1000);
        }

        /**
         * internal modifier handler
         * @param data
         * @private
         */
        private parseModifiers(data: {}): void {
            this.onModifierFourLivesChange.Value = data.isset('batteryEnergy', false);
            // no batteryLives
            this.onModifierDisappearingArrowsChange.Value = data.isset('disappearingArrows', false);
            // no failOnSaberClash
            // no fastNotes
            this.onModifierGhostNotesChange.Value = data.isset('ghostNotes', false);
            this.onModifierOneLifeChange.Value = data.isset('instaFail', false);
            // no multiplier
            this.onModifierNoArrowsChange.Value = data.isset('noArrows', false);
            this.onModifierNoBombsChange.Value = data.isset('noBombs', false);
            this.onModifierNoFailChange.Value = data.isset('noFail', false);
            let noObstacles: boolean | string = data.isset('obstacles', false);
            this.onModifierNoWallsChange.Value = typeof noObstacles == 'boolean' && !noObstacles;
            this.onModifierProModeChange.Value = data.isset('proMode', false);
            this.onModifierSmallNotesChange.Value = data.isset('smallNotes', false);
            let songSpeed = data.isset('songSpeed', '');
            this.onModifierFasterSongChange.Value = false;
            this.onModifierSuperFastSongChange.Value = false;
            this.onModifierSlowerSongChange.Value = false;
            let songSpeedIsFromModifier = true;
            switch (songSpeed) {
                case 'Normal':
                    songSpeedIsFromModifier = false;
                    break;
                case 'Slower':
                    this.onModifierSlowerSongChange.Value = true;
                    break;
                case 'Faster':
                    this.onModifierFasterSongChange.Value = true;
                    break;
                case 'SuperFast':
                    this.onModifierSuperFastSongChange.Value = true;
                    break;
            }
            let songSpeedMultiplier = data.isset('songSpeedMultiplier', 1);
            if (songSpeedIsFromModifier) {
                this.onPracticeModeSpeedChange.Value = 1;
            } else {
                this.onPracticeModeSpeedChange.Value = Math.round(songSpeedMultiplier * 100) / 100;
            }
            this.onTimeLengthChange.Value = this.onTimeLengthChange.Value * songSpeedMultiplier;
            this.onModifierStrictAnglesChange.Value = data.isset('strictAngles', false);
            this.onModifierZenModeChange.Value = data.isset('zenMode', false);
        }

        /**
         * internal performance handling
         * thanks to HyldraZolxy for accuracy calculation
         * @param data
         * @private
         */
        private parsePerformance(data: {}): void {
            // no batteryEnergy
            this.onComboChange.Value = data.isset('combo', 0);
            // no currentMaxScore
            this.onTimeElapsedChange.Value = data.isset('currentSongTime', 0);
            // starting additional timout for slower songs, Http(Sira)Status will not send an event when just time elapses
            this.clearInternalTimeTimeout();
            this.timeTimeout = window.setInterval(() => {
                this.internalTimeTimeout();
            }, 1000);
            this.onHealthChange.Value = Math.floor(data.isset('energy', 1) * 100);
            // no hitBombs
            // no hitNotes
            // no lastNoteScore
            // no lastCombo
            this.onMissChange.Value = data.isset('missedNotes', 0);
            // no multiplier (1x..2x.....8x)
            // no multiplierProgress (0..1)
            // no passedBombs
            // no passedNotes
            this.onRankChange.Value = data.isset('rank', 'F');
            // thanks to HyldraZolxy for this accuracy calculation @ https://github.com/HyldraZolxy/BeatSaber-Overlay/blob/f0eee15d994888b13c985a81272684860dd10f94/js/HTTP_sira_Status.ts#L146
            let relativeScore: number | undefined = data.isset('relativeScore', 0);
            let score = data.isset('score', 0);
            let currentMaxScore = data.isset('currentMaxScore', 0);

            if (typeof relativeScore == 'number') {
                // new HttpSiraStatus
                this.onAccuracyChange.Value = Math.round(relativeScore * 10000) / 100;
            } else {
                // old HttpStatus
                this.onAccuracyChange.Value = Math.round(score * 100 / currentMaxScore);
            }
            // todo :: idea :: max score toggle
            // max score -> score
            // score -> rawScore
            this.onScoreChange.Value = data.isset('rawScore', 0);
            // no softFailed
            this.onFullComboChange.Value = this.onMissChange.Value == 0;
        }

        /**
         * handles color based on config looks setting
         * this is ugly and screams to get improved...
         * @param data
         * @private
         */
        private handleColor(data: {}): void {
            let colorEnvANormalRaw = data.isset('environment0', [0, 0, 0]);
            let colorEnvABoostRaw = data.isset('environment0Boost', [0, 0, 0]);
            let colorEnvBNormalRaw = data.isset('environment1', [0, 0, 0]);
            let colorEnvBBoostRaw = data.isset('environment1Boost', [0, 0, 0]);
            let colorSaberARaw = data.isset('saberA', [0, 0, 0]);
            let colorSaberBRaw = data.isset('saberB', [0, 0, 0]);
            let colorObstacleRaw = data.isset('obstacle', [0, 0, 0]);
            let colorWallNormalRaw = data.isset('environmentW', [0, 0, 0]);
            let colorWallBoostRaw = data.isset('environmentWBoost', [0, 0, 0]);

            let colorEnvANormal = new Color(colorEnvANormalRaw[0], colorEnvANormalRaw[1], colorEnvANormalRaw[2]);
            let colorEnvABoost = new Color(colorEnvABoostRaw[0], colorEnvABoostRaw[1], colorEnvABoostRaw[2]);
            let colorEnvBNormal = new Color(colorEnvBNormalRaw[0], colorEnvBNormalRaw[1], colorEnvBNormalRaw[2]);
            let colorEnvBBoost = new Color(colorEnvBBoostRaw[0], colorEnvBBoostRaw[1], colorEnvBBoostRaw[2]);
            let colorSaberA = new Color(colorSaberARaw[0], colorSaberARaw[1], colorSaberARaw[2]);
            let colorSaberB = new Color(colorSaberBRaw[0], colorSaberBRaw[1], colorSaberBRaw[2]);
            let colorObstacle = new Color(colorObstacleRaw[0], colorObstacleRaw[1], colorObstacleRaw[2]);
            let colorWallNormal = new Color(colorWallNormalRaw[0], colorWallNormalRaw[1], colorWallNormalRaw[2]);
            let colorWallBoost = new Color(colorWallBoostRaw[0], colorWallBoostRaw[1], colorWallBoostRaw[2]);

            let colorEnvA = colorEnvABoost.equalTo(this.nullColor) ? colorEnvANormal : colorEnvABoost;
            let colorEnvB = colorEnvBBoost.equalTo(this.nullColor) ? colorEnvBNormal : colorEnvBBoost;
            let colorWall = colorWallBoost.equalTo(this.nullColor) ? colorWallNormal : colorWallBoost;

            switch (this.config.looks.useMapColorForBackgroundColor.Value) {
                case 0:
                    this.onPlayerColorBChange.Value = this.config.colors.background.Value;
                    break;
                case 1:
                    if (!colorEnvA.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorEnvA;
                    }
                    break;
                case 2:
                    if (!colorEnvB.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorEnvB;
                    }
                    break;
                case 3:
                    if (!colorObstacle.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorObstacle;
                    }
                    break;
                case 4:
                    if (!colorWall.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorWall;
                    }
                    break;
                case 5:
                    if (!colorSaberA.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorSaberA
                    }
                    break;
                case 6:
                    if (!colorSaberB.equalTo(this.nullColor)) {
                        this.onPlayerColorAChange.Value = colorSaberB;
                    }
                    break;
            }

            switch (this.config.looks.useMapColorForTextColor.Value) {
                case 0:
                    this.onPlayerColorBChange.Value = this.config.colors.text.Value;
                    break;
                case 1:
                    if (!colorEnvA.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorEnvA;
                    }
                    break;
                case 2:
                    if (!colorEnvB.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorEnvB;
                    }
                    break;
                case 3:
                    if (!colorObstacle.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorObstacle;
                    }
                    break;
                case 4:
                    if (!colorWall.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorWall;
                    }
                    break;
                case 5:
                    if (!colorSaberA.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorSaberA
                    }
                    break;
                case 6:
                    if (!colorSaberB.equalTo(this.nullColor)) {
                        this.onPlayerColorBChange.Value = colorSaberB;
                    }
                    break;
            }
        }

        /**
         * will generate correct author line to use as text
         * @protected
         */
        private getCompleteAuthorLine(): string {
            if (this.songSubName.length > 0) {
                return this.author + ' - ' + this.songSubName;
            }

            return this.author;
        }

        /**
         * internal interval to update time even if no updates from Http(Sira)Status where received
         * @private
         */
        private internalTimeTimeout(): void {
            this.onTimeElapsedChange.Value = this.onTimeElapsedChange.Value + 1;
        }

        /**
         * clears internal interval for time updates
         * @private
         */
        private clearInternalTimeTimeout(): void {
            if (this.timeTimeout) {
                window.clearInterval(this.timeTimeout);
            }
        }

        /**
         * test this connection
         */
        public test(): void {
            this.handleData({
                'status': {
                    'mod': {
                        'ghostNotes': false,
                        'noFail': true,
                        'zenMode': false,
                        'songSpeed': 'Normal',
                        'multiplier': 1,
                        'strictAngles': false,
                        'noBombs': false,
                        'instaFail': false,
                        'fastNotes': false,
                        'batteryLives': null,
                        'noArrows': false,
                        'songSpeedMultiplier': 1,
                        'batteryEnergy': false,
                        'failOnSaberClash': false,
                        'proMode': false,
                        'obstacles': 'All',
                        'smallNotes': false,
                        'disappearingArrows': false
                    },
                    'game': {
                        'scene': 'Song',
                        'pluginVersion': '9.0.1',
                        'mode': 'SoloStandard',
                        'gameVersion': '1.24.1'
                    },
                    'beatmap': {
                        'characteristic': 'Standard',
                        'maxRank': 'SS',
                        'start': 1671137353530,
                        'levelAuthorName': 'Kitoyo & Emilia',
                        'maxScore': 276115,
                        'levelId': 'custom_level_6B9F13A8FDF111DA8FAA849A3615E2BCDCB4954A',
                        'environmentName': 'DefaultEnvironment',
                        'songTimeOffset': 0,
                        'songName': 'Tool',
                        'notesCount': 308,
                        'noteJumpSpeed': 21,
                        'bombsCount': 0,
                        'songBPM': 172,
                        'songAuthorName': 'MARETU',
                        'songCover': HttpSiraStatusTestImage.getSongCoverImageData(),
                        'paused': null,
                        'songSubName': 'feat. Hatsune Miku',
                        'length': 52724,
                        'noteJumpStartBeatOffset': -0.600000023841858,
                        'difficulty': 'Expert+',
                        'color': {
                            'obstacle': [0, 0, 255],
                            'environment0': [255, 136, 0],
                            'environment1': [0, 255, 255],
                            'environment0Boost': null,
                            'environment1Boost': null,
                            'environmentW': [255, 255, 255],
                            'environmentWBoost': null,
                            'saberA': [126, 126, 126],
                            'saberB': [255, 149, 255]
                        },
                        'obstaclesCount': 33,
                        'songHash': '6B9F13A8FDF111DA8FAA849A3615E2BCDCB4954A',
                        'difficultyEnum': 'ExpertPlus'
                    },
                    'performance': {
                        'currentSongTime': 0,
                        'relativeScore': 1,
                        'multiplier': 0,
                        'combo': 0,
                        'maxCombo': 0,
                        'currentMaxScore': 0,
                        'lastNoteScore': 0,
                        'hitNotes': 0,
                        'missedNotes': 0,
                        'rank': 'E',
                        'passedBombs': 0,
                        'softFailed': false,
                        'rawScore': 0,
                        'batteryEnergy': null,
                        'passedNotes': 0,
                        'score': 0,
                        'hitBombs': 0,
                        'multiplierProgress': 0,
                        'energy': 0
                    },
                    'playerSettings': {
                        'autoRestart': false,
                        'environmentEffects': 'AllEffects',
                        'playerHeight': 1.64070701599121,
                        'noHUD': false,
                        'sfxVolume': 0.800000011920929,
                        'hideNoteSpawningEffect': true,
                        'saberTrailIntensity': 1,
                        'leftHanded': false,
                        'staticLights': false,
                        'advancedHUD': true,
                        'reduceDebris': true
                    }
                },
                'time': 1671137353557,
                'event': 'songStart'
            });
        }
    }
}