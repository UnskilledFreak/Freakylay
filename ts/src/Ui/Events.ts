///<reference path="../Internal/Logger.ts"/>
namespace Freakylay.Ui {
    import BaseConnection = Freakylay.Game.BaseConnection;
    import Config = Freakylay.Internal.Config.Config;
    import Color = Freakylay.Internal.Color;
    import EventProperty = Freakylay.Internal.EventProperty;
    import Logger = Freakylay.Internal.Logger;
    import HeartRate = Freakylay.DataTransfer.HeartRate.HeartRate;

    export class Events {

        private readonly logger: Logger;
        private config: Config;
        private helper: ConfigHelper;
        private connection: BaseConnection;
        private heartRate: HeartRate;

        // html elements
        private cssRootVariables: HTMLHtmlElement;

        // marquee
        private marquee: Marquee[] = [];

        // sections
        private counterSection: HTMLDivElement;
        private songInfo: HTMLDivElement;
        private modifiers: HTMLDivElement;
        private versionHint: HTMLDivElement;

        // counter section
        private combo: HTMLDivElement;
        private comboValue: HTMLSpanElement;
        private miss: HTMLDivElement;
        private missValue: HTMLSpanElement;
        private score: HTMLDivElement;
        //private previousScore: HTMLDivElement; // hmmm
        private blockSpeed: HTMLDivElement;
        private blockSpeedValue: HTMLSpanElement;
        private bpm: HTMLDivElement;
        private bpmValue: HTMLSpanElement;
        private health: HTMLDivElement;
        private accuracy: HTMLDivElement;
        private time: HTMLDivElement;
        private heartRateElement: HTMLDivElement;
        private accuracyRank: HTMLDivElement;
        private ranked: HTMLDivElement;
        private stars: HTMLDivElement;
        private starsValue: HTMLSpanElement;
        private fullCombo: HTMLDivElement;

        // circle bars
        private healthCircleBar: CircleBar;
        private accuracyCircleBar: CircleBar;
        private timeCircleBar: CircleBar;
        private heartRateCircleBar: CircleBar;

        // song info
        private mapKey: HTMLDivElement;
        private mapper: HTMLDivElement;
        private cover: HTMLDivElement;
        private coverImage: HTMLDivElement;
        private difficulty: HTMLDivElement;
        private difficultyValue: HTMLSpanElement;
        private customDifficultyValue: HTMLSpanElement;
        private songName: HTMLDivElement;
        private songArtist: HTMLDivElement;
        private previousMapKey: HTMLDivElement;
        private previousMapKeyValue: HTMLDivElement;

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

        // heart graph
        private heartGraphHolder: HTMLDivElement;
        private heartGraphCanvas: HTMLCanvasElement;
        private heartGraphGfx: CanvasRenderingContext2D;

        private showElements: EventProperty<boolean>;

        // value holders...
        private valueDifficulty: string;
        private valueCustomDifficulty: string;
        private valuePreviousScore: number;
        private levelIsPaused: boolean;
        private levelIsPausedTimeInterval: number;
        private totalScore: number;
        private currentScore: number;
        private currentAnimScore: number;
        private scoreAnimateInterval: number;
        private heartGraphInterval: number;

        // heart rate graph data array
        private readonly heartGraphList: number[];

