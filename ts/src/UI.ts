import {StaticData} from "./StaticData";
import {LiveData} from "./LiveData";
import {Helper} from "./Helper";
import {ColorInput} from "./ColorInput";
import {SettingLine} from "./SettingLine";
import {CircleBar} from "./CircleBar";
import {Marquee} from "./Marquee";
import {MultiConnection} from "./MultiConnection";

declare var connection: MultiConnection;

export class UI {

    private inactiveClass: string;
    private uiShown: boolean;
    private levelWasPaused: boolean;
    private mapLength: number;

    private staticData: StaticData;
    private staticDataTest: StaticData;

    private liveData: LiveData;
    private liveDataTest: LiveData;

    private urlParams: URLSearchParams;
    private marquee: Marquee;

    private timer: CircleBar;
    private health: CircleBar;
    private accuracy: CircleBar;

    private urlText: HTMLAreaElement;
    private ipText: HTMLInputElement;
    private changeIp: HTMLInputElement;

    private dataHolder: HTMLDivElement;
    private optionsElement: HTMLDivElement;
    private modifiersHolder: HTMLDivElement;
    private songInfoHolder: HTMLDivElement;
    private beatMapCover: HTMLDivElement;

    public optionsLinesElement: HTMLDivElement;

    private defaults: {
        backgroundColor: string;
        ip: string;
        textColor: string
    };
    private urlParamStrings: {
        backgroundColor: string;
        showNjs: string;
        ip: string;
        shortModifierNames: string;
        textColor: string;
        flipLive: string;
        showCombo: string;
        flipStatic: string;
        showFullComboModifier: string;
        missCounter: string;
        showBpm: string;
        showScoreIncrease: string;
        flipModifiers: string;
        showPrevBsr: string
    };
    public options: {
        backgroundColor: string;
        showNjs: boolean;
        ip: any;
        shortModifierNames: boolean;
        textColor: string;
        previewMode: boolean;
        flipLive: boolean;
        showCombo: boolean;
        flipStatic: boolean;
        showFullComboModifier: boolean;
        missCounter: boolean;
        showBpm: boolean;
        showScoreIncrease: boolean;
        flipModifiers: boolean;
        showPrevBsr: boolean
    };
    private modifiers: {
        noArrows: HTMLDivElement;
        batteryEnergy: HTMLDivElement;
        noObstacles: HTMLDivElement;
        fullCombo: HTMLDivElement;
        disappearingArrows: HTMLDivElement;
        songSpeed: HTMLDivElement;
        instantFail: HTMLDivElement;
        ghostNotes: HTMLDivElement;
        practiceMode: HTMLDivElement;
        noFail: HTMLDivElement;
        noBombs: HTMLDivElement;
        speed: HTMLDivElement
    };
    private songInfo: {
        bsr: HTMLDivElement;
        difficulty: HTMLDivElement;
        songName: HTMLDivElement;
        cover: HTMLDivElement;
        artist: HTMLDivElement;
        mapper: HTMLDivElement
    };
    private data: {
        score: HTMLDivElement;
        previousBSR: HTMLDivElement;
        njs: HTMLDivElement;
        combo: HTMLDivElement;
        bpm: HTMLDivElement;
        miss: HTMLDivElement
    };

