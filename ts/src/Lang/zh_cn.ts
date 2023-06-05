namespace Freakylay.Lang {
    export class Localization_zh_cn extends Freakylay.Lang.Localization {
        constructor() {
            super(null);
        }
        public getData(): Object {
            return {
                "html_head_title": "Freakylay - 多游戏直播叠加层",
                "html_meta_description": "简单易用可定制的叠加层，支持更换颜色，圆形进度条等多种功能。",

                "previousBSRLabel": "上一首BSR",
                "bsr": "BSR",
                "mapper": "谱师",
                "marqueeDifficulty": "难度",
                "marqueeSongArtist": "艺术家",
                "marqueeSongName": "歌曲名称 歌曲名称 歌曲名称 歌曲名称 歌曲名称 歌曲名称",
                "fullComboLabel": "全连FC",
                "rankedLabel": "排名曲",
                "starsLabel": "星级 ",
                "comboLabel": "连击",
                "missLabel": "失误",
                "score": "分数",
                "njsLabel": "谱速",
                "bpmLabel": "曲速",
                "HealthLabel": {
                    "before": "生命值",
                    "after": "%"
                },
                "AccuracyLabel": {
                    "before": "准确度",
                    "after": "%"
                },
                "timeLabel": {
                    "circle": {
                        "before": "时间<br>",
                        "after": ""
                    },
                    "notCircle": {
                        "before": "",
                        "middle": "<br>",
                        "after": ""
                    }
                },
                "practiceMode": "练习模式",
                "practiceModeShort": "PM",
                "practiceModeSongSpeed": "速度：100%",
                "practiceModeSongSpeedLabel": {
                    "before": "速度：",
                    "after": "%"
                },
                "practiceModeTimeOffset": "时间：0",
                "practiceModeTimeOffsetLabel": {
                    "before": "开始：",
                    "after": ""
                },
                "practiceModeSpacer": "",
                "noFailOn0Energy": "不会失败",
                "oneLife": "瞬间失败",
                "fourLives": "4次失误",
                "noBombs": "没有炸弹",
                "noWalls": "没有墙壁",
                "noArrows": "没有箭头",
                "ghostNotes": "幽灵方块",
                "disappearingArrows": "箭头消失",
                "smallNotes": "变小方块",
                "proMode": "专业模式",
                "strictAngles": "严格角度",
                "zenMode": "禅模式",
                "slowerSong": "歌曲减速",
                "fasterSong": "歌曲加速",
                "superFastSong": "歌曲超加速",
                "noFailOn0EnergyShort": "不失",
                "oneLifeShort": "1失",
                "fourLivesShort": "4失",
                "noBombsShort": "无炸",
                "noWallsShort": "无墙",
                "noArrowsShort": "无箭",
                "ghostNotesShort": "幽灵",
                "disappearingArrowsShort": "消箭",
                "smallNotesShort": "变小",
                "proModeShort": "专业",
                "strictAnglesShort": "严格",
                "zenModeShort": "禅",
                "slowerSongShort": "减速",
                "fasterSongShort": "加速",
                "superFastSongShort": "超速",

                "tabs-Welcome": "欢迎",
                "tabs-Game-Connection": "游戏与连接",
                "tabs-Colors": "颜色",
                "tabs-Settings": "设置",
                "tabs-HeartRate": "心率",
                "welcomeLine1-1": "欢迎使用",
                "welcomeVersion": {
                    "before": "Freakylay ",
                    "after": ""
                },

                "welcomeLine1-2": "！",
                "welcomeLine2": "请先到\"游戏与连接\"标签页选择你所游玩的游戏以及对应mod。",
                "welcomeLine3": "V3版在原版本基础上进行了大改，重点是支持多种游戏和模组，同时仍然包含一系列对内容创作者有用的功能。",
                "welcomeLine4-1": "如果你有任何的建议，疑问或需要帮助，请到",
                "welcomeLine4-2": "Github issues",
                "welcomeLine4-3": "提交问题。同时也请提供尽可能多的关于你在哪个游戏使用哪种连接遇到问题的信息。",
                "welcomeLine5": "感谢！-- UnskilledFreak",
                "languageListLabel": "语言:",
                "gameLinkStatusLabel": "状态:",
                "gameLinkStatus": {
                    "Not Connected": "未连接",
                    "Connecting...": "连接中...",
                    "Connected!": "已连接！",
                },
                "gameLinkStatusNotice": "如果一直卡在\"连接中\"20秒以上则说明有地方出问题了。请检查一下设置项并确保你的游戏和mod正常运行。",
                "gameListLabel": "选择游戏：",
                "gameList": {
                    "None": "选择",
                    "Beat Saber": "节奏光剑(Beat Saber)"
                },
                "connectionListLabel": "连接方式:",
                "connectionList": {
                    "None": "选择",
                    "DataPuller_2_0_12": "DataPuller 2.0.12",
                    "DataPuller_2_1_0": "DataPuller 2.1.0+",
                    "HttpSiraStatus_9_0_1": "Http(Sira)Status 9.0.1+",
                },
                "connectionUseScoreWithMultipliers": "使用应用修改项的分数",
                "connectionIP": "IP：",
                "connectionPort": "端口号：",
                "connectToGame": "连接!",

                "colorManagement": "颜色管理",
                "colorBackgroundColor": "背景颜色",
                "colorTextColor": "文字颜色",
                "colorRandomBackgroundColor": "随机背景颜色",
                "colorInputsRed": "红色：",
                "colorInputsGreen": "绿色：",
                "colorInputsBlue": "蓝色：",
                "colorInputsAlpha": "透明度：",
                "alphaInfo": "虽然不推荐但是应该可以用;)",
                "colorRandomTextColor": "随机文字颜色",
                "defaultColorInfoText": "这并不会改变透明度，只会使用RGB数值！",
                "UserOverrideColorSetting": " .......怎么会有人把两个颜色设成一样的...",

                "settingsBanner": "请注意：不是所有游戏或者连接方式都支持以下所有设置项。",
                "settingsLooks": "外观",
                "settingsLooksDisplayShortModifierNames": "显示缩略版修改项名称",
                "settingsLooksShowPreviousMapKey": "显示上一个谱面的key(需DataPuller)",
                "settingsLooksShowMissBadHitCounter": "显示失误/差评挥砍计数器",
                "settingsLooksShowBPM": "显示曲速(BPM)",
                "settingsLooksShowBlockSpeed": "显示谱速(NJS)",
                "settingsLooksShowCombo": "显示连击",
                "settingsLooksHideFullComboInfo": "隐藏全连(FC)信息",
                "settingsLooksHideDefaultDifficultyIfDifficultyHasCustomName": "显示自定义难度名称而不是默认难度名称(需DataPuller)",
                "settingsLooksHideCompleteModifierSection": "完全隐藏修改项栏",
                "settingsLooksHideCompleteCounterSection": "完全隐藏计数器栏",
                "settingsLooksHideCompleteSongInfoSection": "完全隐藏歌曲信息栏",
                "settingsLooksTimeCircleMatchesOtherCircles": "时间栏显示与其他匹配",
                "settingsLooksShowIfMapIsRanked": "如果谱面为排名曲则显示(需DataPuller)",
                "settingsLooksShowRankedStarDifficultyInfo": "显示排名曲星级/难度信息(需DataPuller)",
                "settingsLooksShowRankBehindTheAccuracyCircle": "在准确度栏后面显示评级(需DataPuller)",
                "settingsLooksBorderRadius": "圆角边框",
                "settingsLooksOverrideBackgroundColorWithMapColor": {
                    "label": "强制使用谱面颜色代替背景颜色(需HttpSiraStatus)",
                    "options": {
                        "0": "不使用",
                        "1": "使用环境颜色中的左颜色",
                        "2": "使用环境颜色中的右颜色",
                        "3": "使用炸弹颜色",
                        "4": "使用墙颜色(仅支持Sira！)",
                        "5": "使用左光剑颜色",
                        "6": "使用右光剑颜色"
                        // "NoOverride": "不使用",
                        // "UseLeftEnvironmentColor": "使用环境颜色中的左颜色",
                        // "UseRightEnvironmentColor": "使用环境颜色中的右颜色",
                        // "UseObstacleColor": "使用炸弹颜色",
                        // "UseWallColor": "使用墙颜色(仅支持Sira！)",
                        // "UseLeftSaberColor": "使用左光剑颜色",
                        // "UseRightSaberColor": "使用右光剑颜色"
                    }
                },
                "settingsLooksOverrideTextColorWithMapColor": {
                    "label": "强制使用谱面颜色代替文字颜色(需HttpSiraStatus)",
                    "options": {
                        "0": "不使用",
                        "1": "使用环境颜色中的左颜色",
                        "2": "使用环境颜色中的右颜色",
                        "3": "使用炸弹颜色",
                        "4": "使用墙颜色(仅支持Sira！)",
                        "5": "使用左光剑颜色",
                        "6": "使用右光剑颜色"
                        // "NoOverride": "不使用",
                        // "UseLeftEnvironmentColor": "使用环境颜色中的左颜色",
                        // "UseRightEnvironmentColor": "使用环境颜色中的右颜色",
                        // "UseObstacleColor": "使用炸弹颜色",
                        // "UseWallColor": "使用墙颜色(仅支持Sira！)",
                        // "UseLeftSaberColor": "使用左光剑颜色",
                        // "UseRightSaberColor": "使用右光剑颜色"
                    }
                },
                "settingsPositions": "位置",
                "settingsPositionsMoveSongInfoToRightSide": "将歌曲信息移动至封面右侧(左对齐)",
                "settingsPositionsMoveSongInfoToTop": "将歌曲信息移动至封面顶部(上对齐)",
                "settingsPositionsMoveCounterSectionToTop": "将计数器栏移动至顶部(上对齐)",
                "settingsPositionsMoveModifiersToRightSide": "将修改项栏移动至右侧(左对齐)",
                "settingsPositionsMargin": "边距",
                "settingsMisc": "杂项",
                "settingsMiscCompareScoreWithLastScore": {
                    "label": "与之前的分数对比(需DataPuller)",
                    "options": {
                        "0": "不对比",
                        "1": "传统 - Freakylay 2 箭头",
                        "2": "使用相差值"
                        // "DoNotCompare": "不对比",
                        // "LegacyFreakylay2Arrow": "传统 - Freakylay 2 箭头",
                        // "UseOffset": "使用相差值"
                    }
                },
                "settingsMiscAnimateScoreIncrement": "分数增加使用动画",
                "settingsMiscShowSongSpeedAsRelativeValues": "显示歌曲信息的相对值(-20% 而不是 80%)",
                "settingsMiscTestWithBackgroundImage": "使用测试背景图片",

                "heartRateConnectionType": "连接类型",
                "heartRateConnectionStateLabel": "连接状态：",
                "heartRateConnectionState": {
                    "Ready": "就绪",
                    "Fetching": "获取中",
                    "Error": "错误",
                    "NotConnected": "未连接"
                },
                "heartRateFeedButton": "应用",
                "heartRateFeedTypeLabel": "数据来源：",
                "heartRateFeedType": {
                    "Disabled": "禁用",
                    "Token": "Pulsoid令牌(Token)",
                    "JSON": "Pulsoid JSON (弃用)",
                    "HypeRate": "HypeRate",
                },
                "heartRateHintJson-1": "在",
                "heartRateHintJson-2": "Pulsoid配置",
                "heartRateHintJson-3": "中查看'引用数据(Feed reference)'。\n\n警告！这种数据来源你将会在未来的版本中被Freakylay或Pulsoid团队弃用。它可能随时失效。",
                "heartRateHintToken-1": "获取或刷新令牌(Token)点击",
                "heartRateAuthLink": "这里",
                "heartRateHintToken-2": "。\n在上面的输入框中粘贴生成的令牌(Token)。",
                "heartRateHintSession": "粘贴app给你的会话ID(Session-ID)。",
                "heartRateFeedUrlText": "URL或者令牌(token)",
                "heartRateFeedTextDisabled": "URL或者令牌(token)",
                "heartRateFeedTextJSON": "JSON URL",
                "heartRateFeedTextToken": "令牌(token)",
                "heartRateFeedTextDummy": "令牌(token)",
                "heartRateFeedTextDummyValue": "无需输入 =)",
                "heartRateFeedTextHypeRate": "会话ID(Session-ID)",
                "pulsoidThanks": "非常感谢Pulsoid团队帮助实现该功能！",
                "hypeRateThanks": "非常感谢HypeRate团队帮助实现该功能！",
                "heartRateCircleBarLabel": {
                    "before": "心率<br>",
                    "after": ""
                },
                "heartRateOffsetHint": "如果不显示的话可能是因为超出范围了。尝试调整偏移值并确保连接保持在\"获取中\"状态。",
                "heartRatePullInfo": "数值越大展示越多数据，数值越小图表移动更快。一般来说心率数据每秒更新一次，但是不完全保证每一秒都会有数据。",
                "heartRateSettingsUseDynamicMaxBPM": "使用动态最大心率",
                "heartRateSettingsMaximumBPMToDisplay": "显示最大心率(影响圆形)",
                "heartRateSettingsGraph": "图表",
                "heartRateSettingsDisplayGraph": "显示图表",
                "heartRateSettingsUseBackground": "使用背景",
                "heartRateSettingsStrokeLineWithBackgroundColorInNoBackgroundMode": "在无背景模式中使用背景颜色描边",
                "heartRateSettingsGraphWidth": "宽度",
                "heartRateSettingsGraphHeight": "高度",
                "heartRateSettingsDisableCircleBarInCounterSection": "在计数器栏中禁用圆形进度条",
                "heartRateSettingsDisplayNumbers": "显示数字",
                "heartRateSettingsFontSizeForMinAndMaxBPM": "最大/最小心率的字体大小",
                "heartRateSettingsFontSizeForCurrentBPM": "当前心率的字体大小",
                "heartRateSettingsAnchor": {
                    "label": "锚点",
                    "options": {
                        "0": "左上",
                        "1": "右上",
                        "2": "左下",
                        "3": "右下",
                        "4": "中央"
                        // "TopLeft": "左上",
                        // "TopRight": "右上",
                        // "BottomLeft": "左下",
                        // "BottomRight": "右上",
                        // "CenterScreen": "中央"
                    }
                },
                "heartRateSettingsOffsetX": "X轴偏移值",
                "heartRateSettingsOffsetY": "Y轴偏移值",
                "heartRateSettingsEventsToShow": "显示数据量",

                "settings": "设置",
                "urlTextLabel": "叠加层URL：",
                "huh": "怎么可能有人需要99.9%的时候都看不到的漂亮的设置面板呢？",
                "copyright": "Freakylay",

                "versionHint1": "欢迎使用但是很抱歉打扰一下！",
                "versionHint2-1": "你在使用老版本的Freakylay。<br>最新版本是",
                "versionHint2-2": "！",
                "versionHint3": "新版本与老版本的配置文件是兼容的，你只需要在设置面板里更改游戏和连接方式即可。",
                "versionHint4": "请点击下面的按钮就可以打开设置面板做更多的配置更改！",
                "versionHintOptions": "打开设置面板",
                "versionWarning": "Freakylay"
            };
        }
    }
}