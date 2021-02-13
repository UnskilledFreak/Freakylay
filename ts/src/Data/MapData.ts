/// <reference path="../Internal/DataKey.ts" />
/// <reference path="../Internal/Helper.ts" />

namespace Freakylay.Data {

    import DataKey = Freakylay.Internal.DataKey;
    import Helper = Freakylay.Internal.Helper;

    export class MapData {

        public GameVersion: DataKey<string>;
        public PluginVersion: DataKey<string>;
        public InLevel: DataKey<boolean>;
        public LevelPaused: DataKey<boolean>;
        public LevelFinished: DataKey<boolean>;
        public LevelFailed: DataKey<boolean>;
        public LevelQuit: DataKey<boolean>;
        public Hash: DataKey<string>;
        public SongName: DataKey<string>;
        public SongSubName: DataKey<string>;
        public SongAuthor: DataKey<string>;
        public Mapper: DataKey<string>;
        public BSRKey: DataKey<string>;
        public coverImage: DataKey<string>;
        public Length: DataKey<number>;
        public TimeScale: DataKey<number>;
        public MapType: DataKey<string>;
        public Difficulty: DataKey<string>;
        public CustomDifficultyLabel: DataKey<string>;
        public BPM: DataKey<number>;
        public NJS: DataKey<number>;
        public ModifiersMultiplier: DataKey<number>;
        public PracticeMode: DataKey<boolean>;
        public PP: DataKey<number>;
        public Star: DataKey<number>;
        public IsMultiplayer: DataKey<boolean>;
        public PreviousRecord: DataKey<number>;
        public PreviousBSR: DataKey<string>;

        public Modifiers: Modifiers;
        public PracticeModeModifiers: PracticeModeModifiers;

        constructor() {
            this.GameVersion = new DataKey('GameVersion', '1.13.2');
            this.PluginVersion = new DataKey('PluginVersion', '2.0.0.0');
            this.InLevel = new DataKey('InLevel', false);
            this.LevelPaused = new DataKey('LevelPaused', false);
            this.LevelFinished = new DataKey('LevelFinished', false);
            this.LevelFailed = new DataKey('LevelFailed', false);
            this.LevelQuit = new DataKey('LevelQuit', false);
            this.Hash = new DataKey('Hash', '');
            this.SongName = new DataKey('SongName', '');
            this.SongSubName = new DataKey('SongSubName', '');
            this.SongAuthor = new DataKey('SongAuthor', '');
            this.Mapper = new DataKey('Mapper', '');
            this.BSRKey = new DataKey('BSRKey', 'BSRKey');
            this.coverImage = new DataKey('coverImage', 'img/BS_Logo.jpg');
            this.Length = new DataKey('Length', 60);
            this.TimeScale = new DataKey('TimeScale', 0);
            this.MapType = new DataKey('MapType', 'Standard');
            this.Difficulty = new DataKey('Difficulty', 'ExpertPlus');
            this.CustomDifficultyLabel = new DataKey('CustomDifficultyLabel', '');
            this.BPM = new DataKey('BPM', 0);
            this.NJS = new DataKey('NJS', 0);
            this.ModifiersMultiplier = new DataKey('ModifiersMultiplier', 1);
            this.PracticeMode = new DataKey('PracticeMode', false);
            this.PP = new DataKey('PP', 0);
            this.Star = new DataKey('Star', 0);
            this.IsMultiplayer = new DataKey('IsMultiplayer', false);
            this.PreviousRecord = new DataKey('PreviousRecord', 0);
            this.PreviousBSR = new DataKey('PreviousBSR', '');

            this.Modifiers = new Modifiers();
            this.PracticeModeModifiers = new PracticeModeModifiers();
        }

        public update(data: {}): void {
            this.GameVersion.update(data);
            this.PluginVersion.update(data);
            this.InLevel.update(data);
            this.LevelPaused.update(data);
            this.LevelFinished.update(data);
            this.LevelFailed.update(data);
            this.LevelQuit.update(data);
            this.Hash.update(data);
            this.SongName.update(data);
            this.SongSubName.update(data);
            this.SongAuthor.update(data);
            this.Mapper.update(data);
            this.BSRKey.update(data);
            this.coverImage.update(data);
            this.Length.update(data);
            this.TimeScale.update(data);
            this.MapType.update(data);
            this.Difficulty.update(data);
            this.CustomDifficultyLabel.update(data);
            this.BPM.update(data);
            this.NJS.update(data);
            this.ModifiersMultiplier.update(data);
            this.PracticeMode.update(data);
            this.PP.update(data);
            this.Star.update(data);
            this.IsMultiplayer.update(data);
            this.PreviousRecord.update(data);
            this.PreviousBSR.update(data);

            this.Modifiers.update(Helper.isset(data, 'Modifiers', {}));
            this.PracticeModeModifiers.update(Helper.isset(data, 'PracticeModeModifiers', {}));
        }

        public getDifficultyString(): string {
            let diff = this.Difficulty.getValue();
            return diff == 'ExpertPlus' ? 'Expert+' : diff;
        }

        public getFullDifficultyLabel(hideDefaultDifficulty: boolean): string {
            let normalDifficultyString = this.getDifficultyString();
            let custom = this.CustomDifficultyLabel.getValue();

            if (hideDefaultDifficulty) {
                return custom.length > 0 ? custom : normalDifficultyString;
            }

            if (custom === '' || custom === normalDifficultyString) {
                return normalDifficultyString;
            } else {
                return custom + ' - ' + normalDifficultyString;
            }
        }

        public getSongAuthorLine(): string {
            let name = this.SongAuthor.getValue();

            if (this.SongSubName.getValue().length > 0) {
                //name += ' <small>' + this.SongSubName.getValue() + '</small>';
                name += ' - ' + this.SongSubName.getValue();
            }

            return name;
        }
    }
}