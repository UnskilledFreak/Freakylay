/// <reference path="./Data/MapData.ts" />
/// <reference path="./Data/LiveData.ts" />

namespace Freakylay {

    import MapData = Freakylay.Data.MapData;
    import LiveData = Freakylay.Data.LiveData;

    export class UI {

        private readonly inactiveClass: string;
        private uiShown: boolean;
        private mapLength: number;

        private mapData: MapData;
        private liveData: LiveData;

        private urlParams: URLSearchParams;
        private marquee: Marquee;

        private timer: CircleBar;
        private health: CircleBar;
        private accuracy: CircleBar;

        private urlText: HTMLAreaElement;
        private changeIp: HTMLInputElement;

        private dataHolder: HTMLDivElement;
        private optionsElement: HTMLDivElement;
        private modifiersHolder: HTMLDivElement;
        private songInfoHolder: HTMLDivElement;
        private beatMapCover: HTMLDivElement;

        public ipText: HTMLInputElement;
        public optionsLinesElement: HTMLDivElement;

        private defaults: {
            backgroundColor: string;
            ip: string;
            textColor: string
        };
        private readonly urlParamStrings: {
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
            ip: string;
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
            noArrows: ModifierUiElement;
            batteryEnergy: ModifierUiElement;
            noObstacles: ModifierUiElement;
            fullCombo: ModifierUiElement;
            disappearingArrows: ModifierUiElement;
            percentSpeed: ModifierUiElement;
            instantFail: ModifierUiElement;
            ghostNotes: ModifierUiElement;
            practiceMode: ModifierUiElement;
            noFail: ModifierUiElement;
            noBombs: ModifierUiElement;
            speed: ModifierUiElement
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
            this.mapData = new MapData();
            this.liveData = new LiveData();

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
                backgroundColor: Helper.fromUrlColor(this.getUrlParameter(this.urlParamStrings.backgroundColor, this.defaults.backgroundColor)),
                textColor: Helper.fromUrlColor(this.getUrlParameter(this.urlParamStrings.textColor, this.defaults.textColor)),
                shortModifierNames: this.urlParams.has(this.urlParamStrings.shortModifierNames),
                showPrevBsr: this.urlParams.has(this.urlParamStrings.showPrevBsr),
                previewMode: this.urlParams.has('options'),
                missCounter: !this.urlParams.has(this.urlParamStrings.missCounter),
                showBpm: !this.urlParams.has(this.urlParamStrings.showBpm),
                showNjs: !this.urlParams.has(this.urlParamStrings.showNjs),
                showCombo: !this.urlParams.has(this.urlParamStrings.showCombo),
                ip: this.getUrlParameter(this.urlParamStrings.ip, this.defaults.ip),
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
                this.openOptionPanel();
            };

            this.loadAndBuildUiElements();

            this.uiShown = true;

            this.updateMap({});
            this.updateLive({});

            this.health.setProgress(0, 100);
            this.accuracy.setProgress(0, 100);
            this.updateTimeCircleBar(0, 60)

            window.setTimeout(() => {
                this.calculateOptionPosition();
                this.openOptionPanel();
            }, 100);
        }