    constructor() {
        this.inactiveClass = 'inactive';

        this.staticDataTest = new StaticData({});
        this.staticDataTest.BPM = 180;
        this.staticDataTest.BSRKey = '1234';
        this.staticDataTest.Difficulty = 'ExpertPlus';
        this.staticDataTest.Length = 120;
        this.staticDataTest.NJS = 20;
        this.staticDataTest.PreviousBSR = 'affa';
        this.staticDataTest.PreviousRecord = 123456;
        this.staticDataTest.CustomDifficultyLabel = 'CustomDifficulty';

        this.staticDataTest.Modifiers.batteryEnergy = true;
        this.staticDataTest.Modifiers.disappearingArrows = true;
        this.staticDataTest.Modifiers.ghostNotes = true;
        this.staticDataTest.Modifiers.instantFail = false;
        this.staticDataTest.Modifiers.noArrows = true;
        this.staticDataTest.Modifiers.noBombs = false;
        this.staticDataTest.Modifiers.noFail = false;
        this.staticDataTest.Modifiers.noObstacles = true;

        this.staticDataTest.PracticeMode = true;
        this.staticDataTest.PracticeModeModifiers.songSpeedMul = 1.2;
        //this.staticDataTest.PracticeModeModifiers.songSpeedMul = 0.8;

        this.liveDataTest = new LiveData({});
        this.liveDataTest.PlayerHealth = .5;
        this.liveDataTest.TimeElapsed = 10;
        this.liveDataTest.Accuracy = 50;
        this.liveDataTest.Score = 1234567;
        this.liveDataTest.Misses = 17;
        this.liveDataTest.FullCombo = true;

        this.defaults = {
            ip: '127.0.0.1',
            textColor: 'ffffff',
            backgroundColor: 'rgba(255,133,255,0.7)'
        };

        this.urlParamStrings = {
            ip: 'ip',
            backgroundColor: 'a',
            textColor: 'b',
            shortModifierNames: 'c',
            showPrevBsr: 'd',
            missCounter: 'e',
            showBpm: 'f',
            showNjs: 'g',
            showCombo: 'h',
            flipStatic: 'i',
            flipLive: 'j',
            flipModifiers: 'k',
            showScoreIncrease: 'l',
            showFullComboModifier: 'm'
        };

        this.urlParams = new URLSearchParams(location.search);

        this.options = {
            backgroundColor: Helper.fromUrlColor(this.getUrlParam(this.urlParamStrings.backgroundColor, this.defaults.backgroundColor)),
            textColor: Helper.fromUrlColor(this.getUrlParam(this.urlParamStrings.textColor, this.defaults.textColor)),
            shortModifierNames: this.urlParams.has(this.urlParamStrings.shortModifierNames),
            showPrevBsr: this.urlParams.has(this.urlParamStrings.showPrevBsr),
            previewMode: this.urlParams.has('options'),
            missCounter: !this.urlParams.has(this.urlParamStrings.missCounter),
            showBpm: !this.urlParams.has(this.urlParamStrings.showBpm),
            showNjs: !this.urlParams.has(this.urlParamStrings.showNjs),
            showCombo: !this.urlParams.has(this.urlParamStrings.showCombo),
            ip: this.getUrlParam(this.urlParamStrings.ip, this.defaults.ip),
            flipLive: this.urlParams.has(this.urlParamStrings.flipLive),
            flipStatic: this.urlParams.has(this.urlParamStrings.flipStatic),
            flipModifiers: this.urlParams.has(this.urlParamStrings.flipModifiers),
            showScoreIncrease: this.urlParams.has(this.urlParamStrings.showScoreIncrease),
            showFullComboModifier: this.urlParams.has(this.urlParamStrings.showFullComboModifier)
        };

        document.body.ondblclick = (e) => {
            if (e.target !== this.songInfoHolder) {
                return;
            }
            this.options.previewMode = !this.options.previewMode;
            this.appendNewStyles();
        };

        //this.levelWasPaused = false;
        this.getUiElements();

        this.health.setProgress(0, 1);
        this.accuracy.setProgress(0, 0);
        this.setTime(0, 60)

        this.uiShown = true;
        /*
        this.internalTimer = -1;
        this.internalInterval = 0;
         */

        this.appendNewStyles();

        window.setTimeout(() => {
            this.calculateOptionPosition();
        }, 100);
    }

    public init(): void {
        if (this.options.previewMode) {
            this.previewGameData();
        } else {
            let s = new StaticData({});
            let g = new LiveData({});
            g.InLevel = false;
            this.updateStatic(s);
            this.updateLive(g);
        }
    }

