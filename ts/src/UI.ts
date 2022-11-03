/*
/// <reference path="./Internal/UrlManager.ts" />
/// <reference path="./Data/MapData.ts" />
/// <reference path="./Data/LiveData.ts" />
/// <reference path="./Data/Color.ts" />
/// <reference path="./Data/Pulsoid.ts" />
/// <reference path="./UiElement/Marquee.ts" />
/// <reference path="./UiElement/CircleBar.ts" />
/// <reference path="./UiElement/ModifierUiElement.ts" />
/// <reference path="./UiElement/ColorInput.ts" />
/// <reference path="./UiElement/SettingLine.ts" />
/// <reference path="./UiElement/Tutorial.ts" />

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
    import Pulsoid = Freakylay.Data.Pulsoid;
    import Tutorial = Freakylay.UiElement.Tutorial;

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
        private pulsoidHandler: Pulsoid;
        private urlParams: URLSearchParams;
        private tutorial: Tutorial;
        private marquee: {
            songName: Marquee,
            songArtist: Marquee,
            difficulty: Marquee,
        };

        private timer: CircleBar;
        private health: CircleBar;
        private accuracy: CircleBar;
        private pulsoid: CircleBar;

        private urlText: HTMLTextAreaElement;
        private changeIp: HTMLInputElement;

        private counterSection: HTMLDivElement;
        private optionsElement: HTMLDivElement;
        private modifiersHolder: HTMLDivElement;
        private songInfoHolder: HTMLDivElement;
        private beatMapCover: HTMLDivElement;
        private pulsoidHolder: HTMLDivElement;

        public ipText: HTMLInputElement;
        public optionsLinesElement: HTMLDivElement;
        private pulsoidFeedUrlInput: HTMLInputElement;
        private pulsoidFeedTypeSelect: HTMLSelectElement;

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
            hideDefaultDifficulty: UrlParam<boolean>,
            hideAllModifiers: UrlParam<boolean>,
            pulsoidFeed: UrlParam<string>,
            skipSplash: UrlParam<boolean>,
            hideCounterSection: UrlParam<boolean>,
            hideSongInfo: UrlParam<boolean>,
            pulsoidFeedType: UrlParam<string>,
        }

        private modifiers: {
            noFail: ModifierUiElement,
            oneLife: ModifierUiElement,
            fourLives: ModifierUiElement,
            noBombs: ModifierUiElement,
            noWalls: ModifierUiElement,
            noArrows: ModifierUiElement,
            ghostNotes: ModifierUiElement,
            disappearingArrows: ModifierUiElement,
            smallNotes: ModifierUiElement,
            proMode: ModifierUiElement,
            strictAngles: ModifierUiElement,
            zenMode: ModifierUiElement,
            slowerSong: ModifierUiElement,
            fasterSong: ModifierUiElement,
            superFastSong: ModifierUiElement,
            fullCombo: ModifierUiElement,
            // self added
            percentSpeed: ModifierUiElement,
            practiceMode: ModifierUiElement,
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
                borderRadiusTopLeft: 'topLeft',
                borderRadiusTopRight: 'topRight',
                borderRadiusBottomLeft: 'bottomLeft',
                borderRadiusBottomRight: 'bottomRight',
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
            this.pulsoidHandler = new Pulsoid();

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
                hideAllModifiers: this.urlManager.registerOptionParam('q', false),
                pulsoidFeed: this.urlManager.registerOptionParam('r', ''),
                skipSplash: this.urlManager.registerOptionParam('s', false),
                hideCounterSection: this.urlManager.registerOptionParam('t', false),
                hideSongInfo: this.urlManager.registerOptionParam('u', false),
                pulsoidFeedType: this.urlManager.registerOptionParam('v', 'Disabled'),
            }

            this.urlParams = new URLSearchParams(location.search);

            document.body.ondblclick = (e) => {
                if (e.target !== this.songInfoHolder && this.uiShown || this.tutorial.isShown()) {
                    return;
                }

                this.toggleOptionPanel();
            };

            this.loadAndBuildUiElements();

            this.uiShown = true;

            this.health.setProgress(0, 100);
            this.accuracy.setProgress(0, 100);
            this.updateTimeCircleBar(0, 60)

            this.tutorial = new Tutorial();

            window.setTimeout(() => {

                if (this.urlManager.areAllDefault()) {
                    this.tutorial.show();
                } else {
                    this.tutorial.destroy();
                }

                this.buildOptionsPanel();
                this.calculateOptionPosition();
                this.openOptionPanel();
                this.updateMap({});
                this.updateLive({});
                this.onStyleChange();
                this.pulsoidHandler.start();

                window.addEventListener(Pulsoid.EVENT, (ev: CustomEvent) => {

                    let max = 210;
                    let min = 60;
                    let bpm = ev.detail;

                    if (bpm == 0) {
                        this.counterSection.removeClass('pulsoid');
                        return;
                    }
                    this.counterSection.addClass('pulsoid');

                    let currentProgress = (bpm - min).clamp(0, max - min);
                    this.pulsoid.setProgress(currentProgress, max - min);
                    this.pulsoid.setText('Heart<br>' + bpm);

                    this.pulsoidHolder.display(true);
                });

                this.pulsoidHolder.display(false);
            }, 100);
        }

        public toggleOptionPanel(): void {
            this.urlOptions.previewMode.setValue(!this.urlOptions.previewMode.getValue());

            this.openOptionPanel();
            this.onStyleChange();
        }

        public onStyleChange(): void {
            document.body.style.color = this.urlOptions.textColor.getValue().toCss();
            document.querySelectorAll('.roundBar circle').forEach((element: HTMLElement) => {
                element.style.stroke = this.urlOptions.textColor.getValue().toCss();
            }, this);
            document.querySelectorAll('.backgroundColor').forEach((element: HTMLElement) => {
                element.style.backgroundColor = this.urlOptions.backgroundColor.getValue().toCss();
            }, this);

            let shortModifiers = !this.urlOptions.shortModifierNames.getValue();

            this.modifiers.noFail.switchDisplayName(shortModifiers);
            this.modifiers.oneLife.switchDisplayName(shortModifiers);
            this.modifiers.fourLives.switchDisplayName(shortModifiers);
            this.modifiers.noBombs.switchDisplayName(shortModifiers);
            this.modifiers.noWalls.switchDisplayName(shortModifiers);
            this.modifiers.noArrows.switchDisplayName(shortModifiers);
            this.modifiers.ghostNotes.switchDisplayName(shortModifiers);
            this.modifiers.disappearingArrows.switchDisplayName(shortModifiers);
            this.modifiers.smallNotes.switchDisplayName(shortModifiers);
            this.modifiers.proMode.switchDisplayName(shortModifiers);
            this.modifiers.strictAngles.switchDisplayName(shortModifiers);
            this.modifiers.zenMode.switchDisplayName(shortModifiers);
            this.modifiers.slowerSong.switchDisplayName(shortModifiers);
            this.modifiers.fasterSong.switchDisplayName(shortModifiers);
            this.modifiers.superFastSong.switchDisplayName(shortModifiers);
            this.modifiers.fullCombo.switchDisplayName(shortModifiers);
            this.modifiers.percentSpeed.switchDisplayName(shortModifiers);
            this.modifiers.practiceMode.switchDisplayName(shortModifiers);

            this.data.previousBSRTop.visibility(this.urlOptions.showPrevBsr.getValue());
            this.data.previousBSRBottom.visibility(this.urlOptions.showPrevBsr.getValue());
            this.data.combo.display(this.urlOptions.showCombo.getValue(), true);
            this.data.bpm.display(this.urlOptions.showBpm.getValue(), true);
            this.data.njs.display(this.urlOptions.showNjs.getValue(), true);
            this.data.miss.display(this.urlOptions.missCounter.getValue(), true);

            if (this.urlOptions.previewMode.getValue()) {
                this.setPreviewData();
            } else {
                this.mapData.InLevel.setValue(false);
                this.updateMap();
            }

            let flipBorderRadius = (element: HTMLElement | SVGElement, flip: UrlParam<boolean>) => {
                let v = flip.getValue();
                element.toggleClass(!v, this.css.borderRadiusTopLeft);
                element.toggleClass(!v, this.css.borderRadiusBottomLeft);
                element.toggleClass(v, this.css.borderRadiusTopRight);
                element.toggleClass(v, this.css.borderRadiusBottomRight);
            };

            flipBorderRadius(this.songInfo.bsr, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.mapper, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.difficulty, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.artist, this.urlOptions.flipStatic);
            flipBorderRadius(this.songInfo.songName, this.urlOptions.flipStatic);

            let flipOption = this.urlOptions.flipStatic.getValue();
            let topOption = this.urlOptions.songInfoOnTop.getValue();
            this.beatMapCover.toggleClass(!flipOption && !topOption, this.css.borderRadiusBottomRight);
            this.beatMapCover.toggleClass(flipOption && !topOption, this.css.borderRadiusBottomLeft);
            this.beatMapCover.toggleClass(!flipOption && topOption, this.css.borderRadiusTopRight);
            this.beatMapCover.toggleClass(flipOption && topOption, this.css.borderRadiusTopLeft);

            let showPrevBsrOption = !this.urlOptions.showPrevBsr.getValue();
            if (flipOption) {
                if (topOption) {
                    this.beatMapCover.toggleClass(showPrevBsrOption, this.css.borderRadiusBottomLeft);
                } else {
                    this.beatMapCover.toggleClass(showPrevBsrOption, this.css.borderRadiusTopLeft);
                }
            } else {
                if (topOption) {
                    this.beatMapCover.toggleClass(showPrevBsrOption, this.css.borderRadiusBottomRight);
                } else {
                    this.beatMapCover.toggleClass(showPrevBsrOption, this.css.borderRadiusTopRight);
                }
            }

            this.songInfoHolder.toggleClass(this.urlOptions.flipStatic.getValue(), this.css.flip);
            this.modifiersHolder.toggleClass(this.urlOptions.flipModifiers.getValue(), this.css.flip);
            this.counterSection.toggleClass(this.urlOptions.flipLive.getValue(), this.css.flip);
            this.songInfoHolder.toggleClass(this.urlOptions.songInfoOnTop.getValue(), 'top');

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
                this.urlOptions.hideAllModifiers,
                this.urlOptions.hideCounterSection,
                this.urlOptions.hideSongInfo
            ].forEach(x => {
                if (!x.isDefaultValue()) {
                    options.push(x.getUrlValue());
                }
            });

            if (this.pulsoidHandler.isInitialized()) {
                options.push(this.urlOptions.pulsoidFeedType.getUrlValue());
                options.push(this.urlOptions.pulsoidFeed.getUrlValue());
            } else {
                this.pulsoidHolder.display(false);
            }

            if (options.length == 0) {
                options.push('s');
            }

            let optionsString = options.length > 0 ? '?' + options.join('&') : '';

            this.urlText.innerHTML = window.location.protocol + '//' + window.location.host + window.location.pathname + optionsString;
        }

        public buildOptionsPanel(): void {
            let backgroundColor = new ColorInput(
                'Background Color',
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
                'Text Color',
                this.urlOptions.textColor.getValue(),
                c => {
                    this.urlOptions.textColor.setValue(c);
                    this.onStyleChange();
                },
                a => {
                    return a < 127;
                }
            );

            this.pulsoidFeedUrlInput.value = this.urlOptions.pulsoidFeed.getValue();
            this.pulsoidFeedTypeSelect.value = this.urlOptions.pulsoidFeedType.getValue();

            this.pulsoidHandler.onTypeChange = (type: string) => {
                this.urlOptions.pulsoidFeedType.setValue(type);
                let settingPanel = document.getId<HTMLDivElement>('pulsoidSetting');
                let textElement = document.getId<HTMLLabelElement>('pulsoidFeedUrlText');
                let hintJsonElement = document.getId<HTMLDivElement>('pulsoidHintJson');
                let hintTokenElement = document.getId<HTMLDivElement>('pulsoidHintToken');

                switch (type) {
                    case 'Token':
                        settingPanel.display(true);
                        hintJsonElement.display(false);
                        hintTokenElement.display(true);
                        textElement.innerText = 'Token';
                        break;
                    case 'JSON':
                        settingPanel.display(true);
                        textElement.innerText = 'JSON Feed Url';
                        hintJsonElement.display(true);
                        hintTokenElement.display(false);
                        break;
                    default:
                        settingPanel.display(false);
                        hintJsonElement.display(false);
                        hintTokenElement.display(false);
                        break;
                }
                this.onStyleChange();
            }

            this.pulsoidHandler.setType(this.pulsoidFeedTypeSelect.value);
            this.pulsoidHandler.setUrl(this.pulsoidFeedUrlInput.value);

            this.pulsoidFeedTypeSelect.onchange = (e) => {
                this.pulsoidHandler.setType(this.pulsoidFeedTypeSelect.value);
            }

            new SettingLine('Short Modifiers', this.urlOptions.shortModifierNames);
            new SettingLine('Miss Counter', this.urlOptions.missCounter);
            new SettingLine('Previous BSR', this.urlOptions.showPrevBsr);
            new SettingLine('BPM', this.urlOptions.showBpm);
            new SettingLine('NJS', this.urlOptions.showNjs);
            new SettingLine('Combo', this.urlOptions.showCombo);
            new SettingLine('Score arrow pointing up or down depending on last score', this.urlOptions.showScoreIncrease);
            new SettingLine('Full Combo modifier', this.urlOptions.showFullComboModifier);
            new SettingLine('Current time only', this.urlOptions.showTimeString);
            new SettingLine('Default difficulty only when no custom difficulty exist', this.urlOptions.hideDefaultDifficulty);

            this.optionsLinesElement.append(document.create<HTMLHRElement>('hr'));

            new SettingLine('Hide all modifiers', this.urlOptions.hideAllModifiers);
            new SettingLine('Hide complete counter section', this.urlOptions.hideCounterSection, (checked: boolean) => {
                this.urlOptions.hideCounterSection.setValue(checked);
                this.hideUi();
                this.showUi();
            });
            new SettingLine('Hide complete song info', this.urlOptions.hideSongInfo, (checked: boolean) => {
                this.urlOptions.hideSongInfo.setValue(checked);
                this.hideUi();
                this.showUi();
            });

            this.optionsLinesElement.append(document.create<HTMLHRElement>('hr'));

            new SettingLine('Flip SongInfo to left', this.urlOptions.flipStatic);
            new SettingLine('Flip Modifiers to left', this.urlOptions.flipModifiers);
            new SettingLine('Flip Counter section to top', this.urlOptions.flipLive);
            new SettingLine('Flip SongInfo to top', this.urlOptions.songInfoOnTop);

            this.optionsLinesElement.append(document.create<HTMLHRElement>('hr'));

            new SettingLine('Test with Background Image', null, (checked: boolean) => {
                document.body.style.backgroundImage = checked ? 'url(img/beat-saber-5.jpg)' : 'none';
            });

            backgroundColor.createInputMenu(document.getId<HTMLDivElement>('bgColor'));
            textColor.createInputMenu(document.getId<HTMLDivElement>('color'));
        }

        public updateLive(liveData: {} = null): void {
            if (liveData != null) {
                this.liveData.update(liveData);
            }

            this.updatecounterSection();
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
            if (this.urlOptions.previewMode.getValue()) {
                this.optionsElement.addClass('show');
            } else {
                this.optionsElement.removeClass('show');
            }
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
            this.mapData.SongName.setValue('SongName & test');
            //this.mapData.SongSubName.setValue('(HARDSTYLE BUAMZ & HIGH LEVEL REMIX)');
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

            this.mapData.Modifiers.noFail.setValue(true);
            this.mapData.Modifiers.oneLife.setValue(true);
            this.mapData.Modifiers.fourLives.setValue(true);
            this.mapData.Modifiers.noBombs.setValue(true);
            this.mapData.Modifiers.noWalls.setValue(true);
            this.mapData.Modifiers.noArrows.setValue(true);
            this.mapData.Modifiers.ghostNotes.setValue(true);
            this.mapData.Modifiers.disappearingArrows.setValue(true);
            this.mapData.Modifiers.smallNotes.setValue(true);
            this.mapData.Modifiers.proMode.setValue(true);
            this.mapData.Modifiers.strictAngles.setValue(true);
            this.mapData.Modifiers.zenMode.setValue(true);
            this.mapData.Modifiers.slowerSong.setValue(true);
            this.mapData.Modifiers.fasterSong.setValue(true);
            this.mapData.Modifiers.superFastSong.setValue(true);

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
            this.modifiersHolder = document.getId<HTMLDivElement>('modifiers');
            this.modifiers = {
                noFail: new ModifierUiElement(this.modifiersHolder, 'NF', 'No Fail'),
                oneLife: new ModifierUiElement(this.modifiersHolder, 'OL', 'One Life'),
                fourLives: new ModifierUiElement(this.modifiersHolder, 'FL', 'Four Live'),
                noBombs: new ModifierUiElement(this.modifiersHolder, 'NB', 'No Bombs'),
                noWalls: new ModifierUiElement(this.modifiersHolder, 'NW', 'No Walls'),
                noArrows: new ModifierUiElement(this.modifiersHolder, 'NA', 'No Arrow'),
                ghostNotes: new ModifierUiElement(this.modifiersHolder, 'GN', 'Ghost Notes'),
                disappearingArrows: new ModifierUiElement(this.modifiersHolder, 'DA', 'Disappearing Arrows'),
                smallNotes: new ModifierUiElement(this.modifiersHolder, 'SN', 'Small Notes'),
                proMode: new ModifierUiElement(this.modifiersHolder, 'PM', 'Pro Mode'),
                strictAngles: new ModifierUiElement(this.modifiersHolder, 'SA', 'Strict Angles'),
                zenMode: new ModifierUiElement(this.modifiersHolder, 'ZM', 'Zen Mode'),
                slowerSong: new ModifierUiElement(this.modifiersHolder, 'SS', 'Slower Song'),
                fasterSong: new ModifierUiElement(this.modifiersHolder, 'FS', 'Faster Song'),
                superFastSong: new ModifierUiElement(this.modifiersHolder, 'SFS', 'Super Fast Song'),
                fullCombo: new ModifierUiElement(this.modifiersHolder, 'FC', 'Full Combo'),
                practiceMode: new ModifierUiElement(this.modifiersHolder, 'PRM', 'Practice Mode'),
                percentSpeed: new ModifierUiElement(this.modifiersHolder, '0%', '0%')
            };

            this.timer = new CircleBar(document.getId<HTMLElement>('timerHolder'));

            this.health = new CircleBar(document.getId<HTMLElement>('healthHolder'), percent => {
                return '<small>Health</small>' + parseFloat(percent).toFixed(0) + '%';
            });

            this.accuracy = new CircleBar(document.getId<HTMLElement>('accuracyHolder'), percent => {
                return '<small>Accuracy</small>' + percent + '%';
            });

            this.pulsoid = new CircleBar(document.getId<HTMLElement>('pulsoidHolder'));

            this.songInfoHolder = document.getId<HTMLDivElement>('songInfo');
            this.beatMapCover = document.getId<HTMLDivElement>('beatMapCover');
            this.songInfo = {
                bsr: document.getId<HTMLDivElement>('bsr'),
                mapper: document.getId<HTMLDivElement>('mapper'),
                difficultydocument.getIdelement<HTMLDivElement>('difficulty'),
                artist: document.getId<HTMLDivElement>('artist'),
                songName: document.getId<HTMLDivElement>('mapName'),
                cover: document.getId<HTMLDivElement>('cover')
            };

            this.counterSection = document.getId<HTMLDivElement>('counterSection');
            this.data = {
                score: document.getId<HTMLDivElement>('score'),
                combo: document.getId<HTMLDivElement>('combo'),
                previousBSRTop: document.getId<HTMLDivElement>('previousBSRTop'),
                previousBSRBottom: document.getId<HTMLDivElement>('previousBSRBottom'),
                njs: document.getId<HTMLDivElement>('njs'),
                bpm: document.getId<HTMLDivElement>('bpm'),
                miss: document.getId<HTMLDivElement>('miss'),
            };

            this.optionsElement = document.getId<HTMLDivElement>('options');
            this.optionsLinesElement = document.getId<HTMLDivElement>('optionsLines');
            this.urlText = document.getId<HTMLTextAreaElement>('urlText');

            this.marquee.songName = new Marquee(document.getId<HTMLDivElement>('marqueeSongName'));
            this.marquee.songArtist = new Marquee(document.getId<HTMLDivElement>('marqueeSongArtist'));
            this.marquee.difficulty = new Marquee(document.getId<HTMLDivElement>('marqueeDifficulty'));

            this.urlText.onclick = () => {
                //this.urlText.focus();
                //this.urlText.select();
                //document.execCommand('copy');
                navigator.clipboard.writeText(this.urlText.innerText);
            };

            this.ipText = document.getId<HTMLInputElement>('ip');
            this.changeIp = document.getId<HTMLInputElement>('changeIp');
            this.changeIp.onclick = () => {
                this.urlOptions.ip.setValue(this.ipText.value);
                //connection.reconnect(this.urlOptions.ip.getValue());
                this.onStyleChange();
            };

            this.pulsoidFeedUrlInput = document.getId<HTMLInputElement>('pulsoidFeed');
            this.pulsoidFeedTypeSelect = document.getId<HTMLSelectElement>('pulsoidFeedType');
            (document.getId<HTMLInputElement>('pulsoidFeedButton')).onclick = () => {
                this.pulsoidHandler.setUrl(this.pulsoidFeedUrlInput.value);
                this.urlOptions.pulsoidFeed.setValue(this.pulsoidHandler.getUrl());
                this.onStyleChange();
            }

            this.pulsoidHolder = document.getId<HTMLDivElement>('pulsoidHolder');
        }

        private calculateOptionPosition(): void {
            let styles = window.getComputedStyle(this.optionsElement, null)
            this.optionsElement.style.marginTop = (-parseInt(styles.getPropertyValue('height')) / 2) + 'px';
            this.optionsElement.style.marginLeft = (-parseInt(styles.getPropertyValue('width')) / 2) + 'px';
        }

        private updateTimeCircleBar(current: number, total: number): void {
            current = current.clamp(0, total);
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
            if (!this.urlOptions.hideSongInfo.getValue()) {
                this.songInfoHolder.removeClass(this.css.inactiveClass);
            }
            if (!this.urlOptions.hideCounterSection.getValue()) {
                this.counterSection.removeClass(this.css.inactiveClass);
            }
            this.modifiersHolder.removeClass(this.css.inactiveClass)
            this.uiShown = true;
        }

        private hideUi(): void {
            this.songInfoHolder.addClass(this.css.inactiveClass);
            this.counterSection.addClass(this.css.inactiveClass);
            this.modifiersHolder.addClass(this.css.inactiveClass);
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
            let hideAllModifiers = this.urlOptions.hideAllModifiers.getValue()
            for (let modifier in this.mapData.Modifiers) {
                // noinspection JSUnfilteredForInLoop
                if (typeof this.modifiers[modifier] !== 'undefined') {
                    // noinspection JSUnfilteredForInLoop
                    this.modifiers[modifier].getElement().display(hideAllModifiers ? false : this.mapData.Modifiers[modifier].getValue(), true);
                }
            }

            this.modifiers.practiceMode.getElement().display(hideAllModifiers ? false : this.mapData.PracticeMode.getValue(), true);

            // practice
            if (this.mapData.PracticeMode.getValue()) {
                let readableSpeed = parseInt((this.mapData.PracticeModeModifiers.songSpeedMul.getValue() * 100 - 100).toFixed());
                let identifier = readableSpeed > 0 ? '+' : '';

                if (readableSpeed === 100) {
                    this.modifiers.percentSpeed.getElement().display(false, true);
                } else {
                    this.modifiers.percentSpeed.getElement().display(!hideAllModifiers, true);
                    this.modifiers.percentSpeed.updateRawText((this.urlOptions.shortModifierNames.getValue() ? '' : 'Speed: ') + identifier + readableSpeed + '%');
                }

                this.modifiers.percentSpeed.getElement().display(hideAllModifiers ? false : this.mapData.PracticeModeModifiers.songSpeedMul.getValue() != 1, true);
            } else {
                this.modifiers.percentSpeed.getElement().display(false, true);
            }
        }

        private updateSongInfo(): void {
            this.beatMapCover.toggleClass(this.mapData.BSRKey.getValue().length === 0 || this.mapData.BSRKey.getValue() === 'BSRKey', this.urlOptions.flipStatic.getValue() ? this.css.borderRadiusTopRight : this.css.borderRadiusTopLeft);

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

        private updatecounterSection(): void {
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

            this.health.setProgress(parseInt(this.liveData.PlayerHealth.getValue().toFixed(0)), 100);

            // block hit scores?
        }

        private updateFullCombo(): void {
            let hasFc = this.urlOptions.showFullComboModifier.getValue() && this.liveData.FullCombo.getValue();
            if (this.urlOptions.hideAllModifiers.getValue()) {
                hasFc = false;
            }
            this.modifiers.fullCombo.getElement().display(hasFc, true);

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
                    e.parentNode.insertBefore(document.create<HTMLBRElement>('br'), e.nextSibling);
                }
            }
        }

        private static hideSetting(element: HTMLElement, value: string, prefix: string = ''): void {
            if (value.length > 0) {
                element.visibility(true);
                element.innerHTML = prefix + value;
                return;
            }

            element.visibility(false);
        }
    }
}*/