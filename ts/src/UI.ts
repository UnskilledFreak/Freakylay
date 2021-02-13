/// <reference path="./Internal/Helper.ts" />
/// <reference path="./Internal/UrlManager.ts" />
/// <reference path="./Data/MapData.ts" />
/// <reference path="./Data/LiveData.ts" />
/// <reference path="./Data/Color.ts" />
/// <reference path="./UiElement/Marquee.ts" />
/// <reference path="./UiElement/CircleBar.ts" />
/// <reference path="./UiElement/ModifierUiElement.ts" />
/// <reference path="./UiElement/ColorInput.ts" />
/// <reference path="./UiElement/SettingLine.ts" />

namespace Freakylay {

    import MapData = Freakylay.Data.MapData;
    import LiveData = Freakylay.Data.LiveData;
    import Marquee = Freakylay.UiElement.Marquee;
    import CircleBar = Freakylay.UiElement.CircleBar;
    import ModifierUiElement = Freakylay.UiElement.ModifierUiElement;
    import Helper = Freakylay.Internal.Helper;
    import ColorInput = Freakylay.UiElement.ColorInput;
    import SettingLine = Freakylay.UiElement.SettingLine;
    import Color = Freakylay.Data.Color;
    import UrlManager = Freakylay.Internal.UrlManager;
    import UrlParam = Freakylay.Internal.UrlParam;

    export class UI {

        private readonly css: {
            inactiveClass: string,
            borderRadiusTopLeft: string,
            borderRadiusTopRight: string,
            borderRadiusBottomLeft: string,
            borderRadiusBottomRight: string,
            flip: string,
        };

        private uiShown: boolean;
        private mapLength: number;

        private readonly urlManager: UrlManager;

        private mapData: MapData;
        private liveData: LiveData;

        private urlParams: URLSearchParams;
        private marquee: {
            songName: Marquee,
            songArtist: Marquee,
            difficulty: Marquee,
        };

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

        private readonly urlOptions: {
            ip: UrlParam<string>,
            backgroundColor: UrlParam<Color>,
            textColor: UrlParam<Color>,
            shortModifierNames: UrlParam<boolean>,
            showPrevBsr: UrlParam<boolean>,
            missCounter: UrlParam<boolean>,
            showBpm: UrlParam<boolean>,
            showNjs: UrlParam<boolean>,
            showCombo: UrlParam<boolean>,
            flipStatic: UrlParam<boolean>,
            flipLive: UrlParam<boolean>,
            flipModifiers: UrlParam<boolean>,
            showScoreIncrease: UrlParam<boolean>,
            showFullComboModifier: UrlParam<boolean>,
            showTimeString: UrlParam<boolean>,
            previewMode: UrlParam<boolean>,
            songInfoOnTop: UrlParam<boolean>,
            hideDefaultDifficulty: UrlParam<boolean>
        }

        private modifiers: {
            noArrows: ModifierUiElement,
            batteryEnergy: ModifierUiElement,
            noObstacles: ModifierUiElement,
            fullCombo: ModifierUiElement,
            disappearingArrows: ModifierUiElement,
            percentSpeed: ModifierUiElement,
            instantFail: ModifierUiElement,
            ghostNotes: ModifierUiElement,
            practiceMode: ModifierUiElement,
            noFail: ModifierUiElement,
            noBombs: ModifierUiElement,
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
            previousBSRTop: HTMLDivElement;
            previousBSRBottom: HTMLDivElement;
            njs: HTMLDivElement;
            combo: HTMLDivElement;
            bpm: HTMLDivElement;
            miss: HTMLDivElement
        };

