namespace FreakyLay.Data {
    import Modifier = Freakylay.Modifier;
    import Helper = Freakylay.Helper;
    import LiveData = Freakylay.Data.LiveData;
    import StaticData = Freakylay.Data.StaticData;

    export class AbstractModifierList {
        private allModifiers: any[][];

        constructor() {
            this.allModifiers = [];
        }

        public add(category: string, ...modifier: Modifier<any>[]): void {
            if (!Helper.issetCheck(this.allModifiers, category)) {
                this.allModifiers[category] = [];
            }
            modifier.forEach(x => {
                this.allModifiers[category].push(x);
            });
        }

        public getCategoryList(category: string): Modifier<any>[] {
            if (Helper.issetCheck(this.allModifiers, category)) {
                return this.allModifiers[category];
            }
            return [];
        }

        public update(data: LiveData | StaticData): void {
            this.allModifiers.forEach(x => {
                x.forEach((y: Modifier<LiveData | StaticData>) => {
                    y.update(data);
                })
            });
        }
    }
}