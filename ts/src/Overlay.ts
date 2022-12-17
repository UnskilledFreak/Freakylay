///<reference path="Internal/Config/Config.ts"/>
///<reference path="Game/BaseGame.ts"/>
///<reference path="Game/BeatSaber/BeatSaber.ts"/>
///<reference path="Ui/TabManager.ts"/>
///<reference path="Ui/ConfigHelper.ts"/>
///<reference path="Ui/Events.ts"/>
///<reference path="Ui/Marquee.ts"/>
///<reference path="Internal/Logger.ts"/>
///<reference path="DataTransfer/Pulsoid/Pulsoid.ts"/>
namespace Freakylay {
    import Config = Freakylay.Internal.Config.Config;
    import BaseGame = Freakylay.Game.BaseGame;
    import TabManager = Freakylay.Ui.TabManager;
    import BaseConnection = Freakylay.Game.BaseConnection;
    import ConfigHelper = Freakylay.Ui.ConfigHelper;
    import Events = Freakylay.Ui.Events;
    import EventProperty = Freakylay.Internal.EventProperty;
    import Logger = Freakylay.Internal.Logger;
    import Pulsoid = Freakylay.DataTransfer.Pulsoid.Pulsoid;
    import GameLinkStatus = Freakylay.Game.GameLinkStatus;

    /**
     * main overlay class
     */
    export class Overlay {
        public static Version: string = '3.0.0';
        public static Branch: string = 'Beta';

        //private isDev: boolean = window.location.protocol == undefined || window.location.protocol == 'file:';
        private isDev: boolean = false;

        private readonly logger: Logger;
        private readonly config: Config;
        private readonly helper: ConfigHelper;
        private readonly gameList: BaseGame[];
        private readonly pulsoid: Pulsoid;
        private readonly gameLinkState: EventProperty<GameLinkStatus>;
        private readonly events: Events;
        private tabManager: TabManager;

        constructor() {
            this.logger = new Logger('Overlay');
            if (this.isDev) {
                document.querySelector('body').append(this.logger.element);
            }

            this.gameLinkState = new EventProperty<GameLinkStatus>();
            this.config = new Config();
            this.gameList = this.loadGameList();

            this.pulsoid = new Pulsoid(this.config);
            this.helper = new ConfigHelper(this.config, this.pulsoid, this.gameList, this.gameLinkState);
            this.events = new Events(this.config, this.helper, this.pulsoid);

            this.tabManager = new TabManager(this.isDev, this.events, this.config, this.gameLinkState);

            this.gameLinkState.Value = Freakylay.Game.GameLinkStatus.NotConnected;

            // force fire all events once so config values take effect after hooking into events
            this.fireAllConfigEvents(true);

            // start Pulsoid as standalone worker
            this.pulsoid.start();

            // last but not least, connect to game if any
            this.helper.onConnection.register((value) => {
                if (this.helper.onGameChange.Value == null || this.helper.onGameConnectionChange.Value == null || !value) {
                    return;
                }
                this.events.registerConnection(this.helper.onGameConnectionChange.Value);
                this.helper.onGameConnectionChange.Value.connect();
                this.fireAllConfigEvents(false);
            });
            this.helper.initLoader();

            if (this.helper.onGameChange.Value != null && this.helper.onGameConnectionChange.Value != null) {
                this.helper.onConnection.Value = true;
            }
        }

        /**
         * loads all supported games
         * @private
         */
        private loadGameList(): BaseGame[] {
            let list: BaseGame[] = [];
            Freakylay.Game.foreach((gameName: string) => {
                let game: BaseGame;
                try {
                    game = new (<any>Freakylay.Game)[gameName][gameName]();
                } catch (TypeError) {
                    return false;
                }
                if (!('initialize' in game && 'addConnections' in game && 'isValid' in game)) {
                    return false;
                }
                game.initialize();
                game.addConnections(this.loadConnectionForGame(gameName));

                if (game.isValid()) {
                    list.push(game);
                }
                return true;
            });

            return list;
        }

        /**
         * loads all supported connections for a specific game
         * @param gameName
         * @private
         */
        private loadConnectionForGame(gameName: string): BaseConnection[] {
            if (!Freakylay.Game[gameName]['Connection']) {
                return [];
            }
            let list: BaseConnection[] = [];
            Freakylay.Game[gameName]['Connection'].foreach((connectionName: string) => {
                list.push(new (<any>Freakylay.Game)[gameName]['Connection'][connectionName](this.gameLinkState, this.config));
            });
            return list;
        }

        /**
         * fires all config events after load so overlay will apply settings from config
         * @private
         */
        private fireAllConfigEvents(includeGameAndConnection: boolean): void {
            this.config.colors.text.trigger();
            this.config.colors.background.trigger();
            //this.config.colors.textIsRandom.fire();
            //this.config.colors.backgroundIsRandom.fire();

            this.config.looks.shortModifierNames.trigger();
            this.config.looks.showPreviousKey.trigger();
            this.config.looks.showMissCounter.trigger();
            this.config.looks.showBpm.trigger();
            this.config.looks.showBlockSpeed.trigger();
            this.config.looks.showCombo.trigger();
            this.config.looks.songInfoOnRightSide.trigger();
            this.config.looks.counterSectionOnTop.trigger();
            this.config.looks.modifiersOnRightSide.trigger();
            this.config.looks.compareWithPreviousScore.trigger();
            this.config.looks.hideFullComboModifier.trigger();
            this.config.looks.timeCircleLikeOtherCircles.trigger();
            this.config.looks.songInfoOnTopSide.trigger();
            this.config.looks.hideDefaultDifficultyOnCustomDifficulty.trigger();
            this.config.looks.hideAllModifiers.trigger();
            this.config.looks.showRanked.trigger();
            this.config.looks.showStars.trigger();
            this.config.looks.useMapColorForBackgroundColor.trigger();
            this.config.looks.useMapColorForTextColor.trigger();
            this.config.looks.showAccuracyRank.trigger();
            this.config.looks.borderRadius.trigger();

            this.config.pulsoid.type.trigger();
            this.config.pulsoid.tokenOrUrl.trigger();
            this.config.pulsoid.useDynamicBpm.trigger();

            if (includeGameAndConnection) {
                this.config.game.trigger();
                this.config.connection.trigger();
            }
        }
    }
}