        constructor() {

            this.css = {
                inactiveClass: 'inactive',
                borderRadiusTopLeft: 'borderRadiusTopLeft',
                borderRadiusTopRight: 'borderRadiusTopRight',
                borderRadiusBottomLeft: 'borderRadiusBottomLeft',
                borderRadiusBottomRight: 'borderRadiusBottomRight',
                flip: 'flip',
            };

            this.marquee = {
                songName: null,
                songArtist: null,
                difficulty: null
            }

            this.mapData = new MapData();
            this.liveData = new LiveData();

            this.urlManager = new UrlManager();

            this.urlOptions = {
                ip: this.urlManager.registerOptionParam('ip', '127.0.0.1'),
                backgroundColor: this.urlManager.registerOptionParam('a', Color.fromUrl('rgba(255,133,255,0.7)')),
                textColor: this.urlManager.registerOptionParam('b', Color.fromUrl('ffffff')),
                shortModifierNames: this.urlManager.registerOptionParam('c', false),
                showPrevBsr: this.urlManager.registerOptionParam('d', false),
                missCounter: this.urlManager.registerOptionParam('e', true),
                showBpm: this.urlManager.registerOptionParam('f', true),
                showNjs: this.urlManager.registerOptionParam('g', true),
                showCombo: this.urlManager.registerOptionParam('h', true),
                flipStatic: this.urlManager.registerOptionParam('i', false),
                flipLive: this.urlManager.registerOptionParam('j', false),
                flipModifiers: this.urlManager.registerOptionParam('k', false),
                showScoreIncrease: this.urlManager.registerOptionParam('l', true),
                showFullComboModifier: this.urlManager.registerOptionParam('m', true),
                showTimeString: this.urlManager.registerOptionParam('n', false),
                previewMode: this.urlManager.registerOptionParam('options', false),
                songInfoOnTop: this.urlManager.registerOptionParam('o', false),
                hideDefaultDifficulty: this.urlManager.registerOptionParam('p', false),
            }

            this.urlParams = new URLSearchParams(location.search);

            document.body.ondblclick = (e) => {
                if (e.target !== this.songInfoHolder) {
                    return;
                }

                this.urlOptions.previewMode.setValue(!this.urlOptions.previewMode.getValue());

                this.openOptionPanel();
                this.onStyleChange();
            };

            this.loadAndBuildUiElements();

            this.uiShown = true;

            this.health.setProgress(0, 100);
            this.accuracy.setProgress(0, 100);
            this.updateTimeCircleBar(0, 60)

            window.setTimeout(() => {
                this.buildOptionsPanel();
                this.calculateOptionPosition();
                this.openOptionPanel();
                this.updateMap({});
                this.updateLive({});
                this.onStyleChange();
            }, 100);
        }

        public onStyleChange(): void {
            document.body.style.color = this.urlOptions.textColor.getValue().toRgb();
            document.querySelectorAll('.roundBar circle').forEach((element: HTMLElement) => {
                element.style.stroke = this.urlOptions.textColor.getValue().toRgb();
            }, this);
            document.querySelectorAll('.backGroundColor').forEach((element: HTMLElement) => {
                element.style.backgroundColor = this.urlOptions.backgroundColor.getValue().toRgb();
            }, this);

            this.modifiers.instantFail.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.batteryEnergy.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.disappearingArrows.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.ghostNotes.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.noFail.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.noObstacles.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.noBombs.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.noArrows.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.practiceMode.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());
            this.modifiers.fullCombo.switchDisplayName(!this.urlOptions.shortModifierNames.getValue());

            Helper.visibility(this.data.previousBSRTop, this.urlOptions.showPrevBsr.getValue());
            Helper.visibility(this.data.previousBSRBottom, this.urlOptions.showPrevBsr.getValue());
            Helper.display(this.data.combo, this.urlOptions.showCombo.getValue(), true);
            Helper.display(this.data.bpm, this.urlOptions.showBpm.getValue(), true);
            Helper.display(this.data.njs, this.urlOptions.showNjs.getValue(), true);
            Helper.display(this.data.miss, this.urlOptions.missCounter.getValue(), true);

            if (this.urlOptions.previewMode.getValue()) {
                this.setPreviewData();
            } else {
                this.mapData.InLevel.setValue(false);
                this.updateMap();
            }

            let flipBorderRadius = (element: HTMLElement | SVGElement, flip: UrlParam<boolean>) => {
                let v = flip.getValue();
                Helper.toggleClass(element, !v, this.css.borderRadiusTopLeft);
                Helper.toggleClass(element, !v, this.css.borderRadiusBottomLeft);
                Helper.toggleClass(element, v, this.css.borderRadiusTopRight);
                Helper.toggleClass(element, v, this.css.borderRadiusBottomRight);
            }

            flipBorderRadius(this.songInfo.bsr, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.mapper, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.difficulty, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.artist, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.songName, this.urlOptions.flipStatic);