        public onStyleChange(): void {
            document.body.style.color = this.options.textColor;
            document.querySelectorAll('.roundBar circle').forEach((element: HTMLElement) => {
                element.style.stroke = this.options.textColor;
            }, this);
            document.querySelectorAll('.backGroundColor').forEach((element: HTMLElement) => {
                element.style.backgroundColor = this.options.backgroundColor;
            }, this);

            this.modifiers.instantFail.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.batteryEnergy.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.disappearingArrows.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.ghostNotes.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.noFail.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.noObstacles.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.noBombs.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.noArrows.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.practiceMode.switchDisplayName(!this.options.shortModifierNames);
            this.modifiers.fullCombo.switchDisplayName(!this.options.shortModifierNames);

            this.updateInternalUi();

            Helper.visibility(this.data.previousBSR, this.options.showPrevBsr);
            Helper.visibility(this.data.combo, this.options.showCombo);
            Helper.display(this.data.bpm, this.options.showBpm, true);
            Helper.display(this.data.njs, this.options.showNjs, true);
            Helper.display(this.data.miss, this.options.missCounter, true);

            if (this.options.previewMode) {
                //this.calculateOptionPosition();
                this.setPreviewData();
            } else {
                this.mapData.InLevel.setValue(false);
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

            let switchBorderRadius = (element, value) => {
                Helper.toggleClass(element, !value, 'borderRadiusTopLeft');
                Helper.toggleClass(element, !value, 'borderRadiusBottomLeft');
                Helper.toggleClass(element, value, 'borderRadiusTopRight');
                Helper.toggleClass(element, value, 'borderRadiusBottomRight');
            }

            switchBorderRadius(this.songInfo.bsr, this.options.flipStatic);
            switchBorderRadius(this.songInfo.mapper, this.options.flipStatic);
            switchBorderRadius(this.songInfo.difficulty, this.options.flipStatic);
            switchBorderRadius(this.songInfo.artist, this.options.flipStatic);
            switchBorderRadius(this.songInfo.songName, this.options.flipStatic);

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

            if (this.options.ip != this.defaults.ip) {
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
            //this.setPreviewData();
        }

        public buildOptionsPanel(): void {
            let backgroundColor = new ColorInput(
                this.options.backgroundColor,
                c => {
                    this.options.backgroundColor = c;
                    this.onStyleChange();
                },
                a => {
                    return a > 10 && (a < 127 || a > 230);
                }
            );

            let textColor = new ColorInput(
                this.options.textColor,
                c => {
                    this.options.textColor = c;
                    this.onStyleChange();
                },
                a => {
                    return a < 127;
                }
            );

            new SettingLine('Short Modifiers', 'shortModifierNames');
            new SettingLine('Miss Counter', 'missCounter');
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

        public updateLive(liveData: {}): void {
            if (this.options.previewMode) {
                return;
            }
            this.liveData.update(liveData);
            this.updateInternalUi();
        }

        public updateMap(mapData: {}): void {
            if (this.options.previewMode) {
                return;
            }
            this.mapData.update(mapData);
            this.updateInternalUi();
        }

        private openOptionPanel(): void {
            Helper.display(this.optionsElement, this.options.previewMode);
            this.onStyleChange();
            this.updateInternalUi();
        }

        private setPreviewData(): void {
            this.mapData.GameVersion.setValue('1.13.2');
            this.mapData.PluginVersion.setValue('2.0.0.0');
            this.mapData.InLevel.setValue(true);
            this.mapData.LevelPaused.setValue(false);
            this.mapData.LevelFinished.setValue(false);
            this.mapData.LevelFailed.setValue(false);
            this.mapData.LevelQuit.setValue(false);
            this.mapData.Hash.setValue('648B7FE961C398DE638FA1E614878F1194ADF92E');
            this.mapData.SongName.setValue('SongName');
            this.mapData.SongSubName.setValue('SongSubName');
            this.mapData.SongAuthor.setValue('SongAuthor');
            this.mapData.Mapper.setValue('Mapper');
            this.mapData.BSRKey.setValue('d00c');
            this.mapData.coverImage.setValue('img/BS_Logo.jpg');
            this.mapData.Length.setValue(336);
            this.mapData.TimeScale.setValue(0);
            this.mapData.MapType.setValue('Standard');
            this.mapData.Difficulty.setValue('ExpertPlus');
            this.mapData.CustomDifficultyLabel.setValue('Freaky');
            this.mapData.BPM.setValue(200);
            this.mapData.NJS.setValue(23);
            this.mapData.ModifiersMultiplier.setValue(1);
            this.mapData.PracticeMode.setValue(true);
            this.mapData.PP.setValue(0);
            this.mapData.Star.setValue(0);
            this.mapData.IsMultiplayer.setValue(false);
            this.mapData.PreviousRecord.setValue(987123);
            this.mapData.PreviousBSR.setValue('8e9c');

            this.mapData.Modifiers.instantFail.setValue(true);
            this.mapData.Modifiers.batteryEnergy.setValue(true);
            this.mapData.Modifiers.disappearingArrows.setValue(true);
            this.mapData.Modifiers.ghostNotes.setValue(true);
            this.mapData.Modifiers.fasterSong.setValue(true);
            this.mapData.Modifiers.noFail.setValue(true);
            this.mapData.Modifiers.noObstacles.setValue(true);
            this.mapData.Modifiers.noBombs.setValue(true);
            this.mapData.Modifiers.slowerSong.setValue(true);
            this.mapData.Modifiers.noArrows.setValue(true);

            this.mapData.PracticeModeModifiers.songSpeedMul.setValue(0.8);

            this.liveData.Score.setValue(1234567);
            this.liveData.ScoreWithMultipliers.setValue(1234567);
            this.liveData.MaxScore.setValue(2345678);
            this.liveData.MaxScoreWithMultipliers.setValue(2345678);
            this.liveData.Rank.setValue('SS');
            this.liveData.FullCombo.setValue(true);
            this.liveData.Combo.setValue(322);
            this.liveData.Misses.setValue(0);
            this.liveData.Accuracy.setValue(94.21564618131514);
            this.liveData.PlayerHealth.setValue(100);
            this.liveData.TimeElapsed.setValue(66);
        }

        private loadAndBuildUiElements(): void {
            this.modifiersHolder = Helper.element('modifiers') as HTMLDivElement;
            this.modifiers = {
                instantFail: new ModifierUiElement('IF', 'IF', 'Insta Fail'),
                batteryEnergy: new ModifierUiElement('BE', 'BE', 'Battery Energy'),
                disappearingArrows: new ModifierUiElement('DA', 'DA', 'Disappearing Arrows'),
                ghostNotes: new ModifierUiElement('GN', 'GN', 'Ghost Notes'),
                speed: new ModifierUiElement('speed', 'speed', 'Speed'),
                noFail: new ModifierUiElement('NF', 'NF', 'No Fail'),
                noObstacles: new ModifierUiElement('NO', 'NO', 'No Obstacles'),
                noBombs: new ModifierUiElement('NB', 'NB', 'No Bombs'),
                noArrows: new ModifierUiElement('NA', 'NA', 'No Arrows'),
                practiceMode: new ModifierUiElement('PM', 'PM', 'Practice Mode'),
                percentSpeed: new ModifierUiElement('percentSpeed', 'percentSpeed', 'Speed'),
                fullCombo: new ModifierUiElement('FC', 'FC', 'Full Combo'),
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
                this.options.ip = this.ipText.value;
                connection.reconnect(this.ipText.value);
                this.onStyleChange();
            };
        }

        private calculateOptionPosition(): void {
            let styles = window.getComputedStyle(this.optionsElement, null)
            this.optionsElement.style.marginTop = (-parseInt(styles.getPropertyValue('height')) / 2) + 'px';
            this.optionsElement.style.marginLeft = (-parseInt(styles.getPropertyValue('width')) / 2) + 'px';
        }

        private getUrlParameter<T>(key: string, def: string): string {
            if (!this.urlParams.has(key)) {
                return def;
            }
            let x = this.urlParams.get(key);
            return x === null ? def : x;
        }

        private updateTimeCircleBar(current: number, total: number): void {
            current = Helper.clamp(current, 0, total);
            this.timer.setText(UI.getDate(current) + '<br>' + UI.getDate(total));
            this.timer.setProgress(current, total);
        }

        private calculateMapLength(): void {
            this.mapLength = this.mapData.Length.getValue();

            if (this.mapData.PracticeMode.getValue()) {
                this.mapLength = parseInt((this.mapData.Length.getValue() / this.mapData.PracticeModeModifiers.songSpeedMul.getValue()).toString());
            } else if (this.mapData.Modifiers.fasterSong.getValue() || this.mapData.Modifiers.slowerSong.getValue()) {
                this.mapLength = parseInt((this.mapData.Length.getValue() * (this.mapData.Modifiers.fasterSong ? .8 : 1.15)).toString());
            }
        }

        private showUi(): void {
            Helper.removeClass(this.songInfoHolder, this.inactiveClass);
            Helper.removeClass(this.dataHolder, this.inactiveClass);
            Helper.removeClass(this.modifiersHolder, this.inactiveClass)
            this.uiShown = true;
        }

        private hideUi(): void {
            Helper.addClass(this.songInfoHolder, this.inactiveClass);
            Helper.addClass(this.dataHolder, this.inactiveClass);
            Helper.addClass(this.modifiersHolder, this.inactiveClass);
            this.uiShown = false;
        }

        private toggleUi(): void {
            if (this.options.previewMode) {
                this.showUi();
                return;
            }

            if (this.mapData.InLevel.getValue() && !this.uiShown) {
                this.showUi();
            } else if (!this.mapData.InLevel.getValue() && this.uiShown) {
                this.hideUi();
                this.marquee.stop();
            }
        }

        private updateModifiers(): void {
            for (let modifier in this.mapData.Modifiers) {
                // noinspection JSUnfilteredForInLoop
                if (typeof this.modifiers[modifier] !== 'undefined') {
                    // noinspection JSUnfilteredForInLoop
                    Helper.display(this.modifiers[modifier].getElement(), this.mapData.Modifiers[modifier].getValue(), true);
                }
            }

            Helper.display(this.modifiers.practiceMode.getElement(), this.mapData.PracticeMode.getValue(), true);

            // practice
            if (this.mapData.PracticeMode.getValue()) {
                if (this.mapData.PracticeModeModifiers.songSpeedMul.getValue() !== 1) {
                    let str;
                    if (this.mapData.PracticeModeModifiers.songSpeedMul.getValue() > 1) {
                        str = this.options.shortModifierNames ? 'FS' : 'Faster Song'
                    } else {
                        str = this.options.shortModifierNames ? 'SS' : 'Slower Song'
                    }
                    this.modifiers.speed.updateRawText(str);
                    Helper.display(this.modifiers.speed.getElement(), true, true);
                } else {
                    Helper.display(this.modifiers.speed.getElement(), false, true);
                }

                let readableSpeed = parseInt((this.mapData.PracticeModeModifiers.songSpeedMul.getValue() * 100 - 100).toFixed());
                let identifier = readableSpeed > 0 ? '+' : '';

                if (readableSpeed === 100) {
                    Helper.display(this.modifiers.percentSpeed.getElement(), false, true);
                } else {
                    Helper.display(this.modifiers.percentSpeed.getElement(), true, true);
                    this.modifiers.percentSpeed.updateRawText((this.options.shortModifierNames ? '' : 'Speed: ') + identifier + readableSpeed + '%');
                }

                Helper.display(this.modifiers.percentSpeed.getElement(), this.mapData.PracticeModeModifiers.songSpeedMul.getValue() != 1, true);
            } else {
                Helper.display(this.modifiers.speed.getElement(), false, true);
                Helper.display(this.modifiers.percentSpeed.getElement(), false, true);
            }
        }

        private updateSongInfo(): void {
            Helper.toggleClass(this.beatMapCover, this.mapData.BSRKey.getValue().length === 0 || this.mapData.BSRKey.getValue() === 'BSRKey', this.options.flipStatic ? 'borderRadiusTopRight' : 'borderRadiusTopLeft');

            this.data.previousBSR.innerHTML = this.mapData.PreviousBSR.getValue().length > 0 ? 'Prev-BSR: ' + this.mapData.PreviousBSR.getValue() : '';

            UI.hideSetting(this.songInfo.bsr, this.mapData.BSRKey.getValue() === 'BSRKey' ? '' : this.mapData.BSRKey.getValue(), 'BSR: ');
            UI.hideSetting(this.songInfo.mapper, this.mapData.Mapper.getValue());
            UI.hideSetting(this.songInfo.artist, this.mapData.getSongAuthorLine());

            this.marquee.setValue(this.mapData.SongName.getValue());

            this.songInfo.difficulty.innerHTML = this.mapData.getFullDifficultyLabel();
            this.songInfo.cover.style.backgroundImage = 'url(\'' + this.mapData.coverImage.getValue() + '\')';

            this.data.bpm.innerHTML = '<span>BPM</span>' + this.mapData.BPM.getValue();
            this.data.njs.innerHTML = '<span>NJS</span>' + this.mapData.NJS.getValue().toFixed(1);
        }

        private updateDownSection(): void {
            this.updateTimeCircleBar(this.options.previewMode ? this.mapLength / 2 : this.liveData.TimeElapsed.getValue(), this.mapLength);

            // down section
            this.accuracy.setProgress(parseFloat(this.liveData.Accuracy.getValue().toFixed(2)), 100)

            // previous record?
            let arrow = '';
            if (this.options.showScoreIncrease) {
                let lS = this.liveData.Score.getValue();
                let pR = this.mapData.PreviousRecord.getValue();
                arrow = lS < pR ? '&darr;' : lS > pR ? '&uarr;' : '';
            }

            this.data.combo.innerHTML = '<span>Combo</span>' + this.liveData.Combo.getValue();
            this.data.miss.innerHTML = '<span>MISS</span>' + this.liveData.Misses.getValue();
            this.data.score.innerHTML = arrow + new Intl.NumberFormat('en-US').format(this.liveData.Score.getValue()).replace(/,/g, ' ');

            this.health.setProgress(this.mapData.Modifiers.noFail.getValue() ? 100 : parseInt(this.liveData.PlayerHealth.getValue().toFixed(0)), 100);

            // block hit scores?
        }

        private updateFullCombo(): void {
            let hasFc = this.options.showFullComboModifier && this.liveData.FullCombo.getValue();
            Helper.display(this.modifiers.fullCombo.getElement(), hasFc, true);
        }

        private updateInternalUi(): void {

            this.calculateMapLength();
            this.toggleUi();
            this.updateModifiers();
            this.updateSongInfo();
            this.updateDownSection();
            this.updateFullCombo();

            UI.insertModifierBreakLines();
        }

        private static getDate(input: number): string {
            let seconds = input % 60;
            let minutes = Math.floor(input / 60);

            let sSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

            return minutes < 0 ? sSeconds : minutes + ':' + sSeconds;
        }

        // todo :: rework this so there is no need to do that again
        private static insertModifierBreakLines(): void {
            let modifierElements = document.querySelectorAll('#modifiers > *');
            let modifiers = [];

            modifierElements.forEach((x: HTMLElement) => {
                if (x.classList.contains('modifiers')) {
                    modifiers.push(x);
                } else {
                    x.remove();
                }
            });

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
                return;
            }

            Helper.visibility(element, false);
        }
    }
}