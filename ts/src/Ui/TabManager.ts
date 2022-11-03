namespace Freakylay.Ui {
    /**
     * tab manager for option panel
     */
    export class TabManager {
        private tabs: Tab[];

        constructor(developmentMode: boolean) {
            this.tabs = [];

            document.getAll<HTMLDivElement[]>('div[data-tab-name]').forEach((element: HTMLDivElement) => {
                let tab = new Tab(element.dataset
                    ? element.dataset.tabName
                    : element.getAttribute('data-tab-name')
                    , element
                );
                this.tabs.push(tab);
                element.onclick = () => {
                    this.onClick(tab);
                };
            }, this);

            let lastTab = this.tabs.last();
            if (developmentMode) {
                // todo :: test buttons
            } else {
                lastTab.destroy();
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
    }
}