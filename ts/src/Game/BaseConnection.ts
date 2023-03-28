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
        protected linkStatus: EventProperty<Freakylay.Game.GameLinkStatus>;
        protected readonly config: Config;

        /**
         * returns the unique name of the connection
         */
        public abstract getName(): string;

        /**
         * event when the connection should connect
         */
        public abstract connect(): boolean;

        /**
         * event when the connection should disconnect
         */
        public abstract disconnect(): boolean;

        /**
         * event when the connection should reconnect
         */
        public abstract reconnect(): boolean;

        /**
         * event when the connection was selected to display additional connection specific settings
         * @param settingsTab
         * @param helper
         */
        public abstract displayConnectionSettings(settingsTab: HTMLDivElement, helper: ConfigHelper): void;

        /**
         * event when the connection should unregister, this is the opposite of displayConnectionSettings()
         */
        public abstract onUnregister(): void;

        /**
         * event when the connection should load its config data if any
         * @param data
         */
        public abstract loadConfig(data: {}): void;

        /**
         * event when the connection should return its config data if any
         */
        public abstract saveConfig(): {};

        /**
         * returns true if the connection supports a custom IP
         */
        public abstract supportsCustomIp(): boolean;

        /**
         * returns true if the connection supports a custom port
         */
        public abstract supportsCustomPort(): boolean;

        /**
         * event where the connection should tell the overlay what it supports, see Compatibility class for more info
         * @protected
         */
        protected abstract setCompatibility(): void;

        /**
         * returns connected state of the connection
         * todo :: this is not used by public code, is this needed at all?
         */
        get connected(): boolean {
            return this.isConnected;
        }

        // overlay events
        // live data
        public onComboChange: EventProperty<number> = new EventProperty<number>();
        public onMissChange: EventProperty<number> = new EventProperty<number>();
        public onScoreChange: EventProperty<number> = new EventProperty<number>();
        public onMaxScoreChange: EventProperty<number> = new EventProperty<number>();
        public onPreviousScoreChange: EventProperty<number> = new EventProperty<number>();
        public onBlockSpeedChange: EventProperty<number> = new EventProperty<number>();
        public onBpmChange: EventProperty<number> = new EventProperty<number>();
        public onHealthChange: EventProperty<number> = new EventProperty<number>();
        public onAccuracyChange: EventProperty<number> = new EventProperty<number>();
        public onTimeElapsedChange: EventProperty<number> = new EventProperty<number>();
        public onTimeLengthChange: EventProperty<number> = new EventProperty<number>();
        public onRankChange: EventProperty<string> = new EventProperty<string>();
        public onFullComboChange: EventProperty<boolean> = new EventProperty<boolean>();

        // modifiers
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

        // practice mode modifiers
        public onPracticeModeChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onPracticeModeSpeedChange: EventProperty<number> = new EventProperty<number>();
        public onPracticeModeTimeOffset: EventProperty<number> = new EventProperty<number>();

        // static data, will only get changed when a new level gets loaded
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

        // level events
        public onLevelChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelPausedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelFinishedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelFailedChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onLevelQuitChange: EventProperty<boolean> = new EventProperty<boolean>();

        // misc events
        public onMultiplayerChange: EventProperty<boolean> = new EventProperty<boolean>();
        public onPlayerColorAChange: EventProperty<Color> = new EventProperty<Color>();
        public onPlayerColorBChange: EventProperty<Color> = new EventProperty<Color>();

        /**
         * internal constructor, will also register the generic modifier change event to all modifier events
         * @param gameLinkStatus
         * @param config
         * @protected
         */
        protected constructor(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>, config: Config) {
            this.linkStatus = gameLinkStatus;
            this.config = config;

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

            this.onPracticeModeChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onPracticeModeSpeedChange.register(() => {
                this.onModifierChange.Value = true;
            });
            this.onPracticeModeTimeOffset.register(() => {
                this.onModifierChange.Value = true;
            });
        }

        /**
         * returns the compatibility settings of the connection
         */
        public getCompatibility(): Compatibility {
            return this.compatibility;
        }
    }
}