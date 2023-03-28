namespace Freakylay.Game {
    /**
     * stuff supported by the game and connection
     * everything is enabled so game instances just have to disable what they do NOT support
     * its more a bitflag class than a real class, this would also fit in a true bit value
     */
    export class Compatibility {
        public supportsCombo: boolean = true;
        public supportsMiss: boolean = true;
        public supportsScore: boolean = true;
        public supportsBlockSpeed: boolean = true;
        public supportsBpm: boolean = true;
        public supportsHealth: boolean = true;
        public supportsAccuracy: boolean = true;
        public supportsTime: boolean = true;
        public supportsRank: boolean = true;
        public supportsFullCombo: boolean = true;
        public supportsPreviousScore: boolean = true;

        public supportsModifier: boolean = true;

        public supportsModifierNoFail: boolean = true;
        public supportsModifierOneLife: boolean = true;
        public supportsModifierFourLives: boolean = true;
        public supportsModifierNoBombs: boolean = true;
        public supportsModifierNoWalls: boolean = true;
        public supportsModifierNoArrows: boolean = true;
        public supportsModifierGhostNotes: boolean = true;
        public supportsModifierDisappearingArrows: boolean = true;
        public supportsModifierSmallNotes: boolean = true;
        public supportsModifierProMode: boolean = true;
        public supportsModifierStrictAngles: boolean = true;
        public supportsModifierZenMode: boolean = true;
        public supportsModifierSlowerSong: boolean = true;
        public supportsModifierFasterSong: boolean = true;
        public supportsModifierSuperFastSong: boolean = true;

        public supportsPracticeMode: boolean = true;
        public supportsPracticeModeSpeed: boolean = true;
        public supportsPracticeModeTimeOffset: boolean = true;

        public supportsKey: boolean = true;
        public supportsPreviousKey: boolean = true;
        public supportsSongInfoMapperName: boolean = true;
        public supportsSongInfoDifficulty: boolean = true;
        public supportsSongInfoCustomDifficulty: boolean = true;
        public supportsSongInfoSongArtist: boolean = true;
        public supportsSongInfoSongName: boolean = true;
        public supportsSongInfoCoverImage: boolean = true;
        public supportsStar: boolean = true; // far ranked bullshit
        public supportsPerformancePoints: boolean = true; // for ranked bullshit

        public supportsLevelChange: boolean = true;
        public supportsLevelPause: boolean = true;
        public supportsLevelFinish: boolean = true;
        public supportsLevelFailed: boolean = true;
        public supportsLevelQuit: boolean = true;

        public supportsPlayerColorsUsage: boolean = true;

        public supportsMultiplayer: boolean = true;
    }
}