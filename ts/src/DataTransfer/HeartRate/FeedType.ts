namespace Freakylay.DataTransfer.HeartRate {
    /**
     * possible types to communicate with Pulsoid
     */
    export enum FeedType {
        Disabled,
        Token, // pulsoid
        JSON, // pulsoid
        Dummy, // test
        HypeRate
    }
}