            let flipOption = this.urlOptions.flipStatic.getValue();
            let topOption = this.urlOptions.songInfoOnTop.getValue();
            Helper.toggleClass(this.beatMapCover, !flipOption && !topOption, this.css.borderRadiusBottomRight);
            Helper.toggleClass(this.beatMapCover, flipOption && !topOption, this.css.borderRadiusBottomLeft);
            Helper.toggleClass(this.beatMapCover, !flipOption && topOption, this.css.borderRadiusTopRight);
            Helper.toggleClass(this.beatMapCover, flipOption && topOption, this.css.borderRadiusTopLeft);

            let showPrevBsrOption = !this.urlOptions.showPrevBsr.getValue();
            if (flipOption) {
                if (topOption) {
                    Helper.toggleClass(this.beatMapCover, showPrevBsrOption, this.css.borderRadiusBottomLeft);
                } else {
                    Helper.toggleClass(this.beatMapCover, showPrevBsrOption, this.css.borderRadiusTopLeft);
                }
            } else {
                if (topOption) {
                    Helper.toggleClass(this.beatMapCover, showPrevBsrOption, this.css.borderRadiusBottomRight);
                } else {
                    Helper.toggleClass(this.beatMapCover, showPrevBsrOption, this.css.borderRadiusTopRight);
                }
            }

            Helper.toggleClass(this.songInfoHolder, this.urlOptions.flipStatic.getValue(), this.css.flip);
            Helper.toggleClass(this.modifiersHolder, this.urlOptions.flipModifiers.getValue(), this.css.flip);
            Helper.toggleClass(this.dataHolder, this.urlOptions.flipLive.getValue(), this.css.flip);

            Helper.toggleClass(this.songInfoHolder, this.urlOptions.songInfoOnTop.getValue(), 'top');

            let options: string[] = [];

            if (!this.urlOptions.backgroundColor.isDefaultValue()) {
                options.push(this.urlOptions.backgroundColor.getUrlValue());
            }
            if (!this.urlOptions.textColor.isDefaultValue()) {
                options.push(this.urlOptions.textColor.getUrlValue());
            }
            if (!this.urlOptions.ip.isDefaultValue()) {
                options.push(this.urlOptions.ip.getUrlValue());
            }

            [
                this.urlOptions.shortModifierNames,
                this.urlOptions.showPrevBsr,
                this.urlOptions.missCounter,
                this.urlOptions.showBpm,
                this.urlOptions.showNjs,
                this.urlOptions.showCombo,
                this.urlOptions.flipStatic,
                this.urlOptions.flipLive,
                this.urlOptions.flipModifiers,
                this.urlOptions.showScoreIncrease,
                this.urlOptions.showFullComboModifier,
                this.urlOptions.showTimeString,
                this.urlOptions.songInfoOnTop,
                this.urlOptions.hideDefaultDifficulty,
            ].forEach(x => {
                if (!x.isDefaultValue()) {
                    options.push(x.getUrlValue());
                }
            });

            let optionsString = options.length > 0 ? '?' + options.join('&') : '';

            this.urlText.innerHTML = window.location.protocol + '//' + window.location.host + window.location.pathname + optionsString;
        }

        public buildOptionsPanel(): void {
            let backgroundColor = new ColorInput(
                this.urlOptions.backgroundColor.getValue(),
                c => {
                    this.urlOptions.backgroundColor.setValue(c);
                    this.onStyleChange();
                },
                a => {
                    return a > 10 && (a < 127 || a > 230);
                }
            );

            let textColor = new ColorInput(
                this.urlOptions.textColor.getValue(),
                c => {
                    this.urlOptions.textColor.setValue(c);
                    this.onStyleChange();
                },
                a => {
                    return a < 127;
                }
            );

            new SettingLine('Short Modifiers', this.urlOptions.shortModifierNames);
            new SettingLine('Miss Counter', this.urlOptions.missCounter);
            new SettingLine('Previous BSR', this.urlOptions.showPrevBsr);
            new SettingLine('BPM', this.urlOptions.showBpm);
            new SettingLine('NJS', this.urlOptions.showNjs);
            new SettingLine('Combo', this.urlOptions.showCombo);
            new SettingLine('Score arrow pointing up or down depending on last score', this.urlOptions.showScoreIncrease);
            new SettingLine('Full Combo modifier', this.urlOptions.showFullComboModifier);
            new SettingLine('Display current time only', this.urlOptions.showTimeString);
            new SettingLine('Display default difficulty only when no custom difficulty exist', this.urlOptions.hideDefaultDifficulty);

            this.optionsLinesElement.append(Helper.create('hr'));

            new SettingLine('Flip SongInfo to left', this.urlOptions.flipStatic);
            new SettingLine('Flip Modifiers to left', this.urlOptions.flipModifiers);
            new SettingLine('Flip Counter section to top', this.urlOptions.flipLive);
            new SettingLine('Flip SongInfo to top', this.urlOptions.songInfoOnTop);

            this.optionsLinesElement.append(Helper.create('hr'));

            new SettingLine('Test with Background Image', null, (checked) => {
                document.body.style.backgroundImage = checked ? 'url(img/beat-saber-5.jpg)' : 'none';
            });

            backgroundColor.createInputMenu(Helper.element('bgColor') as HTMLDivElement);
            textColor.createInputMenu(Helper.element('color') as HTMLDivElement);
        }

