///<reference path="../AbstractConnector.ts"/>
namespace Freakylay.DataTransfer.HeartRate.Connector {
    import Config = Freakylay.Internal.Config.Config;
    import EventProperty = Freakylay.Internal.EventProperty;

    export class NullBeat extends AbstractConnector {

        constructor(config: Config, connectionState: EventProperty<ConnectionState>) {
            super(config, 'NullBeat', connectionState);
        }

        public start(): void {
            this.connectionState.Value = Freakylay.DataTransfer.HeartRate.ConnectionState.NotConnected;
            this.bpm.Value = 0;
        }

        public stop(): void {
        }
    }
}