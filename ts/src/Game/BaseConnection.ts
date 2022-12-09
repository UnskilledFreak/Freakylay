///<reference path="../Internal/EventProperty.ts"/>
namespace Freakylay.Game {
    import EventProperty = Freakylay.Internal.EventProperty;
    import Color = Freakylay.Internal.Color;
    import ConfigHelper = Freakylay.Ui.ConfigHelper;
    import Config = Freakylay.Internal.Config.Config;

    export abstract class BaseConnection {
        public ip: string;
        public port: number;

        protected compatibility: Compatibility = new Compatibility();
        protected isConnected: boolean = false;

        public abstract getName(): string;

        public abstract connect(gameLinkStatus: EventProperty<GameLinkStatus>): boolean;

        public abstract disconnect(): boolean;

        public abstract reconnect(): boolean;

        public abstract displayConnectionSettings(settingsTab: HTMLDivElement, helper: ConfigHelper, config: Config): void;

        public abstract onUnregister(): void;

        public abstract loadConfig(data: any): void;

        public abstract saveConfig(): any;

        public abstract supportsCustomIp(): boolean;

        public abstract supportsCustomPort(): boolean;

        protected abstract setCompatibility(): void;

        get connected(): boolean {
            return this.isConnected;
        }

        // overlay events
        public onComboChange: EventProperty<number> = new EventProperty<number>();
        public onMissChange: EventProperty<number> = new EventProperty<number>();
        public onScoreChange: EventProperty<number> = new EventProperty<number>();
        public onPreviousScoreChange: EventProperty<number> = new EventProperty<number>();
        public onBlockSpeedChange: EventProperty<number> = new EventProperty<number>();
        public onBpmChange: EventProperty<number> = new EventProperty<number>();
        public onHealthChange: EventProperty<number> = new EventProperty<number>();
        public onAccuracyChange: EventProperty<number> = new EventProperty<number>();
        public onTimeElapsedChange: EventProperty<number> = new EventProperty<number>();
        public onTimeLengthChange: EventProperty<number> = new EventProperty<number>();
        public onTimeScaleChange: EventProperty<number> = new EventProperty<number>();
        public onRankChange: EventProperty<string> = new EventProperty<string>();
        public onFullComboChange: EventProperty<boolean> = new EventProperty<boolean>();

        public onModifierChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierNoFailChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierOneLifeChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierFourLivesChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierNoBombsChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierNoWallsChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierNoArrowsChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierGhostNotesChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierDisappearingArrowsChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierSmallNotesChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierProModeChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierStrictAnglesChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierZenModeChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierSlowerSongChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierFasterSongChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onModifierSuperFastSongChange: EventProperty<boolean> = new EventProperty<boolean>();

        public onPracticeModeChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onPracticeModeSpeedChange: EventProperty<number> = new EventProperty<number>();
        public onPracticeModeTimeOffset: EventProperty<number> = new EventProperty<number>();

        public onKeyChange: EventProperty<string> = new EventProperty<string>();
        public onPreviousKeyChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoMapperNameChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoDifficultyChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoCustomDifficultyChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoSongAuthorChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoSongNameChange: EventProperty<string> = new EventProperty<string>();
        public onSongInfoCoverImageChange: EventProperty<string> = new EventProperty<string>();
        public onStarChange: EventProperty<number> = new EventProperty<number>();
        public onPerformancePointsChange: EventProperty<number> = new EventProperty<number>();

        public onLevelChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelPausedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelFinishedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelFailedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelQuitChange: EventProperty<boolean> = new EventProperty<boolean>();

        public onMultiplayerChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onPlayerColorAChange: EventProperty<Color> = new EventProperty<Color>();
        public onPlayerColorBChange: EventProperty<Color> = new EventProperty<Color>();

        constructor() {
            this.setCompatibility();

            this.onModifierNoFailChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierOneLifeChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierFourLivesChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierNoBombsChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierNoWallsChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierNoArrowsChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierGhostNotesChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierDisappearingArrowsChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierSmallNotesChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierProModeChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierStrictAnglesChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierZenModeChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierSlowerSongChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierFasterSongChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onModifierSuperFastSongChange.register(() => {
                this.onModifierChange.Value = true;
            });
        }

        public getCompatibility(): Compatibility {
            return this.compatibility;
        }
    }
}