    public appendNewStyles(): void {
        document.body.style.color = this.options.textColor;
        document.querySelectorAll('.roundBar circle').forEach((element: HTMLElement) => {
            element.style.stroke = this.options.textColor;
        }, this);
        document.querySelectorAll('.backGroundColor').forEach((element: HTMLElement) => {
            element.style.backgroundColor = this.options.backgroundColor;
        }, this);

        if (this.options.shortModifierNames) {
            this.modifiers.instantFail.innerHTML = 'IF';
            this.modifiers.batteryEnergy.innerHTML = 'BE';
            this.modifiers.disappearingArrows.innerHTML = 'DA';
            this.modifiers.ghostNotes.innerHTML = 'GN';
            this.modifiers.noFail.innerHTML = 'NF';
            this.modifiers.noObstacles.innerHTML = 'NO';
            this.modifiers.noBombs.innerHTML = 'NB';
            this.modifiers.noArrows.innerHTML = 'NA';
            this.modifiers.practiceMode.innerHTML = 'PM';
            this.modifiers.fullCombo.innerHTML = 'FC';
        } else {
            this.modifiers.instantFail.innerHTML = 'Insta Fail';
            this.modifiers.batteryEnergy.innerHTML = 'Battery Energy';
            this.modifiers.disappearingArrows.innerHTML = 'Disappearing Arrows';
            this.modifiers.ghostNotes.innerHTML = 'Ghost Notes';
            this.modifiers.noFail.innerHTML = 'No Fail';
            this.modifiers.noObstacles.innerHTML = 'No Obstacles';
            this.modifiers.noBombs.innerHTML = 'No Bombs';
            this.modifiers.noArrows.innerHTML = 'No Arrows';
            this.modifiers.practiceMode.innerHTML = 'Practice Mode';
            this.modifiers.fullCombo.innerHTML = 'Full Combo';
        }

        Helper.visibility(this.data.previousBSR, this.options.showPrevBsr);
        Helper.visibility(this.data.combo, this.options.showCombo);
        Helper.display(this.data.bpm, this.options.showBpm, true);
        Helper.display(this.data.njs, this.options.showNjs, true);
        Helper.display(this.data.miss, this.options.missCounter, true);

        Helper.display(this.optionsElement, this.options.previewMode);

        if (this.options.previewMode) {
            this.calculateOptionPosition();
        }

        let options = [];

        let bg = Helper.toUrlColor(this.options.backgroundColor);
        if (bg !== this.defaults.backgroundColor) {
            options.push(this.urlParamStrings.backgroundColor + '=' + bg);
        }

        let tc = Helper.toUrlColor(this.options.textColor);
        if (tc !== this.defaults.textColor) {
            options.push(this.urlParamStrings.textColor + '=' + tc);
        }

        let switchRadius = (element, value) => {
            Helper.toggleClass(element, !value, 'borderRadiusTopLeft');
            Helper.toggleClass(element, !value, 'borderRadiusBottomLeft');
            Helper.toggleClass(element, value, 'borderRadiusTopRight');
            Helper.toggleClass(element, value, 'borderRadiusBottomRight');
        }

        switchRadius(this.songInfo.bsr, this.options.flipStatic);
        switchRadius(this.songInfo.mapper, this.options.flipStatic);
        switchRadius(this.songInfo.difficulty, this.options.flipStatic);
        switchRadius(this.songInfo.artist, this.options.flipStatic);
        switchRadius(this.songInfo.songName, this.options.flipStatic);

        Helper.toggleClass(this.beatMapCover, !this.options.flipStatic, 'borderRadiusBottomRight');
        Helper.toggleClass(this.beatMapCover, this.options.flipStatic, 'borderRadiusBottomLeft');
        if (this.options.flipStatic) {
            Helper.toggleClass(this.beatMapCover, !this.options.showPrevBsr, 'borderRadiusTopLeft');
        } else {
            Helper.toggleClass(this.beatMapCover, !this.options.showPrevBsr, 'borderRadiusTopRight');
        }

        Helper.toggleClass(this.songInfoHolder, this.options.flipStatic, 'flip');
        Helper.toggleClass(this.modifiersHolder, this.options.flipModifiers, 'flip');
        Helper.toggleClass(this.dataHolder, this.options.flipLive, 'flip');

        if (this.options.ip !== this.defaults.ip) {
            options.push(this.urlParamStrings.ip + '=' + this.options.ip);
        }

        let pushData = [
            'shortModifierNames',
            'showPrevBsr',
            '!missCounter',
            '!showBpm',
            '!showNjs',
            '!showCombo',
            'flipStatic',
            'flipLive',
            'flipModifiers',
            'showScoreIncrease',
            'showFullComboModifier'
        ];

        for (let x of pushData) {
            if (x.substring(0, 1) === '!') {
                x = x.substring(1, x.length);
                if (!this.options[x]) {
                    options.push(this.urlParamStrings[x]);
                }
                continue;
            }

            if (this.options[x]) {
                options.push(this.urlParamStrings[x]);
            }
        }

        let optionsString = options.length > 0 ? '?' + options.join('&') : '';

        this.urlText.innerHTML = window.location.protocol + '//' + window.location.host + window.location.pathname + optionsString;
        this.previewGameData();
    }

