namespace Freakylay.Game.BeatSaber.Connection {
    export class HttpStatus_1_20_0 extends BaseConnection {
        connect(gameLinkStatus: Freakylay.Internal.EventProperty<Freakylay.Game.GameLinkStatus>): boolean {
            return false;
        }

        disconnect(): boolean {
            return false;
        }

        displayConnectionSettings(settingsTab: HTMLDivElement, helper: Freakylay.Ui.ConfigHelper): void {
        }

        getName(): string {
            return 'HttpStatus 1.20.0 (WIP)';
        }

        loadConfig(data: {}): void {
        }

        onUnregister(): void {
        }

        reconnect(): boolean {
            return false;
        }

        saveConfig(): {} {
            return {};
        }

        protected setCompatibility(): void {
        }

        supportsCustomIp(): boolean {
            return false;
        }

        supportsCustomPort(): boolean {
            return false;
        }
    }
}