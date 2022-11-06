///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import BaseConnection = Freakylay.Game.BaseConnection;
    import Config = Freakylay.Internal.Config.Config;
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;
    import Logger = Freakylay.Internal.Logger;
    import Pulsoid = Freakylay.DataTransfer.Pulsoid.Pulsoid;

    export class Events {

        private readonly logger: Logger;
        private config: Config;
        private helper: ConfigHelper;
        private connection: BaseConnection;
        private pulsoidConnection: Pulsoid;

        // html elements
        private cssRootVariables: HTMLHtmlElement;

        // marquee
        private marquee: Marquee[] = [];

        // sections
        private counterSection: HTMLDivElement;
        private songInfo: HTMLDivElement;
        private modifiers: HTMLDivElement;
        private practiceMode: HTMLDivElement;

        // counter section
        private combo: HTMLDivElement;
        private comboValue: HTMLSpanElement;
        private miss: HTMLDivElement;
        private missValue: HTMLSpanElement;
        private score: HTMLDivElement;
        private previousScore: HTMLDivElement; // hmmm
        private blockSpeed: HTMLDivElement;
        private blockSpeedValue: HTMLSpanElement;
        private bpm: HTMLDivElement;
        private bpmValue: HTMLSpanElement;
        private health: HTMLDivElement;
        private accuracy: HTMLDivElement;
        private time: HTMLDivElement;
        private pulsoid: HTMLDivElement;
        private accuracyRank: HTMLDivElement;
        private ranked: HTMLDivElement;
        private stars: HTMLDivElement;
        private starsValue: HTMLSpanElement;
        private fullCombo: HTMLDivElement;

        // circle bars
        private healthCircleBar: CircleBar;
        private accuracyCircleBar: CircleBar;
        private timeCircleBar: CircleBar;
        private pulsoidCircleBar: CircleBar;

        // song info
        private mapKey: HTMLDivElement;
        private mapper: HTMLDivElement;
        private coverImage: HTMLDivElement;
        private difficulty: HTMLDivElement;
        private difficultyValue: HTMLSpanElement;
        private customDifficultyValue: HTMLSpanElement;
        private songName: HTMLDivElement;
        private songArtist: HTMLDivElement;
        private previousMapKey: HTMLDivElement;

        // modifiers
        private modifierNoFailOn0Energy: HTMLDivElement;
        private modifierOneLife: HTMLDivElement;
        private modifierFourLives: HTMLDivElement;
        private modifierNoBombs: HTMLDivElement;
        private modifierNoWalls: HTMLDivElement;
        private modifierNoArrows: HTMLDivElement;
        private modifierGhostNotes: HTMLDivElement;
        private modifierDisappearingArrows: HTMLDivElement;
        private modifierSmallNotes: HTMLDivElement;
        private modifierProMode: HTMLDivElement;
        private modifierStrictAngles: HTMLDivElement;
        private modifierZenMode: HTMLDivElement;
        private modifierSlowerSong: HTMLDivElement;
        private modifierFasterSong: HTMLDivElement;
        private modifierSuperFastSong: HTMLDivElement;

        // practice mode
        private practiceModeInfo: HTMLDivElement;
        private practiceModeSongSpeed: HTMLDivElement;
        private practiceModeTimeOffset: HTMLDivElement;

        // modifier array
        private readonly gameModifiers: HTMLDivElement[];
        private readonly practiceModifiers: HTMLDivElement[];
        private readonly allModifiers: HTMLDivElement[][];

        // elements array
        private readonly toggleElements: HTMLDivElement[];

        private showElements: EventProperty<boolean>;

        // value holders...
        private valueDifficulty: string;
        private valueCustomDifficulty: string;
        private valuePreviousScore: number;

        /**
         * constructor of Event class
         * it also hooks into all events given by config and other stuff
         * @param config
         * @param helper
         * @param pulsoid
         */
        constructor(config: Config, helper: ConfigHelper, pulsoid: Pulsoid) {
            this.logger = new Logger('Events');
            this.config = config;
            this.helper = helper;
            this.pulsoidConnection = pulsoid;

            this.showElements = new EventProperty<boolean>(false);

            this.loadAllDomElements();

            this.gameModifiers = [
                this.modifierNoFailOn0Energy,
                this.modifierOneLife,
                this.modifierFourLives,
                this.modifierNoBombs,
                this.modifierNoWalls,
                this.modifierNoArrows,
                this.modifierGhostNotes,
                this.modifierDisappearingArrows,
                this.modifierSmallNotes,
                this.modifierProMode,
                this.modifierStrictAngles,
                this.modifierZenMode,
                this.modifierSlowerSong,
                this.modifierFasterSong,
                this.modifierSuperFastSong,
            ];

            this.practiceModifiers = [
                this.practiceModeInfo,
                this.practiceModeSongSpeed,
                this.practiceModeTimeOffset
            ];

            this.allModifiers = [
                this.gameModifiers,
                this.practiceModifiers
            ];

            this.toggleElements = [
                this.counterSection,
                this.modifiers,
                this.songInfo,
                this.practiceMode
            ];

            // internal
            this.showElements.register((show: boolean) => {
                const className = 'inactive';
                this.allModifiers.forEach((ar: HTMLDivElement[]) => {
                    ar.forEach((element: HTMLDivElement) => {
                        this.displayModifier(element, true);
                    });
                })
                this.toggleElements.forEach((element: HTMLDivElement) => {
                    if (show) {
                        element.removeClass(className);
                    } else {
                        element.addClass(className);
                    }
                });
            })

            // option panel
            this.helper.optionsOpen.register((show: boolean) => {
                this.showElements.Value = show;
            });

            // colors
            this.config.colors.background.register((color: Color) => {
                this.setBackgroundColor(color);
                this.helper.generateUrlText();
            });

            this.config.colors.text.register((color: Color) => {
                this.setTextColor(color);
                this.helper.generateUrlText();
            });

            // looks
            this.config.looks.shortModifierNames.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.handleShortNames(enabled);
            });
            this.config.looks.showPreviousKey.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.previousMapKey.display(enabled);
            });
            this.config.looks.showMissCounter.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.miss.inline(enabled);
            });
            this.config.looks.showBpm.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.bpm.inline(enabled);
            });
            this.config.looks.showBlockSpeed.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.blockSpeed.inline(enabled);
            });
            this.config.looks.showCombo.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.combo.inline(enabled);
            });
            this.config.looks.songInfoOnRightSide.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.songInfo.toggleClassByValue(enabled, 'flip');
            });
            this.config.looks.counterSectionOnTop.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.counterSection.toggleClassByValue(enabled, 'flip');
            });
            this.config.looks.modifiersOnRightSide.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.modifiers.toggleClassByValue(enabled, 'flip');
                this.practiceMode.toggleClassByValue(enabled, 'flip');
            });
            this.config.looks.hideFullComboModifier.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.fullCombo.display(!enabled);
            });
            this.config.looks.timeCircleLikeOtherCircles.register(() => {
                this.helper.generateUrlText();
                let min = 50;
                let max = 100;
                if (this.connection) {
                    min = this.connection.onTimeElapsedChange.Value;
                    max = this.connection.onTimeLengthChange.Value;
                }
                this.onTimeElapsedChangeSetText(min, max);
            });
            this.config.looks.songInfoOnTopSide.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.songInfo.toggleClassByValue(enabled, 'top');
            });
            this.config.looks.hideAllModifiers.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.modifiers.flex(!enabled);
                this.practiceMode.flex(!enabled);
            });
            this.config.looks.hideCounterSection.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.counterSection.display(!enabled);
            });
            this.config.looks.hideSongInfo.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.songInfo.display(!enabled);
            });
            this.config.looks.showRanked.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.ranked.display(enabled);
            });
            this.config.looks.showStars.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.stars.display(enabled);
            });
            this.config.looks.showAccuracyRank.register((enabled) => {
                this.accuracyRank.display(enabled);
            });

            this.config.looks.compareWithPreviousScore.register(() => {
                this.helper.generateUrlText();
            });
            this.config.looks.hideDefaultDifficultyOnCustomDifficulty.register(() => {
                this.helper.generateUrlText();
            });
            this.config.looks.speedDisplayRelative.register(() => {
                this.helper.generateUrlText();
            });
            this.config.looks.useMapColorForBackgroundColor.register(() => {
                this.helper.generateUrlText();
            });
            this.config.looks.useMapColorForTextColor.register(() => {
                this.helper.generateUrlText();
            });

            this.config.pulsoid.type.register(() => {
                this.pulsoidConnection.stop();
            });
            this.config.pulsoid.tokenOrUrl.register(() => {
                this.pulsoidConnection.stop();
            });

            this.config.pulsoid.maxStaticBpm.register(() => {
                this.helper.generateUrlText();
            });
            this.config.pulsoid.useDynamicBpm.register(() => {
                this.helper.generateUrlText();
            });

            this.pulsoidConnection.bpm.register((bpm: number) => {
                let enabled = bpm > 0;
                this.pulsoid.display(enabled);
                this.counterSection.toggleClassByValue(enabled, 'pulsoid');
                if (!enabled) {
                    return;
                }

                this.pulsoidCircleBar.setProgress(bpm, this.pulsoidConnection.maxBpm.Value);
                this.pulsoidCircleBar.setText('Heart<br>' + bpm);
            });

            this.startAllMarquees();

            if (this.config.shouldOpenOptionPanelAfterLoad) {
                this.helper.toggleOptionPanel();
            } else {
                this.showElements.Value = false;
            }
        }

        /**
         * loads all used DOM elements to manipulate them later
         * @private
         */
        private loadAllDomElements(): void {
            // color
            this.cssRootVariables = document.get<HTMLHtmlElement>(':root');

            // sections
            this.counterSection = document.getDiv('counterSection');
            this.songInfo = document.getDiv('songInfo');
            this.modifiers = document.getDiv('modifiers');

            // counter section
            this.combo = document.getDiv('combo');
            this.miss = document.getDiv('miss');
            this.score = document.getDiv('score');
            this.blockSpeed = document.getDiv('njs');
            this.bpm = document.getDiv('bpm');
            this.ranked = document.getDiv('ranked');
            this.stars = document.getDiv('stars');

            this.comboValue = this.combo.children.item(1) as HTMLSpanElement;
            this.missValue = this.miss.children.item(1) as HTMLSpanElement;
            this.blockSpeedValue = this.blockSpeed.children.item(1) as HTMLSpanElement;
            this.bpmValue = this.bpm.children.item(1) as HTMLSpanElement;
            this.starsValue = this.stars.children.item(1) as HTMLSpanElement;

            this.health = document.getDiv('healthHolder');
            this.accuracy = document.getDiv('accuracyHolder');
            this.time = document.getDiv('timerHolder');
            this.pulsoid = document.getDiv('pulsoidHolder');

            this.timeCircleBar = new CircleBar(this.time);
            this.healthCircleBar = new CircleBar(this.health, (percent: string) => {
                return '<small>Health</small>' + parseFloat(percent).toFixed(0) + '%';
            });
            this.accuracyCircleBar = new CircleBar(this.accuracy, (percent: string) => {
                return '<small>Accuracy</small>' + percent + '%';
            });
            this.accuracyRank = document.getDiv('rank');
            this.pulsoidCircleBar = new CircleBar(this.pulsoid);

            this.healthCircleBar.setProgress(50, 100);
            this.accuracyCircleBar.setProgress(50, 100);
            this.timeCircleBar.setProgress(50, 100);
            this.onTimeElapsedChangeSetText(50, 100);
            this.pulsoidCircleBar.setProgress(50, 100);
            this.pulsoid.display(false);

            this.fullCombo = document.getDiv('fullCombo');

            // song info
            this.previousMapKey = document.getDiv('previousBSR');
            this.comboValue = document.getDiv('cover');
            this.mapper = document.getDiv('mapper');
            this.difficulty = document.getDiv('difficulty');
            this.songArtist = document.getDiv('artist');
            this.songName = document.getDiv('mapName');
            this.coverImage = document.getDiv('cover');

            this.difficultyValue = this.difficulty.children.item(0) as HTMLSpanElement;
            this.customDifficultyValue = this.difficulty.children.item(1) as HTMLSpanElement;

            // modifiers
            this.modifierNoFailOn0Energy = document.getDiv('noFailOn0Energy');
            this.modifierOneLife = document.getDiv('oneLife');
            this.modifierFourLives = document.getDiv('fourLives');
            this.modifierNoBombs = document.getDiv('noBombs');
            this.modifierNoWalls = document.getDiv('noWalls');
            this.modifierNoArrows = document.getDiv('noArrows');
            this.modifierGhostNotes = document.getDiv('ghostNotes');
            this.modifierDisappearingArrows = document.getDiv('disappearingArrows');
            this.modifierSmallNotes = document.getDiv('smallNotes');
            this.modifierProMode = document.getDiv('proMode');
            this.modifierStrictAngles = document.getDiv('strictAngles');
            this.modifierZenMode = document.getDiv('zenMode');
            this.modifierSlowerSong = document.getDiv('slowerSong');
            this.modifierFasterSong = document.getDiv('fasterSong');
            this.modifierSuperFastSong = document.getDiv('superFastSong');

            // practice mode
            this.practiceMode = document.getDiv('practice');
            this.practiceModeInfo = document.getDiv('practiceMode');
            this.practiceModeSongSpeed = document.getDiv('practiceModeSongSpeed');
            this.practiceModeTimeOffset = document.getDiv('practiceModeTimeOffset');
        }

        /**
         * changes all background colored elements to the new color
         * @param color
         * @private
         */
        private setBackgroundColor(color: Color): void {
            this.cssRootVariables.style.setProperty('--background', color.toCss());
        }

        /**
         * changes all text colored elements to the new color
         * @param color
         * @private
         */
        private setTextColor(color: Color): void {
            this.cssRootVariables.style.setProperty('--text', color.toCss());
        }

        /**
         * toggles all modifiers if short names should be used or not
         * @param enabled
         * @private
         */
        private handleShortNames(enabled: boolean): void {
            this.modifierNoFailOn0Energy.innerText = enabled ? 'NF' : 'No Fail';
            this.modifierOneLife.innerText = enabled ? '1L' : 'One Life';
            this.modifierFourLives.innerText = enabled ? '4L' : 'Four Lives';
            this.modifierNoBombs.innerText = enabled ? 'NB' : 'No Bombs';
            this.modifierNoWalls.innerText = enabled ? 'NW' : 'No Walls';
            this.modifierNoArrows.innerText = enabled ? 'NA' : 'No Arrows';
            this.modifierGhostNotes.innerText = enabled ? 'GN' : 'Ghost Notes';
            this.modifierDisappearingArrows.innerText = enabled ? 'DA' : 'Disappearing Arrows';
            this.modifierSmallNotes.innerText = enabled ? 'SN' : 'Small Notes';
            this.modifierProMode.innerText = enabled ? 'PM' : 'Pro Mode';
            this.modifierStrictAngles.innerText = enabled ? 'SA' : 'Strict Angles';
            this.modifierZenMode.innerText = enabled ? 'ZM' : 'Zen Mode';
            this.modifierSlowerSong.innerText = enabled ? 'SS' : 'Slower Song';
            this.modifierFasterSong.innerText = enabled ? 'FS' : 'Faster Spmg';
            this.modifierSuperFastSong.innerText = enabled ? 'SFS' : 'Super Fast Song';
            this.practiceModeInfo.innerText = enabled ? 'PM' : 'Practice Mode';
            this.practiceModeSongSpeed.innerText = this.getSongSpeedWithModifierName('100');
            this.practiceModeTimeOffset.innerText = this.getSongTimeOffsetWithModifierName('0');
        }

        /**
         * shows or hides a modifier on the side panel based on a value
         * @param modifier the modifier HTMLDivElement
         * @param display true if visible, false if not
         * @private
         */
        private displayModifier(modifier: HTMLDivElement, display: boolean): void {
            modifier.toggleClassByValue(display, 'active');
            this.addModifierClasses();
        }

        /**
         * adds first and last CSS class to modifiers for styling purposes
         * since :last-child and :first-child pseudo selectors will not work with classes
         * e.g. div.active:first-child will NOT select first element with given class but first div layer
         * this sorter will solve that, but it's way heavier than CSS :<
         * @private
         */
        private addModifierClasses(): void {

            this.allModifiers.forEach((ar: HTMLDivElement[]) => {

                let firstFound: boolean = false;
                let lastElement: HTMLDivElement;

                ar.forEach((element: HTMLDivElement) => {

                    element.removeClass('last');
                    element.removeClass('first');

                    if (!element.classList.contains('active')) {
                        return;
                    }

                    lastElement = element;

                    if (firstFound) {
                        return;
                    }

                    element.addClass('first');
                    firstFound = true;
                });

                if (lastElement instanceof HTMLDivElement) {
                    lastElement.addClass('last');
                }
            });
        }

        /**
         * modifies all marquees to use animation if necessary
         * @private
         */
        private startAllMarquees(): void {
            this.marquee['difficulty'] = new Marquee(document.getId('marqueeDifficulty'));
            this.marquee['songArtist'] = new Marquee(document.getId('marqueeSongArtist'));
            this.marquee['songName'] = new Marquee(document.getId('marqueeSongName'));
        }

        /**
         * registers a new game connection and registers all events from its supported values
         * @param connection game connection
         * @private
         */
        private registerConnection(connection: BaseConnection): void {
            this.unregisterConnection();

            this.connection = connection;

            let c = this.connection.getCompatibility();

            // counter section
            this.checkCompatibility(c.supportsCombo, this.combo, this.connection.onComboChange, this.onComboChange);
            this.checkCompatibility(c.supportsMiss, this.miss, this.connection.onMissChange, this.onMissChange);
            this.checkCompatibility(c.supportsScore, this.score, this.connection.onScoreChange, this.onScoreChange);
            this.checkCompatibility(c.supportsPreviousScore, this.previousScore, this.connection.onPreviousScoreChange, this.onPreviousScoreChange);
            this.checkCompatibility(c.supportsBlockSpeed, this.blockSpeed, this.connection.onBlockSpeedChange, this.onBlockSpeedChange);
            this.checkCompatibility(c.supportsBpm, this.bpm, this.connection.onBpmChange, this.onBpmChange);
            this.checkCompatibility(c.supportsHealth, this.health, this.connection.onHealthChange, this.onHealthChange);
            this.checkCompatibility(c.supportsAccuracy, this.accuracy, this.connection.onAccuracyChange, this.onAccuracyChange);
            this.checkCompatibility(c.supportsTime, this.time, this.connection.onTimeElapsedChange, this.onTimeElapsedChange);
            // time length and timescale are not used here
            this.checkCompatibility(c.supportsRank, this.accuracyRank, this.connection.onRankChange, this.onRankChange);
            this.checkCompatibility(c.supportsCombo, this.combo, this.connection.onFullComboChange, this.onComboChange);
            this.checkCompatibility(c.supportsFullCombo, this.fullCombo, this.connection.onFullComboChange, this.onFullComboChange);
            // modifier
            this.checkCompatibility(c.supportsModifier, this.modifiers, this.connection.onModifierChange, this.onModifierChange);
            this.checkCompatibility(c.supportsModifierNoFail, this.modifierNoFailOn0Energy, this.connection.onModifierNoFailChange, this.onModifierNoFailChange);
            this.checkCompatibility(c.supportsModifierOneLife, this.modifierOneLife, this.connection.onModifierOneLifeChange, this.onModifierOneLifeChange);
            this.checkCompatibility(c.supportsModifierFourLives, this.modifierFourLives, this.connection.onModifierFourLivesChange, this.onModifierFourLivesChange);
            this.checkCompatibility(c.supportsModifierNoBombs, this.modifierNoBombs, this.connection.onModifierNoBombsChange, this.onModifierNoBombsChange);
            this.checkCompatibility(c.supportsModifierNoWalls, this.modifierNoWalls, this.connection.onModifierNoWallsChange, this.onModifierNoWallsChange);
            this.checkCompatibility(c.supportsModifierNoArrows, this.modifierNoArrows, this.connection.onModifierNoArrowsChange, this.onModifierNoArrowsChange);
            this.checkCompatibility(c.supportsModifierGhostNotes, this.modifierGhostNotes, this.connection.onModifierGhostNotesChange, this.onModifierGhostNotesChange);
            this.checkCompatibility(c.supportsModifierDisappearingArrows, this.modifierDisappearingArrows, this.connection.onModifierDisappearingArrowsChange, this.onModifierDisappearingArrowsChange);
            this.checkCompatibility(c.supportsModifierSmallNotes, this.modifierSmallNotes, this.connection.onModifierSmallNotesChange, this.onModifierSmallNotesChange);
            this.checkCompatibility(c.supportsModifierProMode, this.modifierProMode, this.connection.onModifierProModeChange, this.onModifierProModeChange);
            this.checkCompatibility(c.supportsModifierStrictAngles, this.modifierStrictAngles, this.connection.onModifierStrictAnglesChange, this.onModifierStrictAnglesChange);
            this.checkCompatibility(c.supportsModifierZenMode, this.modifierZenMode, this.connection.onModifierZenModeChange, this.onModifierZenModeChange);
            this.checkCompatibility(c.supportsModifierSlowerSong, this.modifierSlowerSong, this.connection.onModifierSlowerSongChange, this.onModifierSlowerSongChange);
            this.checkCompatibility(c.supportsModifierFasterSong, this.modifierFasterSong, this.connection.onModifierFasterSongChange, this.onModifierFasterSongChange);
            this.checkCompatibility(c.supportsModifierSuperFastSong, this.modifierSuperFastSong, this.connection.onModifierSuperFastSongChange, this.onModifierSuperFastSongChange);
            // todo :: practice mode
            this.checkCompatibility(c.supportsPracticeMode, this.practiceModeInfo, this.connection.onPracticeModeChange, this.onPracticeModeChange);
            this.checkCompatibility(c.supportsPracticeModeSpeed, this.practiceModeSongSpeed, this.connection.onPracticeModeSpeedChange, this.onPracticeModeSpeedChange);
            this.checkCompatibility(c.supportsPracticeModeTimeOffset, this.practiceModeTimeOffset, this.connection.onPracticeModeSpeedChange, this.onPracticeModeTimeOffset);
            // song info
            this.checkCompatibility(c.supportsKey, this.mapKey, this.connection.onKeyChange, this.onKeyChange);
            this.checkCompatibility(c.supportsPreviousKey, this.previousMapKey, this.connection.onPreviousKeyChange, this.onPreviousKeyChange);
            this.checkCompatibility(c.supportsSongInfoMapperName, this.mapper, this.connection.onSongInfoMapperNameChange, this.onSongInfoMapperNameChange);
            this.checkCompatibility(c.supportsSongInfoDifficulty, this.difficulty, this.connection.onSongInfoDifficultyChange, this.onSongInfoDifficultyChange);
            this.checkCompatibility(c.supportsSongInfoCustomDifficulty, this.difficulty, this.connection.onSongInfoDifficultyChange, this.onSongInfoCustomDifficultyChange);
            this.checkCompatibility(c.supportsSongInfoSongArtist, this.songArtist, this.connection.onSongInfoSongAuthorChange, this.onSongInfoSongAuthorChange);
            this.checkCompatibility(c.supportsSongInfoSongName, this.songName, this.connection.onSongInfoSongNameChange, this.onSongInfoSongNameChange);
            this.checkCompatibility(c.supportsSongInfoCoverImage, this.coverImage, this.connection.onSongInfoCoverImageChange, this.onSongInfoCoverImageChange);
            // ranked bullshit
            this.checkCompatibility(c.supportsStar, this.stars, this.connection.onStarChange, this.onStarChange);
            this.checkCompatibility(c.supportsPerformancePoints, this.ranked, this.connection.onPerformancePointsChange, this.onPerformancePointsChange);
            // these here are special because they arent used in the overlay as their own elements
            // todo :: level changes
            if (c.supportsLevelChange) {
                this.connection.onLevelChange.register((change: boolean) => {
                    this.showElements.Value = change;
                });
            }
            if (c.supportsLevelPause) {
                this.connection.onLevelPausedChange.register((pause: boolean) => {

                });
            }
            if (c.supportsLevelFinish) {
                this.connection.onLevelFinishedChange.register((finish: boolean) => {

                });
            }
            if (c.supportsLevelFailed) {
                this.connection.onLevelFailedChange.register((failed: boolean) => {

                });
            }
            if (c.supportsLevelQuit) {
                this.connection.onLevelQuitChange.register((quit: boolean) => {

                });
            }

            if (c.supportsMultiplayer) {
                this.connection.onMultiplayerChange.register((isMultiplayer: boolean) => {

                });
            }

            if (c.supportsPlayerColorsUsage) {
                this.connection.onPlayerColorAChange.register((newColor: Color) => {
                    this.handleColorChange(this.config.looks.useMapColorForBackgroundColor.Value, newColor);
                });
                this.connection.onPlayerColorBChange.register((newColor: Color) => {
                    this.handleColorChange(this.config.looks.useMapColorForTextColor.Value, newColor);
                });
            }
        }

        /**
         * changes colors of the background or text based on a settings value
         * @param setting
         * @param newColor
         * @private
         */
        private handleColorChange(setting: number, newColor: Color): void {
            switch (setting.clamp(0, 2)) {
                case 1:
                    this.setBackgroundColor(newColor);
                    break;
                case 2:
                    this.setTextColor(newColor);
                    break;
            }
        }

        /**
         * unregisters a connection if any to free resources
         * @private
         */
        private unregisterConnection(): void {
            if (!this.connection) {
                return;
            }

            //this.connection.onComboChange.unregister();
            //this.connection.onMissChange.unregister();
            //this.connection.onScoreChange.unregister();
            //this.connection.onPreviousScoreChange.unregister();
            //this.connection.onBlockSpeedChange.unregister();
            //this.connection.onBpmChange.unregister();
            //this.connection.onHealthChange.unregister();
            //this.connection.onAccuracyChange.unregister();
            //this.connection.onTimeElapsedChange.unregister();
            //this.connection.onTimeLengthChange.unregister();
            //this.connection.onTimeScaleChange.unregister();
            //this.connection.onRankChange.unregister();
            //this.connection.onFullComboChange.unregister();
//
            //this.connection.onModifierChange.unregister();
            //this.connection.onModifierNoFailChange.unregister();
            //this.connection.onModifierOneLifeChange.unregister();
            //this.connection.onModifierFourLivesChange.unregister();
            //this.connection.onModifierNoBombsChange.unregister();
            //this.connection.onModifierNoWallsChange.unregister();
            //this.connection.onModifierNoArrowsChange.unregister();
            //this.connection.onModifierGhostNotesChange.unregister();
            //this.connection.onModifierDisappearingArrowsChange.unregister();
            //this.connection.onModifierSmallNotesChange.unregister();
            //this.connection.onModifierProModeChange.unregister();
            //this.connection.onModifierStrictAnglesChange.unregister();
            //this.connection.onModifierZenModeChange.unregister();
            //this.connection.onModifierSlowerSongChange.unregister();
            //this.connection.onModifierFasterSongChange.unregister();
            //this.connection.onModifierSuperFastSongChange.unregister();
            //this.connection.onPracticeModeChange.unregister();
            //this.connection.onPracticeModeSpeedChange.unregister();
            //this.connection.onPracticeModeTimeOffset.unregister();
//
            //this.connection.onKeyChange.unregister();
            //this.connection.onPreviousKeyChange.unregister();
            //this.connection.onSongInfoMapperNameChange.unregister();
            //this.connection.onSongInfoDifficultyChange.unregister();
            //this.connection.onSongInfoSongAuthorChange.unregister();
            //this.connection.onSongInfoSongNameChange.unregister();
            //this.connection.onSongInfoCoverImageChange.unregister();
            //this.connection.onStarChange.unregister();
            //this.connection.onPerformancePointsChange.unregister();
//
            //this.connection.onLevelChange.unregister();
            //this.connection.onLevelPausedChange.unregister();
            //this.connection.onLevelFinishedChange.unregister();
            //this.connection.onLevelFailedChange.unregister();
            //this.connection.onLevelQuitChange.unregister();
//
            //this.connection.onMultiplayerChange.unregister();
            //this.connection.onPlayerColorAChange.unregister();
            //this.connection.onPlayerColorBChange.unregister();
        }

        /**
         * helper function to check if compatibility bit is set and registers event to property with callback if true
         * @param value compatibility bit
         * @param element element to enable/disable
         * @param event EventProperty<T> to register to
         * @param callback callback for event
         * @private
         */
        private checkCompatibility<T>(value: boolean, element: HTMLDivElement, event: EventProperty<T>, callback: (T) => void): void {
            element.display(value);
            if (value) {
                event.register(callback);
            }
        }

        /**
         * displays new combo
         * @param combo
         * @private
         */
        private onComboChange(combo: number): void {
            this.comboValue.innerText = combo.toString();
        };

        /**
         * displays miss and fail hit counter
         * @param miss
         * @private
         */
        private onMissChange(miss: number): void {
            this.missValue.innerText = miss.toString();
        };

        /**
         * displays score, will check if compare mode is active
         * @param score
         * @private
         */
        private onScoreChange(score: number): void {
            switch (this.config.looks.compareWithPreviousScore.Value) {
                case 0:
                    this.score.innerText = score.toString();
                    break;
                case 1:
                    this.score.innerText = (this.valuePreviousScore < score ? '&u' : '&d') + 'arr; ' + score.toString();
                    break;
                case 2:
                    this.score.innerText = (score - this.valuePreviousScore).toString();
                    break;
            }
        }

        /**
         * saves previous score of currently played map for combo display purposes
         * @param previousScore
         * @private
         */
        private onPreviousScoreChange(previousScore: number): void {
            this.valuePreviousScore = previousScore;
        }

        private onBlockSpeedChange(blockSpeed: number): void {
            this.blockSpeedValue.innerText = blockSpeed.toFixed();
        }

        private onBpmChange(bpm: number): void {
            this.bpmValue.innerText = bpm.toFixed();
        }

        private onHealthChange(health: number): void {
            this.healthCircleBar.setProgress(health, 100, 0);
        }

        private onAccuracyChange(accuracy: number): void {
            this.healthCircleBar.setProgress(accuracy);
        }

        /**
         * event handler for time circle bar
         * @param value new time in seconds
         * @private
         */
        private onTimeElapsedChange(value: number): void {
            this.timeCircleBar.setProgress(value, this.connection.onTimeLengthChange.Value);
            this.onTimeElapsedChangeSetText(value, this.connection.onTimeLengthChange.Value);
        }

        /**
         * sets the time while checking if circle design should match others
         * @param value
         * @param total
         * @private
         */
        private onTimeElapsedChangeSetText(value: number, total: number): void {
            let text: string;
            if (this.config.looks.timeCircleLikeOtherCircles.Value) {
                text = 'Time<br>' + value.toDateString();
            } else {
                text = value.toDateString() + '<br>' + total.toDateString();
            }

            this.timeCircleBar.setText(text);
        }

        /**
         * displays rank info
         * @param rank
         * @private
         */
        private onRankChange(rank: string): void {
            this.accuracyRank.innerText = rank;
        }

        private onFullComboChange(hasFullCombo: boolean): void {
            // todo :: animation?
            this.fullCombo.display(hasFullCombo);
        }

        private onModifierChange(modifier: boolean): void {
            // todo :: check if there is really something to do when any modifier changes
        }

        /**
         * displays or hides no fail modifier
         * @param modifier
         * @private
         */
        private onModifierNoFailChange(modifier: boolean): void {
            this.modifierNoFailOn0Energy.display(modifier);
        }

        /**
         * displays or hides one life modifier
         * @param modifier
         * @private
         */
        private onModifierOneLifeChange(modifier: boolean): void {
            this.modifierOneLife.display(modifier);
        }

        /**
         * displays or hides four lives modifier
         * @param modifier
         * @private
         */
        private onModifierFourLivesChange(modifier: boolean): void {
            this.modifierFourLives.display(modifier);
        }

        /**
         * displays or hides no bombs modifier
         * @param modifier
         * @private
         */
        private onModifierNoBombsChange(modifier: boolean): void {
            this.modifierNoBombs.display(modifier);
        }

        /**
         * displays or hides no walls modifier
         * @param modifier
         * @private
         */
        private onModifierNoWallsChange(modifier: boolean): void {
            this.modifierNoWalls.display(modifier);
        }

        /**
         * displays or hides no arrows modifier
         * @param modifier
         * @private
         */
        private onModifierNoArrowsChange(modifier: boolean): void {
            this.modifierNoArrows.display(modifier);
        }

        /**
         * displays or hides ghost notes modifier
         * @param modifier
         * @private
         */
        private onModifierGhostNotesChange(modifier: boolean): void {
            this.modifierGhostNotes.display(modifier);
        }

        /**
         * displays or hides disappearing arrows modifier
         * @param modifier
         * @private
         */
        private onModifierDisappearingArrowsChange(modifier: boolean): void {
            this.modifierDisappearingArrows.display(modifier);
        }

        /**
         * displays or hides small notes modifier
         * @param modifier
         * @private
         */
        private onModifierSmallNotesChange(modifier: boolean): void {
            this.modifierSmallNotes.display(modifier);
        }

        /**
         * displays or hides pro mode modifier
         * @param modifier
         * @private
         */
        private onModifierProModeChange(modifier: boolean): void {
            this.modifierProMode.display(modifier);
        }

        /**
         * displays or hides strict angles modifier
         * @param modifier
         * @private
         */
        private onModifierStrictAnglesChange(modifier: boolean): void {
            this.modifierStrictAngles.display(modifier);
        }

        /**
         * displays or hides zen mode modifier
         * @param modifier
         * @private
         */
        private onModifierZenModeChange(modifier: boolean): void {
            this.modifierZenMode.display(modifier);
        }

        /**
         * displays or hides slower song modifier
         * @param modifier
         * @private
         */
        private onModifierSlowerSongChange(modifier: boolean): void {
            this.modifierSlowerSong.display(modifier);
        }

        /**
         * displays or hides faster song modifier
         * @param modifier
         * @private
         */
        private onModifierFasterSongChange(modifier: boolean): void {
            this.modifierFasterSong.display(modifier);
        }

        /**
         * displays or hides super fast song modifier
         * @param modifier
         * @private
         */
        private onModifierSuperFastSongChange(modifier: boolean): void {
            this.modifierSuperFastSong.display(modifier);
        }

        /**
         * displays or hides complete practice mode section
         * @param modifier
         * @private
         */
        private onPracticeModeChange(modifier: boolean): void {
            this.practiceMode.display(modifier);
        }

        /**
         * displays song speed in practice mode section
         * @param speed
         * @private
         */
        private onPracticeModeSpeedChange(speed: number): void {
            let data;
            speed = Math.floor(speed * 100);
            if (this.config.looks.speedDisplayRelative.Value) {
                speed -= 100;
                data = (speed < 0 ? '-' : '+') + speed;
            } else {
                data = speed.toString();
            }
            this.practiceModeSongSpeed.innerText = this.getSongSpeedWithModifierName(data);
        }

        /**
         * displays song time offset in practice mode section
         * @param modifier
         * @private
         */
        private onPracticeModeTimeOffset(modifier: number): void {
            this.practiceModeTimeOffset.innerText = this.getSongTimeOffsetWithModifierName(modifier.toDateString())
        }

        private onKeyChange(key: string): void {
            this.mapKey.innerText = key;
        }

        private onPreviousKeyChange(previousKey: string): void {
            this.previousMapKey.innerText = previousKey;
        }

        private onSongInfoMapperNameChange(mapperName: string): void {
            this.mapper.innerText = mapperName;
        }

        private onSongInfoDifficultyChange(difficulty: string): void {
            this.valueDifficulty = difficulty;
            this.setCompleteDifficultyLabel();
        }

        private onSongInfoCustomDifficultyChange(difficulty: string): void {
            this.valueCustomDifficulty = difficulty;
            this.setCompleteDifficultyLabel();
        }

        private setCompleteDifficultyLabel(): void {
            let text;
            if (this.config.looks.hideDefaultDifficultyOnCustomDifficulty) {
                text = this.valueCustomDifficulty.length > 0 ? this.valueCustomDifficulty : this.valueDifficulty;
            } else {
                if (this.valueCustomDifficulty === '' || this.valueCustomDifficulty === this.valueDifficulty) {
                    text = this.valueDifficulty;
                } else {
                    text = this.valueCustomDifficulty + ' - ' + this.valueDifficulty;
                }
            }
            this.marquee['difficulty'].setValue(text);
        }

        private onSongInfoSongAuthorChange(songAuthor: string): void {
            this.marquee['songArtist'].setValue(songAuthor);
        }

        private onSongInfoSongNameChange(songName: string): void {
            this.marquee['songName'].setValue(songName);
        }

        private onSongInfoCoverImageChange(coverImage: string): void {
            this.coverImage.style.backgroundImage = coverImage;
        }

        private onStarChange(stars: string): void {
            this.starsValue.innerText = stars;
        }

        private onPerformancePointsChange(x: number): void {
            this.ranked.display(x > 0);
        }

        private onLevelChange(changed: boolean): void {
        }

        private onLevelPausedChange(changed: boolean): void {
        }

        private onLevelFinishedChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        private onLevelFailedChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        private onLevelQuitChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        private onMultiplayerChange(isMultiplayer: boolean): void {
        }

        private onPlayerColorAChange(color: string): void {
        }

        private onPlayerColorBChange(color: string): void {
        }

        /**
         * returns readable song speed for practice mode, it checks for short modifier namee flag
         * @param speed
         * @private
         */
        private getSongSpeedWithModifierName(speed: string): string {
            return (this.config.looks.shortModifierNames.Value ? speed : 'Speed: ' + speed) + '%';
        }

        /**
         * returns readable offset time for practice mode, it checks for short modifier namee flag
         * @param offset
         * @private
         */
        private getSongTimeOffsetWithModifierName(offset: string): string {
            return (this.config.looks.shortModifierNames.Value ? offset : 'Start: ' + offset) + 's';
        }
    }
}