        public updateLive(liveData: {} = null): void {
            if (liveData != null) {
                this.liveData.update(liveData);
            }

            this.updateDownSection();
            this.updateFullCombo();
        }

        public updateMap(mapData: {} = null): void {
            if (mapData != null) {
                this.mapData.update(mapData);
            }

            this.calculateMapLength();
            this.updateModifiers();
            this.toggleUi();
            this.updateSongInfo();
        }

        public getUrlIp(): string {
            return this.urlOptions.ip.getCheckedValue();
        }

        private openOptionPanel(): void {
            Helper.display(this.optionsElement, this.urlOptions.previewMode.getValue());
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
            //this.mapData.SongName.setValue('SongName SongName SongName SongName SongName SongName ');
            this.mapData.SongName.setValue('SongName');
            //this.mapData.SongSubName.setValue('SongSubNameSongSubNameSongSubNameSongSubNameSongSubNameSongSubNameSongSubNameSongSubName');
            this.mapData.SongSubName.setValue('SongSubName');
            //this.mapData.SongAuthor.setValue('SongAuthorSongAuthorSongAuthorSongAuthorSongAuthorSongAuthorSongAuthorSongAuthor');
            this.mapData.SongAuthor.setValue('SongAuthor');
            this.mapData.Mapper.setValue('Mapper');
            this.mapData.BSRKey.setValue('d00c');
            this.mapData.coverImage.setValue('img/BS_Logo.jpg');
            this.mapData.Length.setValue(336);
            this.mapData.TimeScale.setValue(0);
            this.mapData.MapType.setValue('Standard');
            this.mapData.Difficulty.setValue('ExpertPlus');
            //this.mapData.CustomDifficultyLabel.setValue('Freaky yeaah meow meow');
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

            this.updateMap();
            this.updateLive();
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
                previousBSRTop: Helper.element('previousBSRTop') as HTMLDivElement,
                previousBSRBottom: Helper.element('previousBSRBottom') as HTMLDivElement,
                njs: Helper.element('njs') as HTMLDivElement,
                bpm: Helper.element('bpm') as HTMLDivElement,
                miss: Helper.element('miss') as HTMLDivElement,
            };

            this.optionsElement = Helper.element('options') as HTMLDivElement;
            this.optionsLinesElement = Helper.element('optionsLines') as HTMLDivElement;
            this.urlText = Helper.element('urlText') as HTMLAreaElement;

            this.marquee.songName = new Marquee(Helper.element('marqueeSongName') as HTMLDivElement);
            this.marquee.songArtist = new Marquee(Helper.element('marqueeSongArtist') as HTMLDivElement);
            this.marquee.difficulty = new Marquee(Helper.element('marqueeDifficulty') as HTMLDivElement);

            this.urlText.onclick = () => {
                this.urlText.focus(); //.select();
                document.execCommand('copy');
            };