    public buildOptionsPanel(): void {
        let backgroundColor = new ColorInput(
            this.options.backgroundColor,
            c => {
                this.options.backgroundColor = c;
                this.appendNewStyles();
            },
            a => {
                return a < 127 || a > 230;
            }
        );

        let textColor = new ColorInput(
            this.options.textColor,
            c => {
                this.options.textColor = c;
                this.appendNewStyles();
            },
            a => {
                return a < 127;
            }
        );

        new SettingLine('Short Modifiers', 'shortModifierNames');
        new SettingLine('Miss Counter', 'missCounter');

        //this.optionsLinesElement.append(Helper.create('hr'));

        new SettingLine('Previous BSR', 'showPrevBsr');
        new SettingLine('BPM', 'showBpm');
        new SettingLine('NJS', 'showNjs');
        new SettingLine('Combo', 'showCombo');
        new SettingLine('Score arrow pointing up or down depending on last score', 'showScoreIncrease');
        new SettingLine('Full Combo modifier', 'showFullComboModifier');

        this.optionsLinesElement.append(Helper.create('hr'));

        new SettingLine('Flip SongInfo to left', 'flipStatic');
        new SettingLine('Flip Modifiers to left', 'flipModifiers');
        new SettingLine('Flip Counter section to top', 'flipLive');

        this.optionsLinesElement.append(Helper.create('hr'));

        new SettingLine('Test with Background Image', (checked) => {
            document.body.style.backgroundImage = checked ? 'url(img/beat-saber-5.jpg)' : 'none';
        }, true);

        backgroundColor.createInputMenu(Helper.element('bgColor') as HTMLDivElement);
        textColor.createInputMenu(Helper.element('color') as HTMLDivElement);
    }

    private previewGameData(): void {
        this.updateStatic(this.staticDataTest);
        this.updateLive(this.liveDataTest);
    }

