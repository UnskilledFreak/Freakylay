namespace Freakylay.Data {
    export class LiveData {
        public Score: DataKey<number>;
        public ScoreWithMultipliers: DataKey<number>;
        public MaxScore: DataKey<number>;
        public MaxScoreWithMultipliers: DataKey<number>;
        public Rank: DataKey<string>;
        public FullCombo: DataKey<boolean>;
        public Combo: DataKey<number>;
        public Misses: DataKey<number>;
        public Accuracy: DataKey<number>;
        public BlockHitScores: DataKey<number[]>;
        public PlayerHealth: DataKey<number>;
        public TimeElapsed: DataKey<number>;

        constructor() {
            this.Score = new DataKey('Score', 0);
            this.ScoreWithMultipliers = new DataKey('ScoreWithMultipliers', 0);
            this.MaxScore = new DataKey('MaxScore', 0);
            this.MaxScoreWithMultipliers = new DataKey('MaxScoreWithMultipliers', 0);
            this.Rank = new DataKey('Rank', '');
            this.FullCombo = new DataKey('FullCombo', false);
            this.Combo = new DataKey('Combo', 0);
            this.Misses = new DataKey('Misses', 0);
            this.Accuracy = new DataKey('Accuracy', 0);
            this.BlockHitScores = new DataKey('BlockHitScores', []);
            this.PlayerHealth = new DataKey('PlayerHealth', 0);
            this.TimeElapsed = new DataKey('TimeElapsed', 0);
        }

        public update(data: {}): void {
            this.Score.update(data);
            this.ScoreWithMultipliers.update(data);
            this.MaxScore.update(data);
            this.MaxScoreWithMultipliers.update(data);
            this.Rank.update(data);
            this.FullCombo.update(data);
            this.Combo.update(data);
            this.Misses.update(data);
            this.Accuracy.update(data);
            this.BlockHitScores.update(data);
            this.PlayerHealth.update(data);
            this.TimeElapsed.update(data);
        }
    }
}