            this.ipText = Helper.element('ip') as HTMLInputElement;
            this.changeIp = Helper.element('changeIp') as HTMLInputElement;
            this.changeIp.onclick = () => {
                this.urlOptions.ip.setValue(this.ipText.value);
                connection.reconnect(this.urlOptions.ip.getValue());
                this.onStyleChange();
            };
        }

        private calculateOptionPosition(): void {
            let styles = window.getComputedStyle(this.optionsElement, null)
            this.optionsElement.style.marginTop = (-parseInt(styles.getPropertyValue('height')) / 2) + 'px';
            this.optionsElement.style.marginLeft = (-parseInt(styles.getPropertyValue('width')) / 2) + 'px';
        }

        private updateTimeCircleBar(current: number, total: number): void {
            current = Helper.clamp(current, 0, total);
            let text: string;
            if (this.urlOptions.showTimeString.getValue()) {
                text = 'Time<br>' + UI.getDate(current);
            } else {
                text = UI.getDate(current) + '<br>' + UI.getDate(total);
            }
            this.timer.setText(text);
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
            Helper.removeClass(this.songInfoHolder, this.css.inactiveClass);
            Helper.removeClass(this.dataHolder, this.css.inactiveClass);
            Helper.removeClass(this.modifiersHolder, this.css.inactiveClass)
            this.uiShown = true;
        }

        private hideUi(): void {
            Helper.addClass(this.songInfoHolder, this.css.inactiveClass);
            Helper.addClass(this.dataHolder, this.css.inactiveClass);
            Helper.addClass(this.modifiersHolder, this.css.inactiveClass);
            this.uiShown = false;
        }

        private toggleUi(): void {
            if (this.urlOptions.previewMode.getValue()) {
                this.showUi();
                return;
            }

            if (this.mapData.InLevel.getValue() && !this.uiShown) {
                this.showUi();
            } else if (!this.mapData.InLevel.getValue() && this.uiShown) {
                this.hideUi();
                this.marquee.songName.stop();
                this.marquee.songArtist.stop();
                this.marquee.difficulty.stop();
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
                        str = this.urlOptions.shortModifierNames.getValue() ? 'FS' : 'Faster Song'
                    } else {
                        str = this.urlOptions.shortModifierNames.getValue() ? 'SS' : 'Slower Song'
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
                    this.modifiers.percentSpeed.updateRawText((this.urlOptions.shortModifierNames.getValue() ? '' : 'Speed: ') + identifier + readableSpeed + '%');
                }

                Helper.display(this.modifiers.percentSpeed.getElement(), this.mapData.PracticeModeModifiers.songSpeedMul.getValue() != 1, true);
            } else {
                Helper.display(this.modifiers.speed.getElement(), false, true);
                Helper.display(this.modifiers.percentSpeed.getElement(), false, true);
            }
        }

        private updateSongInfo(): void {

            Helper.toggleClass(this.beatMapCover, this.mapData.BSRKey.getValue().length === 0 || this.mapData.BSRKey.getValue() === 'BSRKey', this.urlOptions.flipStatic.getValue() ? this.css.borderRadiusTopRight : this.css.borderRadiusTopLeft);

            this.data.previousBSRTop.innerHTML = this.mapData.PreviousBSR.getValue().length > 0 ? 'Prev-BSR: ' + this.mapData.PreviousBSR.getValue() : '';
            this.data.previousBSRBottom.innerHTML = this.mapData.PreviousBSR.getValue().length > 0 ? 'Prev-BSR: ' + this.mapData.PreviousBSR.getValue() : '';

            UI.hideSetting(this.songInfo.bsr, this.mapData.BSRKey.getValue() === 'BSRKey' ? '' : this.mapData.BSRKey.getValue(), 'BSR: ');
            UI.hideSetting(this.songInfo.mapper, this.mapData.Mapper.getValue());

            this.marquee.songName.setValue(this.mapData.SongName.getValue());
            this.marquee.songArtist.setValue(this.mapData.getSongAuthorLine());
            this.marquee.difficulty.setValue(this.mapData.getFullDifficultyLabel(this.urlOptions.hideDefaultDifficulty.getValue()));

            this.songInfo.cover.style.backgroundImage = 'url(\'' + this.mapData.coverImage.getValue() + '\')';

            this.data.bpm.innerHTML = '<span>BPM</span>' + this.mapData.BPM.getValue();
            this.data.njs.innerHTML = '<span>NJS</span>' + this.mapData.NJS.getValue().toFixed(1);
        }

        private updateDownSection(): void {
            this.updateTimeCircleBar(this.urlOptions.previewMode.getValue() ? this.mapLength / 2 : this.liveData.TimeElapsed.getValue(), this.mapLength);

            // down section
            this.accuracy.setProgress(parseFloat(this.liveData.Accuracy.getValue().toFixed(2)), 100)

            // previous record?
            let arrow = '';
            if (this.urlOptions.showScoreIncrease.getValue()) {
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
            let hasFc = this.urlOptions.showFullComboModifier.getValue() && this.liveData.FullCombo.getValue();
            Helper.display(this.modifiers.fullCombo.getElement(), hasFc, true);

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
            }, this);

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