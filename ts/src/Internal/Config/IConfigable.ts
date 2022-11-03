namespace Freakylay.Internal.Config {
    export interface IConfigable {
        /**
         * returns shortened data for storage purposes
         */
        save(): any;

        /**
         * loads stored data
         */
        load(data: any): void;
    }
}