    private getUiElements(): void {
        this.modifiersHolder = Helper.element('modifiers') as HTMLDivElement;
        this.modifiers = {
            instantFail: Helper.element('IF') as HTMLDivElement,
            batteryEnergy: Helper.element('BE') as HTMLDivElement,
            disappearingArrows: Helper.element('DA') as HTMLDivElement,
            ghostNotes: Helper.element('GN') as HTMLDivElement,
            speed: Helper.element('speed') as HTMLDivElement,
            noFail: Helper.element('NF') as HTMLDivElement,
            noObstacles: Helper.element('NO') as HTMLDivElement,
            noBombs: Helper.element('NB') as HTMLDivElement,
            noArrows: Helper.element('NA') as HTMLDivElement,
            practiceMode: Helper.element('PM') as HTMLDivElement,
            songSpeed: Helper.element('songSpeed') as HTMLDivElement,
            fullCombo: Helper.element('FC') as HTMLDivElement
        };

        this.timer = new CircleBar(Helper.element('timerHolder') as HTMLElement);

        this.health = new CircleBar(Helper.element('healthHolder') as HTMLElement, percent => {
            return '<small>Health</small>' + parseFloat(percent).toFixed(0) + '%';
        });

        this.accuracy = new CircleBar(Helper.element('accuracyHolder') as HTMLElement, percent => {
            return '<small>Accuracy</small>' + percent + '%';
        });

        this.songInfoHolder = Helper.element('songInfo') as HTMLDivElement;
        this.beatMapCover = Helper.element('beatMapCover') as HTMLDivElement;
        this.songInfo = {
            bsr: Helper.element('bsr') as HTMLDivElement,
            mapper: Helper.element('mapper') as HTMLDivElement,
            difficulty: Helper.element('difficulty') as HTMLDivElement,
            artist: Helper.element('artist') as HTMLDivElement,
            songName: Helper.element('mapName') as HTMLDivElement,
            cover: Helper.element('cover') as HTMLDivElement
        };

        this.dataHolder = Helper.element('downSection') as HTMLDivElement;
        this.data = {
            score: Helper.element('score') as HTMLDivElement,
            combo: Helper.element('combo') as HTMLDivElement,
            previousBSR: Helper.element('previousBSR') as HTMLDivElement,
            njs: Helper.element('njs') as HTMLDivElement,
            bpm: Helper.element('bpm') as HTMLDivElement,
            miss: Helper.element('miss') as HTMLDivElement,
        };

        this.optionsElement = Helper.element('options') as HTMLDivElement;
        this.optionsLinesElement = Helper.element('optionsLines') as HTMLDivElement;
        this.urlText = Helper.element('urlText') as HTMLAreaElement;

        this.marquee = new Marquee();

        this.urlText.onclick = () => {
            this.urlText.focus(); //.select();
            document.execCommand('copy');
        };

        this.ipText = Helper.element('ip') as HTMLInputElement;
        this.changeIp = Helper.element('changeIp') as HTMLInputElement;
        this.changeIp.onclick = () => {
            let f = this.ipText.value.split(':');
            if (!f[1] || typeof f[1] === 'undefined') {
                f[1] = "2946";
            }
            connection.reconnect(f[0], parseInt(f[1]));
        }
    }

    private calculateOptionPosition(): void {
        let styles = window.getComputedStyle(this.optionsElement, null)
        this.optionsElement.style.marginTop = (-parseInt(styles.getPropertyValue('height')) / 2) + 'px';
        this.optionsElement.style.marginLeft = (-parseInt(styles.getPropertyValue('width')) / 2) + 'px';
    }

    private getUrlParam(key: string, def: any): any {
        if (!this.urlParams.has(key)) {
            return def;
        }
        let x = this.urlParams.get(key);
        return x === null ? def : x;
    }

    private setTime(current: number, total: number): void {
        if (current > total) {
            // uhm?
            current = total;
        }

        //this.timer.setText('<small>Time</small>' + this.getDate(current) + '<br>' + this.getDate(total));
        this.timer.setText(UI.getDate(current) + '<br>' + UI.getDate(total));
        this.timer.setProgress(current, total);
    }

    private static getDate(input: number): string {
        let seconds = input % 60;
        let minutes = Math.floor(input / 60);

        let sSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

        return minutes < 0 ? sSeconds : minutes + ':' + seconds;
    }

    /*
    getTimeElapsed() {
        return Math.round(this.liveData.TimeElapsed / this.staticData.PracticeModeModifiers.songSpeedMul);
    }
     */

