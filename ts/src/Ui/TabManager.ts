///<reference path="../Game/BeatSaber/Connection/DataPuller_2_0_12.ts"/>
///<reference path="../Game/BeatSaber/Connection/DataPuller_2_1_0.ts"/>
namespace Freakylay.Ui {
    import DataPuller_2_0_12 = Freakylay.Game.BeatSaber.Connection.DataPuller_2_0_12;
    import DataPuller_2_1_0 = Freakylay.Game.BeatSaber.Connection.DataPuller_2_1_0;
    import Config = Freakylay.Internal.Config.Config;

    /**
     * tab manager for option panel
     */
    export class TabManager {
        private tabs: Tab[];

        constructor(developmentMode: boolean, events: Events, config: Config) {
            this.tabs = [];

            document.getAll<HTMLDivElement[]>('div[data-tab-name]').forEach((element: HTMLDivElement) => {
                let tab = new Tab(element.getDataAttr('tab-name'), element);
                this.tabs.push(tab);
                element.onclick = () => {
                    this.onClick(tab);
                };
            }, this);

            if (developmentMode) {
                let content = this.addTab('TEST');
                content.append(
                    document.button('DP2_0_12_PAUSE', () => {
                        let c = new DataPuller_2_0_12();
                        c.loadConfig(config.connectionSetting);
                        events.registerConnection(c);
                        c.testMapData(true);
                        c.testLiveData();
                    }),
                    document.button('DP2_0_12_NO_PAUSE', () => {
                        let c = new DataPuller_2_0_12();
                        c.loadConfig(config.connectionSetting);
                        events.registerConnection(c);
                        c.testMapData(false);
                        c.testLiveData();
                    }),
                    document.button('DP2_1_0', () => {
                        let c = new DataPuller_2_1_0();
                        c.loadConfig(config.connectionSetting);
                        events.registerConnection(c);
                        c.testMapData();
                        c.testLiveData();
                    }),
                );
            }

            this.tabs[0].show();
        }

        /**
         * on click handler when user clicks on a tab name
         * @param tab
         * @private
         */
        private onClick(tab: Tab): void {
            this.tabs.forEach((tab: Tab) => {
                tab.hide();
            }, this);

            tab.show();
        }

        /**
         * adds a new tab
         * this is clearly a hacked one because it was never designed to be dynamic...
         * @param name
         * @return HTMLDivElement
         * @private
         */
        private addTab(name: string): HTMLDivElement {
            let tabContainer = document.get<HTMLDivElement>('.tabManager > .tabs');
            let contentContainer = document.get<HTMLDivElement>('.tabManager > .tabContents');

            let head = document.div();
            head.setDataAttr('tab-name', name);
            head.addClass('tab');
            head.innerText = name;

            let container = document.div();
            container.setDataAttr('tab-content', name);
            container.addClass('tabContent');

            tabContainer.append(head);
            contentContainer.append(container);

            let tab = new Tab(name, head);
            this.tabs.push(tab);

            head.onclick = () => {
                this.onClick(tab)
            }

            return container;
        }
    }
}