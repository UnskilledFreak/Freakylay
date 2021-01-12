import {Helper} from "./Helper";
import {Modifiers} from "./Modifiers";
import {PracticeModeModifiers} from "./PracticeModifiers";

export class StaticData {

    public Hash: string;
    public SongName: string;
    public SongSubName: string;
    public SongAuthor: string;
    public Mapper: string;
    public BSRKey: string;
    public coverImage: string;
    public Length: number;

    public MapType: number;
    public Difficulty: string;
    public CustomDifficultyLabel: string;
    public BPM: number;
    public NJS: number;
    public PracticeMode: boolean;
    public PP: number;
    public Star: number;

    public Modifiers: Modifiers;
    public PracticeModeModifiers: PracticeModeModifiers;

    public PreviousRecord: number;
    public PreviousBSR: string;

    constructor(data: object) {
        // Map
        this.Hash = Helper.isset(data, 'Hash', 'SongHash');
        this.SongName = Helper.isset(data, 'SongName', 'SongName');
        this.SongSubName = Helper.isset(data, 'SongSubName', 'SongSubName');
        this.SongAuthor = Helper.isset(data, 'SongAuthor', 'SongAuthor');
        this.Mapper = Helper.isset(data, 'Mapper', 'Mapper');
        this.BSRKey = Helper.isset(data, 'BSRKey', 'BSRKey');
        this.coverImage = Helper.isset(data, 'coverImage', 'img/tyGQRx5x_400x400.jpg');
        this.Length = Helper.isset(data, 'Length', 1);

        // Difficulty
        this.MapType = Helper.isset(data, 'MapType', 0);
        this.Difficulty = Helper.isset(data, 'Difficulty', 'Normal');
        this.CustomDifficultyLabel = Helper.isset(data, 'CustomDifficultyLabel', '');
        this.BPM = Helper.isset(data, 'BPM', 0);
        this.NJS = Helper.isset(data, 'NJS', 0.0);
        this.PracticeMode = Helper.isset(data, 'PracticeMode', false);
        this.PP = Helper.isset(data, 'PP', 0);
        this.Star = Helper.isset(data, 'Star', 0);

        //Modifiers
        this.Modifiers = new Modifiers(Helper.isset(data, 'Modifiers', {}))
        this.PracticeModeModifiers = new PracticeModeModifiers(Helper.isset(data, 'PracticeModeModifiers', {}))

        this.PreviousRecord = Helper.isset(data, 'PreviousRecord', 0);
        this.PreviousBSR = Helper.isset(data, 'PreviousBSR', 0);
    }

    public getDifficultyString(): string {
        /*
        switch (this.Difficulty) {
            case 1:
                return 'Easy';
            case 3:
                return 'Normal';
            case 5:
                return 'Hard';
            case 7:
                return 'Expert';
            case 9:
                return 'Expert+';
            default:
                return 'Difficulty: ' + this.Difficulty;
        }
        */
        switch (this.Difficulty) {
            case 'ExpertPlus':
                return 'Expert+';
            default:
                return this.Difficulty;
        }
    }

    public getFullDifficultyLabel(): string {
        let normalDifficultyString = this.getDifficultyString();
        if (this.CustomDifficultyLabel === '' || this.CustomDifficultyLabel === normalDifficultyString) {
            return normalDifficultyString;
        } else {
            return this.CustomDifficultyLabel + ' - ' + normalDifficultyString;
        }
    }

    public getSongAuthorLine(): string {
        let name = this.SongAuthor;

        if (this.SongSubName.length > 0) {
            name += ' <small>' + this.SongSubName + '</small>';
        }

        return name;
    }
}