    public updateLive(liveData: LiveData): void {
        this.liveData = liveData;
        // toggle ui
        if (this.options.previewMode || this.liveData.InLevel && !this.uiShown) {

            Helper.removeClass(this.songInfoHolder, this.inactiveClass);
            Helper.removeClass(this.dataHolder, this.inactiveClass);
            Helper.removeClass(this.modifiersHolder, this.inactiveClass);

            this.uiShown = true;
            /*
            this.timerAdjusted = false;
            this.internalTimer = this.getTimeElapsed();

            /*
            this.internalInterval = window.setInterval(() => {
                if (this.liveData.LevelPaused) {
                    this.levelWasPaused = true;
                } else if (!this.liveData.LevelPaused && !this.liveData.LevelFailed && !this.liveData.LevelFailed && !this.liveData.LevelQuit) {
                    if (this.levelWasPaused) {
                        this.levelWasPaused = false;
                        this.internalTimer = this.getTimeElapsed();
                    }
                    if (!this.timerAdjusted && this.getTimeElapsed() !== this.internalTimer) {
                        this.internalTimer = this.getTimeElapsed();
                        this.timerAdjusted = true;
                    } else {
                        this.internalTimer++;
                    }
                }
                this.setTime(this.internalTimer, this.mapLength);
            }, 1000);
            */

        } else if (!this.liveData.InLevel && this.uiShown) {
            Helper.addClass(this.songInfoHolder, this.inactiveClass);
            Helper.addClass(this.dataHolder, this.inactiveClass);
            Helper.addClass(this.modifiersHolder, this.inactiveClass);
            this.uiShown = false;
            this.levelWasPaused = false;
            this.marquee.stop();

            //window.clearInterval(this.internalInterval);
        }

        this.setTime(this.options.previewMode ? this.mapLength / 2 : this.liveData.TimeElapsed, this.mapLength);

        // down section
        this.accuracy.setProgress(parseFloat(this.liveData.Accuracy.toFixed(2)), 100)

        let arrow = '';

        if (this.options.showScoreIncrease) {
            let lS = this.liveData.Score;
            let pR = this.staticData.PreviousRecord;
            arrow = lS < pR ? '&darr;' : lS > pR ? '&uarr;' : '';
        }

        this.data.combo.innerHTML = '<span>Combo</span>' + this.liveData.Combo;
        this.data.miss.innerHTML = '<span>MISS</span>' + this.liveData.Misses;
        this.data.score.innerHTML = arrow + new Intl.NumberFormat('en-US').format(this.liveData.Score).replace(/,/g, ' ');

        //this.health.setProgress(this.staticData.PracticeMode ? 100 : this.liveData.PlayerHealth.toFixed(0), 100);
        this.health.setProgress(this.staticData.Modifiers.noFail ? 100 : parseInt(this.liveData.PlayerHealth.toFixed(0)), 100);

        // block hit scores?

        let hasFc = this.options.showFullComboModifier && this.liveData.FullCombo;
        Helper.visibility(this.modifiersHolder, hasFc);
        Helper.display(this.modifiers.fullCombo, hasFc, true);
    }