        /**
         * constructor of Event class
         * it also hooks into all events given by config and other stuff
         * @param config
         * @param helper
         * @param heartRate
         */
        constructor(config: Config, helper: ConfigHelper, heartRate: HeartRate) {
            // init
            this.logger = new Logger('Events');
            this.config = config;
            this.helper = helper;
            this.heartRate = heartRate;
            this.levelIsPaused = false;

            this.showElements = new EventProperty<boolean>(false);

            this.loadAllDomElements();

            // arrays after DOM load
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

            this.heartGraphList = [];

            // internal
            this.showElements.register((show: boolean) => {
                const className = 'inactive';
                this.allModifiers.forEach((ar: HTMLDivElement[]) => {
                    ar.forEach((element: HTMLDivElement) => {
                        this.displayModifier(element, true);
                    });
                });

                if (this.config.looks.hideCounterSection.Value) {
                    this.counterSection.addClass(className);
                } else {
                    if (show) {
                        this.counterSection.removeClass(className);
                    } else {
                        this.counterSection.addClass(className);
                    }
                }

                if (this.config.looks.hideAllModifiers.Value) {
                    this.modifiers.addClass(className);
                } else {
                    if (show) {
                        this.modifiers.removeClass(className);
                    } else {
                        this.modifiers.addClass(className);
                    }
                }

                if (this.config.looks.hideSongInfo.Value) {
                    this.songInfo.addClass(className);
                } else {
                    if (show) {
                        this.songInfo.removeClass(className);
                    } else {
                        this.songInfo.addClass(className);
                    }
                }
            });

            // option panel
            this.helper.optionsOpen.register((show: boolean) => {
                this.showElements.Value = show;
            });

            // config colors
            this.config.colors.background.register((color: Color) => {
                this.setBackgroundColor(color);
                this.helper.generateUrlText();
            });

            this.config.colors.text.register((color: Color) => {
                this.setTextColor(color);
                this.helper.generateUrlText();
            });

            // config looks
            this.config.looks.shortModifierNames.register((enabled: boolean) => {
                this.helper.generateUrlText();
                this.handleShortNames(enabled);
            });
            this.config.looks.showPreviousKey.register((enabled: boolean) => {
                this.previousMapKey.display(enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.showMissCounter.register((enabled: boolean) => {
                this.miss.inline(enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.showBpm.register((enabled: boolean) => {
                this.bpm.inline(enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.showBlockSpeed.register((enabled: boolean) => {
                this.blockSpeed.inline(enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.showCombo.register((enabled: boolean) => {
                this.combo.inline(enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.songInfoOnRightSide.register((enabled: boolean) => {
                this.songInfo.toggleClassByValue(enabled, 'flip');
                this.helper.generateUrlText();
            });
            this.config.looks.counterSectionOnTop.register((enabled: boolean) => {
                this.counterSection.toggleClassByValue(enabled, 'flip');
                this.helper.generateUrlText();
            });
            this.config.looks.modifiersOnRightSide.register((enabled: boolean) => {
                this.modifiers.toggleClassByValue(enabled, 'flip');
                this.helper.generateUrlText();
            });
            this.config.looks.hideFullComboModifier.register((enabled: boolean) => {
                this.fullCombo.display(!enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.timeCircleLikeOtherCircles.register(() => {
                let min = 50;
                let max = 100;

                if (this.connection && this.connection.onTimeElapsedChange.Value != null && this.connection.onTimeLengthChange.Value != null) {
                    min = this.connection.onTimeElapsedChange.Value;
                    max = this.connection.onTimeLengthChange.Value;
                }

                this.onTimeElapsedChangeSetText(min, max);
                this.helper.generateUrlText();
            });
            this.config.looks.songInfoOnTopSide.register((enabled: boolean) => {
                this.songInfo.toggleClassByValue(enabled, 'top');
                this.helper.generateUrlText();
            });
            this.config.looks.hideAllModifiers.register((enabled: boolean) => {
                this.modifiers.flex(!enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.hideCounterSection.register((enabled: boolean) => {
                this.counterSection.display(!enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.hideSongInfo.register((enabled: boolean) => {
                this.songInfo.display(!enabled);
                this.helper.generateUrlText();
            });
            this.config.looks.showRanked.register((enabled: boolean) => {
                if (this.connection) {
                    this.ranked.display(this.connection.getCompatibility().supportsPerformancePoints)
                } else {
                    this.ranked.display(enabled);
                }
                this.helper.generateUrlText();
            });
            this.config.looks.showStars.register((enabled: boolean) => {
                if (this.connection) {
                    this.stars.display(this.connection.getCompatibility().supportsStar);
                } else {
                    this.stars.display(enabled);
                }
                this.helper.generateUrlText();
            });
            this.config.looks.showAccuracyRank.register((enabled) => {
                this.accuracyRank.display(enabled);
                this.helper.generateUrlText();
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
            this.config.looks.borderRadius.register((newRadius) => {
                this.setRootCss('radius', newRadius + 'px');
                this.helper.generateUrlText();
            });
            this.config.looks.animateScore.register(() => {
                this.helper.generateUrlText();
            });
            this.config.looks.margin.register((newMargin) => {
                this.setRootCss('margin', newMargin + 'px');

                let modifierMargin = newMargin >= 0 ? 0 : -newMargin;

                this.setRootCss('marginModifiers', modifierMargin + 'px');
                this.helper.generateUrlText();
            });

            // config heart rate
            this.config.heartRate.type.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.tokenOrUrl.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.maxStaticBpm.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.useDynamicBpm.register(() => {
                this.helper.generateUrlText();
            });

            // heart graph
            this.config.heartRate.graph.enabled.register((enabled) => {
                this.heartGraphHolder.display(enabled);
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.anchor.register((anchor) => {
                this.calculateHeartGraph(anchor, this.config.heartRate.graph.offsetX.Value, this.config.heartRate.graph.offsetY.Value);
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.offsetX.register((offsetX) => {
                this.calculateHeartGraph(this.config.heartRate.graph.anchor.Value, offsetX, this.config.heartRate.graph.offsetY.Value);
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.offsetY.register((offsetY) => {
                this.calculateHeartGraph(this.config.heartRate.graph.anchor.Value, this.config.heartRate.graph.offsetX.Value, offsetY);
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.disableCircleBar.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.eventsToShow.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.displayNumbers.register(() => {
                this.helper.generateUrlText();
            })
            this.config.heartRate.graph.useBackground.register((useBackground) => {
                this.heartGraphHolder.toggleClassByValue(useBackground, 'background');
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.width.register((width) => {
                this.heartGraphHolder.style.width = width + 'px';
                this.heartGraphCanvas.width = width;
                this.helper.generateUrlText();
                this.calculateHeartGraph(this.config.heartRate.graph.anchor.Value, this.config.heartRate.graph.offsetX.Value, this.config.heartRate.graph.offsetY.Value);
            });
            this.config.heartRate.graph.height.register((height) => {
                this.heartGraphHolder.style.height = height + 'px';
                this.heartGraphCanvas.height = height;
                this.helper.generateUrlText();
                this.calculateHeartGraph(this.config.heartRate.graph.anchor.Value, this.config.heartRate.graph.offsetX.Value, this.config.heartRate.graph.offsetY.Value);
            });
            this.config.heartRate.graph.useBackgroundColorForStroke.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.smallFontSize.register(() => {
                this.helper.generateUrlText();
            });
            this.config.heartRate.graph.bigFontSize.register(() => {
                this.helper.generateUrlText();
            });

            // Pulsoid event on data receive
            this.heartRate.bpm.register((bpm: number) => {
                let enabled = bpm > 0 && !this.config.heartRate.graph.disableCircleBar.Value;
                this.heartRateElement.display(enabled);
                this.counterSection.toggleClassByValue(enabled, 'heartRate');
                if (!enabled) {
                    return;
                }

                this.heartRateCircleBar.setProgress(bpm, this.heartRate.maxBpm.Value);
                this.heartRateCircleBar.setText('Heart<br>' + bpm);
            });

            // start heart graph interval (even if it is disabled)
            this.heartGraphInterval = window.setInterval(() => {
                this.drawHeartGraph();
            }, 1000);

            // start all marquees for auto-animation
            this.startAllMarquees();

            // open option panel if it was generated so
            if (this.config.shouldOpenOptionPanelAfterLoad) {
                this.helper.toggleOptionPanel();
            } else {
                this.showElements.Value = false;
            }

            // show hint about new version
            if (this.config.wasOldConfigUsed) {
                document.getId<HTMLSpanElement>('versionHintVersion').innerText = helper.fullVersionString;
                document.getId<HTMLButtonElement>('versionHintOptions').onclick = () => {
                    this.helper.toggleOptionPanel();
                    this.versionHint.display(false);
                }
                this.versionHint.removeClass('inactive');
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
            this.versionHint = document.getDiv('versionHint');

            // counter section
            this.combo = document.getDiv('combo');
            this.miss = document.getDiv('miss');
            this.score = document.getDiv('score');
            this.blockSpeed = document.getDiv('njs');
            this.bpm = document.getDiv('bpm');
            this.ranked = document.getDiv('ranked');
            this.stars = document.getDiv('stars');
            this.mapKey = document.getDiv('bsr');

            this.comboValue = this.combo.children.item(1) as HTMLSpanElement;
            this.missValue = this.miss.children.item(1) as HTMLSpanElement;
            this.blockSpeedValue = this.blockSpeed.children.item(1) as HTMLSpanElement;
            this.bpmValue = this.bpm.children.item(1) as HTMLSpanElement;
            this.starsValue = this.stars.children.item(0).children.item(1) as HTMLSpanElement;

            this.health = document.getDiv('healthHolder');
            this.accuracy = document.getDiv('accuracyHolder');
            this.time = document.getDiv('timerHolder');
            this.heartRateElement = document.getDiv('heartRateHolder');

            this.timeCircleBar = new CircleBar(this.time);
            this.healthCircleBar = new CircleBar(this.health, (percent: string) => {
                return '<small>Health</small>' + parseFloat(percent).toFixed(0) + '%';
            });
            this.accuracyCircleBar = new CircleBar(this.accuracy, (percent: string) => {
                return '<small>Accuracy</small>' + percent + '%';
            });
            this.accuracyRank = document.getDiv('rank');
            this.heartRateCircleBar = new CircleBar(this.heartRateElement);

            this.healthCircleBar.setProgress(50, 100);
            this.accuracyCircleBar.setProgress(50, 100);
            this.timeCircleBar.setProgress(50, 100);
            this.onTimeElapsedChangeSetText(50, 100);
            this.heartRateCircleBar.setProgress(50, 100);
            this.heartRateElement.display(false);

            this.fullCombo = document.getDiv('fullCombo');

            // song info
            this.previousMapKey = document.getDiv('previousBSR');
            this.mapper = document.getDiv('mapper');
            this.difficulty = document.getDiv('difficulty');
            this.songArtist = document.getDiv('artist');
            this.songName = document.getDiv('mapName');
            this.cover = document.getDiv('beatMapCover');
            this.coverImage = document.getDiv('cover');

            this.difficultyValue = this.difficulty.children.item(0) as HTMLSpanElement;
            this.customDifficultyValue = this.difficulty.children.item(1) as HTMLSpanElement;
            this.previousMapKeyValue = this.previousMapKey.children.item(0) as HTMLDivElement;

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
            this.practiceModeInfo = document.getDiv('practiceMode');
            this.practiceModeSongSpeed = document.getDiv('practiceModeSongSpeed');
            this.practiceModeTimeOffset = document.getDiv('practiceModeTimeOffset');

            // heart graph
            this.heartGraphHolder = document.getDiv('heartGraphHolder');
            this.heartGraphCanvas = document.get<HTMLCanvasElement>('#heartGraph');
            this.heartGraphGfx = this.heartGraphCanvas.getContext('2d');
        }

        /**
         * changes all background colored elements to the new color
         * @param color
         * @private
         */
        private setBackgroundColor(color: Color): void {
            this.setRootCss('background', color.toCss());
        }

        /**
         * changes all text colored elements to the new color
         * @param color
         * @private
         */
        private setTextColor(color: Color): void {
            this.setRootCss('text', color.toCss());
        }

        /**
         * sets given value to a CSS variable
         * @param property
         * @param value
         * @private
         */
        private setRootCss(property: string, value: string) {
            this.cssRootVariables.style.setProperty('--' + property, value);
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
            this.modifierFasterSong.innerText = enabled ? 'FS' : 'Faster Song';
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
            if (this.config.looks.hideAllModifiers.Value) {
                this.modifiers.flex(false);
                return;
            } else {
                this.modifiers.flex(true);
            }

            this.allModifiers.forEach((ar: HTMLDivElement[]) => {

                let firstFound: boolean = false;
                let lastElement: HTMLDivElement;

                ar.forEach((element: HTMLDivElement) => {

                    element.removeClass('last', 'first');

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
         * @public
         */
        public registerConnection(connection: BaseConnection): void {
            this.unregisterConnection();

            this.connection = connection;

            // yes I am lazy here and just call it c instead of compatibility, deal with it :P
            let c = this.connection.getCompatibility();

            // counter section
            this.checkCompatibility(c.supportsCombo, false, this.comboValue, this.connection.onComboChange, (a) => {
                this.onComboChange(a);
            });
            this.checkCompatibility(c.supportsMiss, false, this.missValue, this.connection.onMissChange, (a) => {
                this.onMissChange(a);
            });
            this.checkCompatibility(c.supportsScore, false, this.score, this.connection.onScoreChange, (a) => {
                this.onScoreChange(a);
            });
            this.checkCompatibility(c.supportsBlockSpeed, false, this.blockSpeedValue, this.connection.onBlockSpeedChange, (a) => {
                this.onBlockSpeedChange(a);
            });
            this.checkCompatibility(c.supportsBpm, false, this.bpmValue, this.connection.onBpmChange, (a) => {
                this.onBpmChange(a);
            });
            this.checkCompatibility(c.supportsHealth, false, this.health, this.connection.onHealthChange, (a) => {
                this.onHealthChange(a);
            });
            this.checkCompatibility(c.supportsAccuracy, false, this.accuracy, this.connection.onAccuracyChange, (a) => {
                this.onAccuracyChange(a);
            });
            this.checkCompatibility(c.supportsTime, false, this.time, this.connection.onTimeElapsedChange, (a) => {
                this.onTimeElapsedChange(a);
            });
            // time length and timescale are not used here
            this.checkCompatibility(c.supportsRank, false, this.accuracyRank, this.connection.onRankChange, (a) => {
                this.onRankChange(a);
            });
            this.checkCompatibility(c.supportsFullCombo, false, this.fullCombo, this.connection.onFullComboChange, (a) => {
                this.onFullComboChange(a);
            });
            // modifier
            this.checkCompatibility(c.supportsModifier, true, this.modifiers, this.connection.onModifierChange, (a) => {
                this.onModifierChange(a);
            });
            this.checkCompatibility(c.supportsModifierNoFail, true, this.modifierNoFailOn0Energy, this.connection.onModifierNoFailChange, (a) => {
                this.onModifierNoFailChange(a);
            });
            this.checkCompatibility(c.supportsModifierOneLife, true, this.modifierOneLife, this.connection.onModifierOneLifeChange, (a) => {
                this.onModifierOneLifeChange(a);
            });
            this.checkCompatibility(c.supportsModifierFourLives, true, this.modifierFourLives, this.connection.onModifierFourLivesChange, (a) => {
                this.onModifierFourLivesChange(a);
            });
            this.checkCompatibility(c.supportsModifierNoBombs, true, this.modifierNoBombs, this.connection.onModifierNoBombsChange, (a) => {
                this.onModifierNoBombsChange(a);
            });
            this.checkCompatibility(c.supportsModifierNoWalls, true, this.modifierNoWalls, this.connection.onModifierNoWallsChange, (a) => {
                this.onModifierNoWallsChange(a);
            });
            this.checkCompatibility(c.supportsModifierNoArrows, true, this.modifierNoArrows, this.connection.onModifierNoArrowsChange, (a) => {
                this.onModifierNoArrowsChange(a);
            });
            this.checkCompatibility(c.supportsModifierGhostNotes, true, this.modifierGhostNotes, this.connection.onModifierGhostNotesChange, (a) => {
                this.onModifierGhostNotesChange(a);
            });
            this.checkCompatibility(c.supportsModifierDisappearingArrows, true, this.modifierDisappearingArrows, this.connection.onModifierDisappearingArrowsChange, (a) => {
                this.onModifierDisappearingArrowsChange(a);
            });
            this.checkCompatibility(c.supportsModifierSmallNotes, true, this.modifierSmallNotes, this.connection.onModifierSmallNotesChange, (a) => {
                this.onModifierSmallNotesChange(a);
            });
            this.checkCompatibility(c.supportsModifierProMode, true, this.modifierProMode, this.connection.onModifierProModeChange, (a) => {
                this.onModifierProModeChange(a);
            });
            this.checkCompatibility(c.supportsModifierStrictAngles, true, this.modifierStrictAngles, this.connection.onModifierStrictAnglesChange, (a) => {
                this.onModifierStrictAnglesChange(a);
            });
            this.checkCompatibility(c.supportsModifierZenMode, true, this.modifierZenMode, this.connection.onModifierZenModeChange, (a) => {
                this.onModifierZenModeChange(a);
            });
            this.checkCompatibility(c.supportsModifierSlowerSong, true, this.modifierSlowerSong, this.connection.onModifierSlowerSongChange, (a) => {
                this.onModifierSlowerSongChange(a);
            });
            this.checkCompatibility(c.supportsModifierFasterSong, true, this.modifierFasterSong, this.connection.onModifierFasterSongChange, (a) => {
                this.onModifierFasterSongChange(a);
            });
            this.checkCompatibility(c.supportsModifierSuperFastSong, true, this.modifierSuperFastSong, this.connection.onModifierSuperFastSongChange, (a) => {
                this.onModifierSuperFastSongChange(a);
            });
            // practice mode
            this.checkCompatibility(c.supportsPracticeMode, true, this.practiceModeInfo, this.connection.onPracticeModeChange, () => {
                this.checkIfInPracticeMode();
            });
            this.checkCompatibility(c.supportsPracticeModeSpeed, true, this.practiceModeSongSpeed, this.connection.onPracticeModeSpeedChange, (a) => {
                this.onPracticeModeSpeedChange(a);
            });
            this.checkCompatibility(c.supportsPracticeModeTimeOffset, true, this.practiceModeTimeOffset, this.connection.onPracticeModeTimeOffset, (a) => {
                this.onPracticeModeTimeOffset(a);
            });
            // song info
            this.checkCompatibility(c.supportsPreviousKey, false, this.previousMapKey, this.connection.onPreviousKeyChange, (a) => {
                this.onPreviousKeyChange(a);
            });
            this.checkCompatibility(c.supportsSongInfoMapperName, false, this.mapper, this.connection.onSongInfoMapperNameChange, (a) => {
                this.onSongInfoMapperNameChange(a);
            });
            this.checkCompatibility(c.supportsSongInfoSongArtist, false, this.songArtist, this.connection.onSongInfoSongAuthorChange, (a) => {
                this.onSongInfoSongAuthorChange(a);
            });
            this.checkCompatibility(c.supportsSongInfoSongName, false, this.songName, this.connection.onSongInfoSongNameChange, (a) => {
                this.onSongInfoSongNameChange(a);
            });
            this.checkCompatibility(c.supportsSongInfoCoverImage, false, this.coverImage, this.connection.onSongInfoCoverImageChange, (a) => {
                this.onSongInfoCoverImageChange(a);
            });
            // ranked bullshit
            this.checkCompatibility(c.supportsStar, false, this.stars, this.connection.onStarChange, (a) => {
                this.onStarChange(a);
            });
            this.checkCompatibility(c.supportsPerformancePoints, false, this.ranked, this.connection.onPerformancePointsChange, (a) => {
                this.onPerformancePointsChange(a);
            });
            // simple check for those because they do not bind to DOM by value
            if (c.supportsKey) {
                this.connection.onKeyChange.register((key) => {
                    this.onKeyChange(key);
                });
            } else {
                this.onKeyChange('');
            }
            if (c.supportsScore) {
                this.connection.onMaxScoreChange.register((maxScore) => {
                    this.onMaxScoreChange(maxScore);
                });
            }
            if (c.supportsSongInfoDifficulty) {
                this.connection.onSongInfoDifficultyChange.register((difficulty) => {
                    this.onSongInfoDifficultyChange(difficulty);
                });
            }
            if (c.supportsSongInfoCustomDifficulty) {
                this.connection.onSongInfoCustomDifficultyChange.register((difficulty) => {
                    this.onSongInfoCustomDifficultyChange(difficulty);
                });
            }
            if (c.supportsLevelChange) {
                this.connection.onLevelChange.register((change: boolean) => {
                    this.onLevelChange(change);
                });
            }
            if (c.supportsLevelPause) {
                this.connection.onLevelPausedChange.register((pause: boolean) => {
                    this.onLevelPausedChange(pause);
                });
            }
            if (c.supportsLevelFinish) {
                this.connection.onLevelFinishedChange.register((finish: boolean) => {
                    this.onLevelFinishedChange(finish);
                });
            }
            if (c.supportsLevelFailed) {
                this.connection.onLevelFailedChange.register((failed: boolean) => {
                    this.onLevelFailedChange(failed);
                });
            }
            if (c.supportsLevelQuit) {
                this.connection.onLevelQuitChange.register((quit: boolean) => {
                    this.onLevelQuitChange(quit);
                });
            }

            if (c.supportsMultiplayer) {
                this.connection.onMultiplayerChange.register((isMultiplayer: boolean) => {
                    this.onMultiplayerChange(isMultiplayer);
                });
            }

            if (c.supportsPreviousScore) {
                this.connection.onPreviousScoreChange.register((a) => {
                    this.onPreviousScoreChange(a);
                });
            }
            if (c.supportsPlayerColorsUsage) {
                this.connection.onPlayerColorAChange.register((newColor: Color) => {
                    this.setBackgroundColor(newColor);
                });
                this.connection.onPlayerColorBChange.register((newColor: Color) => {
                    this.setTextColor(newColor);
                });
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

            this.connection.disconnect();
            this.connection.onUnregister();

            this.connection.onComboChange.unregister();
            this.connection.onMissChange.unregister();
            this.connection.onScoreChange.unregister();
            this.connection.onMaxScoreChange.unregister();
            this.connection.onPreviousScoreChange.unregister();
            this.connection.onBlockSpeedChange.unregister();
            this.connection.onBpmChange.unregister();
            this.connection.onHealthChange.unregister();
            this.connection.onAccuracyChange.unregister();
            this.connection.onTimeElapsedChange.unregister();
            this.connection.onTimeLengthChange.unregister();
            this.connection.onRankChange.unregister();
            this.connection.onFullComboChange.unregister();

            this.connection.onModifierChange.unregister();
            this.connection.onModifierNoFailChange.unregister();
            this.connection.onModifierOneLifeChange.unregister();
            this.connection.onModifierFourLivesChange.unregister();
            this.connection.onModifierNoBombsChange.unregister();
            this.connection.onModifierNoWallsChange.unregister();
            this.connection.onModifierNoArrowsChange.unregister();
            this.connection.onModifierGhostNotesChange.unregister();
            this.connection.onModifierDisappearingArrowsChange.unregister();
            this.connection.onModifierSmallNotesChange.unregister();
            this.connection.onModifierProModeChange.unregister();
            this.connection.onModifierStrictAnglesChange.unregister();
            this.connection.onModifierZenModeChange.unregister();
            this.connection.onModifierSlowerSongChange.unregister();
            this.connection.onModifierFasterSongChange.unregister();
            this.connection.onModifierSuperFastSongChange.unregister();

            this.connection.onPracticeModeChange.unregister();
            this.connection.onPracticeModeSpeedChange.unregister();
            this.connection.onPracticeModeTimeOffset.unregister();

            this.connection.onKeyChange.unregister();
            this.connection.onPreviousKeyChange.unregister();
            this.connection.onSongInfoMapperNameChange.unregister();
            this.connection.onSongInfoDifficultyChange.unregister();
            this.connection.onSongInfoCustomDifficultyChange.unregister();
            this.connection.onSongInfoSongAuthorChange.unregister();
            this.connection.onSongInfoSongNameChange.unregister();
            this.connection.onSongInfoCoverImageChange.unregister();
            this.connection.onStarChange.unregister();

            this.connection.onLevelChange.unregister();
            this.connection.onLevelPausedChange.unregister();
            this.connection.onLevelFinishedChange.unregister();
            this.connection.onLevelFailedChange.unregister();
            this.connection.onLevelQuitChange.unregister();

            this.connection.onMultiplayerChange.unregister();
            this.connection.onPlayerColorAChange.unregister();
            this.connection.onPlayerColorBChange.unregister();
        }

        /**
         * helper function to check if compatibility bit is set and registers event to property with callback if true or false
         * @param value compatibility bit
         * @param isModifier true if the element is a modifier
         * @param element element to enable/disable
         * @param event EventProperty<T> to register to
         * @param callback callback for event
         * @param ifNotCallback callback if value is false
         * @private
         */
        private checkCompatibility<T>(value: boolean, isModifier: boolean, element: HTMLDivElement | HTMLSpanElement, event: EventProperty<T>, callback: (T) => void, ifNotCallback: () => void = null): void {
            if (!isModifier) {
                if (element.tagName.toLowerCase() == 'div') {
                    element.display(value);
                } else {
                    element.inline(value);
                }
            }
            if (value) {
                event.register(callback);
            } else {
                if (typeof ifNotCallback == 'function') {
                    ifNotCallback();
                }
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
            if (!this.config.looks.animateScore.Value) {
                this.scoreIncrementorInternal(score);
                return;
            }

            this.currentScore = score;
        }

        /**
         * saves previous score of currently played map for combo display purposes
         * @param previousScore
         * @private
         */
        private onPreviousScoreChange(previousScore: number): void {
            this.valuePreviousScore = previousScore;
        }

        /**
         * changes the text of the block speed element
         * @param blockSpeed
         * @private
         */
        private onBlockSpeedChange(blockSpeed: number): void {
            this.blockSpeedValue.innerText = blockSpeed.toFixed();
        }

        /**
         * changes the text of the BPM element
         * @param bpm
         * @private
         */
        private onBpmChange(bpm: number): void {
            this.bpmValue.innerText = bpm.toFixed();
        }

        /**
         * changes the health circle progress and text based on given value
         * @param health
         * @private
         */
        private onHealthChange(health: number): void {
            this.healthCircleBar.setProgress(health, 100, 0);
        }

        /**
         * changes the accuracy circle progress and text based on given value
         * @param accuracy
         * @private
         */
        private onAccuracyChange(accuracy: number): void {
            this.accuracyCircleBar.setProgress(accuracy);
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
            let currentTime = this.levelIsPaused && (new Date()).getSeconds() % 2 == 0 ? ' ' : value.toDateString(false);
            let text: string;
            if (this.config.looks.timeCircleLikeOtherCircles.Value) {
                text = 'Time<br>' + currentTime;
            } else {
                if (total == undefined) {
                    total = 120;
                }
                text = currentTime + '<br>' + total.toDateString(false);
            }

            this.timeCircleBar.setText(text);
        }

        /**
         * displays rank info
         * @param rank
         * @private
         */
        private onRankChange(rank: string): void {
            rank = rank.toUpperCase();
            if (rank == 'SS') {
                this.accuracyRank.removeClass<HTMLDivElement>('acc_sss').addClass('acc_ss');
            } else if (rank == 'SSS') {
                this.accuracyRank.removeClass<HTMLDivElement>('acc_ss').addClass('acc_sss');
            } else {
                this.accuracyRank.removeClass('acc_ss', 'acc_sss');
            }
            this.accuracyRank.innerText = rank;
        }

        /**
         * displays or hides full combo bar
         * @param hasFullCombo
         * @private
         */
        private onFullComboChange(hasFullCombo: boolean): void {
            this.fullCombo.display(hasFullCombo);
        }

        /**
         * trigger what should happen when any modifier gets changed
         * @param toggled
         * @private
         */
        private onModifierChange(toggled: boolean): void {
            this.addModifierClasses();
        }

        /**
         * displays or hides no fail modifier
         * @param modifier
         * @private
         */
        private onModifierNoFailChange(modifier: boolean): void {
            this.displayModifier(this.modifierNoFailOn0Energy, modifier);
        }

        /**
         * displays or hides one life modifier
         * @param modifier
         * @private
         */
        private onModifierOneLifeChange(modifier: boolean): void {
            this.displayModifier(this.modifierOneLife, modifier);
        }

        /**
         * displays or hides four lives modifier
         * @param modifier
         * @private
         */
        private onModifierFourLivesChange(modifier: boolean): void {
            this.displayModifier(this.modifierFourLives, modifier);
        }

        /**
         * displays or hides no bombs modifier
         * @param modifier
         * @private
         */
        private onModifierNoBombsChange(modifier: boolean): void {
            this.displayModifier(this.modifierNoBombs, modifier);
        }

        /**
         * displays or hides no walls modifier
         * @param modifier
         * @private
         */
        private onModifierNoWallsChange(modifier: boolean): void {
            this.displayModifier(this.modifierNoWalls, modifier);
        }

        /**
         * displays or hides no arrows modifier
         * @param modifier
         * @private
         */
        private onModifierNoArrowsChange(modifier: boolean): void {
            this.displayModifier(this.modifierNoArrows, modifier);
        }

        /**
         * displays or hides ghost notes modifier
         * @param modifier
         * @private
         */
        private onModifierGhostNotesChange(modifier: boolean): void {
            this.displayModifier(this.modifierGhostNotes, modifier);
        }

        /**
         * displays or hides disappearing arrows modifier
         * @param modifier
         * @private
         */
        private onModifierDisappearingArrowsChange(modifier: boolean): void {
            this.displayModifier(this.modifierDisappearingArrows, modifier);
        }

        /**
         * displays or hides small notes modifier
         * @param modifier
         * @private
         */
        private onModifierSmallNotesChange(modifier: boolean): void {
            this.displayModifier(this.modifierSmallNotes, modifier);
        }

        /**
         * displays or hides pro mode modifier
         * @param modifier
         * @private
         */
        private onModifierProModeChange(modifier: boolean): void {
            this.displayModifier(this.modifierProMode, modifier);
        }

        /**
         * displays or hides strict angles modifier
         * @param modifier
         * @private
         */
        private onModifierStrictAnglesChange(modifier: boolean): void {
            this.displayModifier(this.modifierStrictAngles, modifier);
        }

        /**
         * displays or hides zen mode modifier
         * @param modifier
         * @private
         */
        private onModifierZenModeChange(modifier: boolean): void {
            this.displayModifier(this.modifierZenMode, modifier);
        }

        /**
         * displays or hides slower song modifier
         * @param modifier
         * @private
         */
        private onModifierSlowerSongChange(modifier: boolean): void {
            this.displayModifier(this.modifierSlowerSong, modifier);
        }

        /**
         * displays or hides faster song modifier
         * @param modifier
         * @private
         */
        private onModifierFasterSongChange(modifier: boolean): void {
            this.displayModifier(this.modifierFasterSong, modifier);
        }

        /**
         * displays or hides super-fast song modifier
         * @param modifier
         * @private
         */
        private onModifierSuperFastSongChange(modifier: boolean): void {
            this.displayModifier(this.modifierSuperFastSong, modifier);
        }

        /**
         * displays or hides complete practice mode section
         * @param modifier
         * @private
         */
        private onPracticeModeChange(modifier: boolean): void {
            this.practiceModeInfo.toggleClassByValue(modifier, 'active');
        }

        /**
         * displays song speed in practice mode section
         * @param speed
         * @private
         */
        private onPracticeModeSpeedChange(speed: number): void {
            this.displayModifier(this.practiceModeSongSpeed, speed != 1);
            if (speed == 1) {
                return;
            }

            let data;
            speed = Math.floor(speed * 100);
            if (this.config.looks.speedDisplayRelative.Value) {
                speed -= 100;
                data = (speed < 0 ? '' : '+') + speed;
            } else {
                data = speed.toString();
            }
            this.practiceModeSongSpeed.innerText = this.getSongSpeedWithModifierName(data);
            this.checkIfInPracticeMode();
        }

        /**
         * displays song time offset in practice mode section
         * @param modifier
         * @private
         */
        private onPracticeModeTimeOffset(modifier: number): void {
            this.practiceModeTimeOffset.innerText = this.getSongTimeOffsetWithModifierName(modifier.toDateString(true))
            this.displayModifier(this.practiceModeTimeOffset, modifier > 0);
            this.checkIfInPracticeMode();
        }

        /**
         * will show practice mode modifier when any practice mode setting is applied
         * @private
         */
        private checkIfInPracticeMode(): void {
            if (typeof this.connection.onPracticeModeSpeedChange.Value != 'undefined' && this.connection.onPracticeModeSpeedChange.Value != 1) {
                this.onPracticeModeChange(true);
                return;
            }
            if (typeof this.connection.onPracticeModeTimeOffset.Value != 'undefined' && this.connection.onPracticeModeTimeOffset.Value > 0) {
                this.onPracticeModeChange(true);
                return;
            }
            this.onPracticeModeChange(false);
        }

        /**
         * displays the map key if available, will add border radius to cover image when hidden to match overlay style
         * @param key
         * @private
         */
        private onKeyChange(key: string): void {
            if (key.length == 0) {
                this.mapKey.visibility(false);
                this.cover.addClass('noKey');
                return;
            }
            this.cover.removeClass('noKey');
            this.mapKey.visibility(true);
            this.mapKey.innerText = key;
        }

        /**
         * changes the text for previous map key if any, does not affect if the element should be shown at all
         * @param previousKey
         * @private
         */
        private onPreviousKeyChange(previousKey: string): void {
            this.previousMapKeyValue.innerText = previousKey;
        }

        /**
         * changes the text of the mapper
         * @param mapperName
         * @private
         */
        private onSongInfoMapperNameChange(mapperName: string): void {
            this.mapper.innerText = mapperName.cleanBullshit();
        }

        /**
         * triggers the difficulty string builder when difficulty is changed
         * @param difficulty
         * @private
         */
        private onSongInfoDifficultyChange(difficulty: string): void {
            this.valueDifficulty = difficulty;
            if (this.valueCustomDifficulty == undefined) {
                this.valueCustomDifficulty = '';
            }
            this.setCompleteDifficultyLabel();
        }

        /**
         * triggers the difficulty string builder when custom difficulty is changed
         * @param difficulty
         * @private
         */
        private onSongInfoCustomDifficultyChange(difficulty: string): void {
            this.valueCustomDifficulty = difficulty;
            if (this.valueDifficulty == undefined) {
                this.valueDifficulty = '';
            }
            this.setCompleteDifficultyLabel();
        }

        /**
         * difficulty string builder to show correct difficulty based on look config
         * changes text of difficulty marquee
         * @private
         */
        private setCompleteDifficultyLabel(): void {
            let text;
            if (this.config.looks.hideDefaultDifficultyOnCustomDifficulty.Value) {
                text = this.valueCustomDifficulty.length > 0 ? this.valueCustomDifficulty : this.valueDifficulty;
            } else {
                if (this.valueCustomDifficulty === '' || this.valueCustomDifficulty === this.valueDifficulty) {
                    text = this.valueDifficulty;
                } else {
                    text = this.valueCustomDifficulty + ' - ' + this.valueDifficulty;
                }
            }
            this.marquee['difficulty'].setValue(text.cleanBullshit());
        }

        /**
         * changes the text of the artist marquee
         * @param songAuthor
         * @private
         */
        private onSongInfoSongAuthorChange(songAuthor: string): void {
            this.marquee['songArtist'].setValue(songAuthor.cleanBullshit());
        }

        /**
         * changes the text of the song name marquee
         * @param songName
         * @private
         */
        private onSongInfoSongNameChange(songName: string): void {
            this.marquee['songName'].setValue(songName.cleanBullshit());
        }

        /**
         * tries to preload cover image and displays it on success, will fall back to Beat Saber logo on failure
         * @param coverImage
         * @private
         */
        private onSongInfoCoverImageChange(coverImage: string): void {
            let i = new Image();
            i.onload = () => {
                if (i.complete) {
                    this.coverImage.style.backgroundImage = 'url(' + i.src + ')';
                }
            };
            i.onerror = () => {
                this.coverImage.style.backgroundImage = 'url(img/BS_logo.jpg)';
            };
            i.src = coverImage;
        }

        /**
         * changes text on star bar, will check if it should be shown and hides if star is less or equal to 0
         * @param stars
         * @private
         */
        private onStarChange(stars: number): void {
            if (!this.config.looks.showRanked.Value) {
                return;
            }
            // todo :: this does not seem to work anymore with DataPuller ???
            if (stars > 0) {
                this.stars.display(true);
                this.starsValue.innerText = stars.toFixed(1);
            } else {
                this.stars.display(false);
            }
        }

        /**
         * displays ranked info if performance points are greater than 0
         * @param x
         * @private
         */
        private onPerformancePointsChange(x: number): void {
            this.ranked.display(x > 0);
        }

        /**
         * trigger when level was changed, will show or hide the overlay
         * @param changed
         * @private
         */
        private onLevelChange(changed: boolean): void {
            this.showElements.Value = changed;
            if (!this.config.looks.animateScore.Value) {
                if (this.scoreAnimateInterval) {
                    window.clearInterval(this.scoreAnimateInterval);
                    this.scoreAnimateInterval = null;
                }
                return;
            }
            if (changed) {
                this.onMaxScoreChange(0);
                this.currentScore = 0;
                this.currentAnimScore = 0;
                this.scoreAnimateInterval = window.setInterval(() => {
                    this.scoreIncrementor();
                }, 5);
            } else if (this.scoreAnimateInterval) {
                window.clearInterval(this.scoreAnimateInterval);
            }
        }

        /**
         * trigger when map was paused, if changes is true it will start the blink animation on the timer, if false then stop it
         * @param changed
         * @private
         */
        private onLevelPausedChange(changed: boolean): void {
            this.levelIsPaused = changed;
            if (this.levelIsPaused) {
                this.levelIsPausedTimeInterval = window.setInterval(() => {
                    this.onTimeElapsedChangeSetText(this.connection.onTimeElapsedChange.Value, this.connection.onTimeLengthChange.Value);
                }, 1000);
            } else {
                if (this.levelIsPausedTimeInterval > 0) {
                    window.clearInterval(this.levelIsPausedTimeInterval);
                    this.onTimeElapsedChangeSetText(this.connection.onTimeElapsedChange.Value, this.connection.onTimeLengthChange.Value);
                }
            }
        }

        /**
         * trigger when level is finished, basically just reset some values
         * @param changed
         * @private
         */
        private onLevelFinishedChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        /**
         * trigger when level was failed, basically just reset some values
         * @param changed
         * @private
         */
        private onLevelFailedChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        /**
         * trigger when level was quit, basically just reset some values
         * @param changed
         * @private
         */
        private onLevelQuitChange(changed: boolean): void {
            this.valuePreviousScore = 0;
        }

        private onMultiplayerChange(isMultiplayer: boolean): void {
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
            return this.config.looks.shortModifierNames.Value ? offset : 'Start: ' + offset;
        }

        /**
         * generates a delta to fake animate the score counter
         * @private
         */
        private scoreIncrementor(): void {
            if (this.currentAnimScore >= this.currentScore) {
                this.scoreIncrementorInternal(this.currentScore);
                return;
            }

            let diff = this.currentScore - this.currentAnimScore;
            let step: number;

            // forgot how to make this better with math...
            if (diff > 1000) {
                step = 1000;
            } else if (diff > 100) {
                step = 100;
            } else if (diff > 10) {
                step = 10;
            } else {
                step = 1;
            }

            this.currentAnimScore += step;
            this.scoreIncrementorInternal(this.currentAnimScore);
        }

        /**
         * displays given score based on config setting
         * @param displayScore
         * @private
         */
        private scoreIncrementorInternal(displayScore: number): void {
            if (!this.connection.getCompatibility().supportsPreviousScore) {
                this.score.innerText = displayScore.toString();
                return;
            }

            switch (this.config.looks.compareWithPreviousScore.Value) {
                case 0:
                    this.score.innerText = displayScore.toString();
                    break;
                case 1:
                    this.score.innerHTML = (this.valuePreviousScore < displayScore ? '&u' : '&d') + 'arr; ' + displayScore.toString();
                    break;
                case 2:
                    this.score.innerText = (displayScore - this.valuePreviousScore).toString();
                    break;
            }
        }

        /**
         * stores possible max score for compare effects
         * @param maxScore
         * @private
         */
        private onMaxScoreChange(maxScore: number): void {
            this.totalScore = maxScore;
        }

        /**
         * calculates position and offset of it based on values
         * @param anchor
         * @param offsetX
         * @param offsetY
         * @private
         */
        private calculateHeartGraph(anchor: number, offsetX: number, offsetY: number): void {
            let style = this.heartGraphHolder.style;
            style.top = '';
            style.left = '';
            style.bottom = '';
            style.right = '';
            style.marginLeft = '';
            style.marginTop = '';

            switch (anchor) {
                case 0: // top left
                    style.left = '0px';
                    style.top = '0px';
                    style.marginLeft = offsetX + 'px';
                    style.marginTop = offsetY + 'px';
                    break;
                case 1: // top right
                    style.top = '0px';
                    style.right = '0px';
                    style.marginRight = offsetX + 'px';
                    style.marginTop = offsetY + 'px';
                    break;
                case 2: // bottom left
                    style.bottom = '0px';
                    style.left = '0px';
                    style.marginLeft = offsetX + 'px';
                    style.marginBottom = offsetY + 'px';
                    break;
                case 3: // bottom right
                    style.bottom = '0px';
                    style.right = '0px';
                    style.marginRight = offsetX + 'px';
                    style.marginBottom = offsetY + 'px';
                    break;
                case 4: // center
                    style.top = '50%';
                    style.left = '50%';
                    style.marginLeft = (-window.outerWidth / 2 + offsetX - this.config.heartRate.graph.width.Value / 2) + 'px';
                    style.marginTop = (-window.outerHeight / 2 + offsetY - this.config.heartRate.graph.height.Value / 2) + 'px';
                    break;
            }
        }

        /**
         * draws stored heart data to canvas if enabled
         * also autodetect min and max bpm values to fill the entire canvas all the time
         * @private
         */
        private drawHeartGraph(): void {
            if (!this.config.heartRate.graph.enabled.Value) {
                return;
            }

            let bpm = this.heartRate.bpm.Value;
            if (bpm <= 0) {
                let deathCheck = this.heartGraphList.length > 0
                    ? this.heartGraphList[this.heartGraphList.length - 1]
                    : -1;
                this.heartGraphList.push(deathCheck);
            } else {
                this.heartGraphList.push(bpm);
            }

            while (this.heartGraphList.length > Freakylay.Internal.Config.HeartGraph.MaxTimespan) {
                this.heartGraphList.shift();
            }

            let eventCount = this.config.heartRate.graph.eventsToShow.Value;

            let data = (
                this.heartGraphList.length > eventCount
                    ? this.heartGraphList.slice(-eventCount)
                    : this.heartGraphList
            ).filter(x => x > 0);

            if (data.length == 0) {
                data = [0];
            }

            let color = this.config.heartRate.graph.useBackground.Value
                ? this.config.colors.text.Value.toCss()
                : this.config.heartRate.graph.useBackgroundColorForStroke.Value
                    ? this.config.colors.background.Value.toCss()
                    : this.config.colors.text.Value.toCss();

            let minBpm = Math.min(...data);
            let maxBpm = this.config.heartRate.useDynamicBpm.Value
                ? Math.max(...data)
                : this.heartRate.maxBpm.Value;
            let canvasWidth = this.config.heartRate.graph.width.Value;
            let canvasHeight = this.config.heartRate.graph.height.Value;
            let lastY = 0;
            let lastBpm = 0;
            let bigFontSizeHalf = this.config.heartRate.graph.bigFontSize.Value / 2;
            let boundary = 20;
            let fakeHeightMargin = 10;

            if (maxBpm - boundary < minBpm) {
                maxBpm = minBpm + boundary;
            }

            let fakeHeight = canvasHeight - fakeHeightMargin;

            this.heartGraphGfx.clearRect(0, 0, canvasWidth, canvasHeight);
            this.heartGraphGfx.beginPath();

            for (let x = 0; x < data.length; x++) {
                let y = fakeHeight - (((data[x] - minBpm) / (maxBpm - minBpm)) * fakeHeight) + fakeHeightMargin / 2;
                if (x == 0) {
                    this.heartGraphGfx.moveTo(0, y);
                } else {
                    this.heartGraphGfx.lineTo((x + 1) / data.length * canvasWidth, y);
                }
                lastY = y;
                lastBpm = data[x];
            }
            this.heartGraphGfx.strokeStyle = color;
            this.heartGraphGfx.lineWidth = 2;
            this.heartGraphGfx.stroke();

            if (!this.config.heartRate.graph.displayNumbers.Value) {
                return;
            }

            let lastBpmString = lastBpm > 0 ? lastBpm.toString() : '?';
            let xMargin = 10;

            this.heartGraphGfx.font = 'bold ' + this.config.heartRate.graph.smallFontSize.Value + 'px Montserrat';
            this.heartGraphGfx.textBaseline = 'top';
            this.heartGraphGfx.fillStyle = color;
            this.heartGraphGfx.textAlign = 'left';
            this.heartGraphGfx.fillText(maxBpm.toString(), xMargin, 5);
            this.heartGraphGfx.textBaseline = 'bottom';
            this.heartGraphGfx.fillText(minBpm.toString(), xMargin, canvasHeight - 5);
            this.heartGraphGfx.textBaseline = 'middle'
            this.heartGraphGfx.font = 'bold ' + this.config.heartRate.graph.bigFontSize.Value + 'px Montserrat';
            this.heartGraphGfx.fillText(lastBpmString, xMargin, canvasHeight / 2);
            this.heartGraphGfx.textAlign = 'right';

            if (lastY <= this.config.heartRate.graph.bigFontSize.Value) {
                lastY = this.config.heartRate.graph.bigFontSize.Value;
            } else if (lastY >= canvasHeight - this.config.heartRate.graph.bigFontSize.Value) {
                lastY = canvasHeight - this.config.heartRate.graph.bigFontSize.Value;
            }

            this.heartGraphGfx.fillText(lastBpmString, canvasWidth - xMargin, lastY + bigFontSizeHalf / 2);
        }
    }
}