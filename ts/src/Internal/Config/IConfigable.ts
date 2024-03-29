namespace Freakylay.Internal.Config {
    export interface IConfigable {
        /**
         * returns shortened data for storage purposes
         */
        save(): {};

        /**
         * loads stored data
         */
        load(data: {}): void;
    }
}