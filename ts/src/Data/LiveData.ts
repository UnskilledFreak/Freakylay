/// <reference path="./AbstractModifierList.ts" />

namespace Freakylay.Data {
    import AbstractModifierList = FreakyLay.Data.AbstractModifierList;

    export class LiveData extends AbstractModifierList {

        public InLevel: Modifier<boolean>;
        public LevelPaused: Modifier<boolean>;
        public LevelFinished: Modifier<boolean>;
        public LevelFailed: Modifier<boolean>;
        public LevelQuit: Modifier<boolean>;

        public Score: Modifier<number>;
        public FullCombo: Modifier<boolean>;
        public Combo: Modifier<number>;
        public Misses: Modifier<number>;
        public Accuracy: Modifier<number>;
        public BlockHitScores: Modifier<number[]>;
        public PlayerHealth: Modifier<number>;
        public TimeElapsed: Modifier<number>;

        constructor(data: object) {
            super();

            // Level
            this.InLevel = new Modifier('InLevel', false);
            this.LevelPaused = new Modifier('LevelPaused', false);
            this.LevelFinished = new Modifier('LevelFinished', false);
            this.LevelFailed = new Modifier('LevelFailed', false);
            this.LevelQuit = new Modifier('LevelQuit', false);

            // Points
            this.Score = new Modifier('Score', 0);
            this.FullCombo = new Modifier('FullCombo', false);
            this.Combo = new Modifier('Combo', 0);
            this.Misses = new Modifier('Misses', 0);
            this.Accuracy = new Modifier('Accuracy', 0.0);
            this.BlockHitScores = new Modifier('BlockHitScores', []);
            this.PlayerHealth = new Modifier('PlayerHealth', 0);

            // time
            this.TimeElapsed = new Modifier('TimeElapsed', 0);

            this.add(
                'live',
                this.InLevel,
                this.LevelPaused,
                this.LevelFinished,
                this.LevelFailed,
                this.LevelQuit,
                this.Score,
                this.FullCombo,
                this.Combo,
                this.Misses,
                this.Accuracy,
                this.BlockHitScores,
                this.PlayerHealth,
                this.TimeElapsed
            );
        }
    }
}