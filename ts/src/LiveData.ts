namespace Freakylay {
    export class LiveData {

        public InLevel: boolean;
        public LevelPaused: boolean;
        public LevelFinished: boolean;
        public LevelFailed: boolean;
        public LevelQuit: boolean;

        public Score: number;
        public FullCombo: boolean;
        public Combo: number;
        public Misses: number;
        public Accuracy: number;
        public BlockHitScores: number[];
        public PlayerHealth: number;
        public TimeElapsed: number;

        constructor(data: object) {
            // Level
            this.InLevel = Helper.isset(data, 'InLevel', false);
            this.LevelPaused = Helper.isset(data, 'LevelPaused', false);
            this.LevelFinished = Helper.isset(data, 'LevelFinished', false);
            this.LevelFailed = Helper.isset(data, 'LevelFailed', false);
            this.LevelQuit = Helper.isset(data, 'LevelQuit', false);

            // Points
            this.Score = Helper.isset(data, 'Score', 0);
            this.FullCombo = Helper.isset(data, 'FullCombo', false);
            this.Combo = Helper.isset(data, 'Combo', 0);
            this.Misses = Helper.isset(data, 'Misses', 0);
            this.Accuracy = Helper.isset(data, 'Accuracy', 0.0);
            this.BlockHitScores = Helper.isset(data, 'BlockHitScores', []);
            this.PlayerHealth = Helper.isset(data, 'PlayerHealth', 0);

            // time
            this.TimeElapsed = Helper.isset(data, 'TimeElapsed', 0);
        }
    }
}