    public updateStatic(staticData: StaticData): void {
        this.staticData = staticData;

        // calculate map length
        this.mapLength = this.staticData.Length;
        if (this.staticData.PracticeMode) {
            this.mapLength = Math.trunc(this.staticData.Length / this.staticData.PracticeModeModifiers.songSpeedMul);
        } else if (this.staticData.Modifiers.fasterSong || this.staticData.Modifiers.slowerSong) {
            this.mapLength = Math.trunc(this.staticData.Length * (this.staticData.Modifiers.fasterSong ? .8 : 1.15));
        }

        // modifiers panel
        let allModifiersOff = true;
        for (let modifier in this.staticData.Modifiers) {

            // noinspection JSUnfilteredForInLoop
            if (this.staticData.Modifiers[modifier]) {
                allModifiersOff = false;
            }

            // noinspection JSUnfilteredForInLoop
            if (typeof this.modifiers[modifier] !== 'undefined') {
                Helper.display(this.modifiers[modifier], this.staticData.Modifiers[modifier], true);
            }
        }

        Helper.display(this.modifiers.practiceMode, this.staticData.PracticeMode, true);

        // practice
        if (this.staticData.PracticeMode) {
            allModifiersOff = false;
            if (this.staticData.PracticeModeModifiers.songSpeedMul !== 1) {
                let str;
                if (this.staticData.PracticeModeModifiers.songSpeedMul > 1) {
                    str = this.options.shortModifierNames ? 'FS' : 'Faster Song'
                } else {
                    str = this.options.shortModifierNames ? 'SS' : 'Slower Song'
                }
                this.modifiers.speed.innerHTML = str;
                Helper.display(this.modifiers.speed, true, true);
            } else {
                Helper.display(this.modifiers.speed, false, true);
            }

            let readableSpeed = parseInt((this.staticData.PracticeModeModifiers.songSpeedMul * 100 - 100).toFixed());
            let identifier = readableSpeed > 0 ? '+' : '';

            if (readableSpeed === 100) {
                Helper.display(this.modifiers.songSpeed, false, true);
            } else {
                Helper.display(this.modifiers.songSpeed, true, true);
                this.modifiers.songSpeed.innerHTML = (this.options.shortModifierNames ? '' : 'Speed: ') + identifier + readableSpeed + '%';
            }

            Helper.display(this.modifiers.songSpeed, this.staticData.PracticeModeModifiers.songSpeedMul !== 1, true);
        } else {
            Helper.display(this.modifiers.speed, false, true);
            Helper.display(this.modifiers.songSpeed, false, true);
        }

        // full combo
        if (this.options.showFullComboModifier && typeof this.liveData !== 'undefined' && this.liveData.FullCombo) {
            allModifiersOff = false;
        }

        Helper.visibility(this.modifiersHolder, !allModifiersOff);

        // generic song info
        Helper.toggleClass(this.beatMapCover, this.staticData.BSRKey.length === 0 || this.staticData.BSRKey === 'BSRKey', this.options.flipStatic ? 'borderRadiusTopRight' : 'borderRadiusTopLeft');

        this.data.previousBSR.innerHTML = this.staticData.PreviousBSR.length > 0 ? 'Prev-BSR: ' + this.staticData.PreviousBSR : '';

        UI.hideSetting(this.songInfo.bsr, this.staticData.BSRKey === 'BSRKey' ? '' : this.staticData.BSRKey, 'BSR: ');
        UI.hideSetting(this.songInfo.mapper, this.staticData.Mapper);
        UI.hideSetting(this.songInfo.artist, this.staticData.getSongAuthorLine());
        //this.hideSetting(this.songInfo.songName, this.staticData.SongName);

        this.marquee.setValue(this.staticData.SongName);

        //Helper.toggleClass(this.songInfo.songName, !this.options.flipLive && this.staticData.SongName.length > 26, 'small');

        this.songInfo.difficulty.innerHTML = this.staticData.getFullDifficultyLabel();
        this.songInfo.cover.style.backgroundImage = 'url(\'' + this.staticData.coverImage + '\')';

        this.data.bpm.innerHTML = '<span>BPM</span>' + this.staticData.BPM;
        this.data.njs.innerHTML = '<span>NJS</span>' + this.staticData.NJS.toFixed(1);

        // previous record?

        UI.insertModifierBreakLines();
    }

    private static insertModifierBreakLines(): void {
        let modifierElements = document.querySelectorAll('#modifiers > *');
        let modifiers = [];

        for (let x of modifierElements) {
            if (x.classList.contains('modifiers')) {
                modifiers.push(x);
            } else {
                x.remove();
            }
        }

        for (let e of modifiers) {
            if (e.style.display === 'inline-block') {
                e.parentNode.insertBefore(Helper.create('br'), e.nextSibling);
            }
        }
    }

    private static hideSetting(element: HTMLElement, value: string, prefix: string = ''): void {
        if (value.length > 0) {
            Helper.visibility(element, true);
            element.innerHTML = prefix + value;
            return
        }

        Helper.visibility(element, false);
    }
}